import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { INTENT_CONFIG } from "../data/mockUsers";

const FALLBACK_CENTER = [36.8065, 10.1815];
const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

let leafletPromise;

function loadLeaflet() {
  if (typeof window === "undefined") return Promise.reject(new Error("Map is browser-only."));
  if (window.L) return Promise.resolve(window.L);
  if (!leafletPromise) {
    leafletPromise = new Promise((resolve, reject) => {
      if (!document.querySelector('link[data-wavo-leaflet="true"]')) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = LEAFLET_CSS;
        link.dataset.wavoLeaflet = "true";
        document.head.appendChild(link);
      }
      const existing = document.querySelector('script[data-wavo-leaflet="true"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(window.L), { once: true });
        existing.addEventListener("error", reject, { once: true });
        if (window.L) resolve(window.L);
        return;
      }
      const script = document.createElement("script");
      script.src = LEAFLET_JS;
      script.async = true;
      script.dataset.wavoLeaflet = "true";
      script.onload = () => window.L ? resolve(window.L) : reject(new Error("Leaflet did not load."));
      script.onerror = () => reject(new Error("Could not load the map library."));
      document.head.appendChild(script);
    });
  }
  return leafletPromise;
}

function initialsFor(name) {
  return (name || "Wavo User").split(/\s+/).map((part) => part[0] || "").join("").slice(0, 2).toUpperCase();
}

function obfuscatePosition(lat, lng, key) {
  // Keep other people approximate rather than exposing their exact GPS point.
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  const angle = (Math.abs(hash) % 360) * Math.PI / 180;
  const offset = 0.0007;
  return [lat + Math.cos(angle) * offset, lng + Math.sin(angle) * offset];
}

export default function LiveNearbyMap({ intents, activeFilter }) {
  const elementRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(null);
  const watchRef = useRef(null);
  const lastWriteRef = useRef(0);
  const [uid, setUid] = useState(null);
  const [presence, setPresence] = useState([]);
  const [myPosition, setMyPosition] = useState(null);
  const [mapError, setMapError] = useState("");
  const [locationMessage, setLocationMessage] = useState("Requesting your location…");
  const [mapReady, setMapReady] = useState(false);

  const visibleUserIds = useMemo(() => new Set(intents.map((item) => item.userId).filter(Boolean)), [intents]);

  useEffect(() => {
    let cancelled = false;
    let channel;
    let refreshTimer;

    async function loadPresence() {
      const { data, error } = await supabase
        .from("user_presence")
        .select("user_id, lat, lng, is_online, last_active")
        .eq("is_online", true);
      if (!cancelled && !error) setPresence(data || []);
    }

    async function start() {
      const { data: { user } } = await supabase.auth.getUser();
      if (cancelled) return;
      if (user) setUid(user.id);

      await loadPresence();
      if (cancelled) return;

      channel = supabase
        .channel("nearby-map-presence")
        .on("postgres_changes", { event: "*", schema: "public", table: "user_presence" }, loadPresence)
        .on("postgres_changes", { event: "*", schema: "public", table: "intents" }, loadPresence)
        .subscribe();

      refreshTimer = window.setInterval(loadPresence, 20000);

      if (!navigator.geolocation) {
        setLocationMessage("Location is not supported by this browser.");
        return;
      }

      watchRef.current = navigator.geolocation.watchPosition(
        async ({ coords }) => {
          if (cancelled) return;
          const point = { lat: coords.latitude, lng: coords.longitude };
          setMyPosition(point);
          setLocationMessage("Your location is live");
          if (!user || Date.now() - lastWriteRef.current < 30000) return;
          lastWriteRef.current = Date.now();
          const { error } = await supabase.from("user_presence").upsert({
            user_id: user.id,
            lat: point.lat,
            lng: point.lng,
            is_online: true,
            last_active: new Date().toISOString(),
          }, { onConflict: "user_id" });
          if (error) {
            setLocationMessage("Map centered on you; location sync failed.");
            console.error("Wavo location sync failed:", error.message);
          }
        },
        (error) => {
          if (cancelled) return;
          setLocationMessage(error.code === 1 ? "Allow location access to show your position." : "Could not get your location.");
        },
        { enableHighAccuracy: false, maximumAge: 15000, timeout: 12000 },
      );
    }

    start().catch((error) => {
      if (!cancelled) setMapError(error?.message || "Could not load nearby map data.");
    });

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
      if (refreshTimer) window.clearInterval(refreshTimer);
      if (watchRef.current !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchRef.current);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || !elementRef.current || mapRef.current) return;
      const map = L.map(elementRef.current, { zoomControl: true, attributionControl: true });
      map.setView(FALLBACK_CENTER, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);
      markersRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setMapReady(true);
    }).catch((error) => {
      if (!cancelled) setMapError(error?.message || "Could not load the map.");
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const L = window.L;
    if (!mapReady || !map || !L || !markersRef.current) return;
    markersRef.current.clearLayers();

    if (myPosition) {
      map.setView([myPosition.lat, myPosition.lng], Math.max(map.getZoom(), 14), { animate: true });
      L.circleMarker([myPosition.lat, myPosition.lng], {
        radius: 9, color: "#c4b5fd", weight: 3, fillColor: "#7c3aed", fillOpacity: 1,
      }).bindTooltip("You", { direction: "top", offset: [0, -8] }).addTo(markersRef.current);
    }

    const seen = new Set();
    presence.forEach((person) => {
      if (!person.user_id || person.user_id === uid || !visibleUserIds.has(person.user_id)) return;
      if (typeof person.lat !== "number" || typeof person.lng !== "number") return;
      const intent = intents.find((item) => item.userId === person.user_id);
      if (!intent || seen.has(person.user_id)) return;
      seen.add(person.user_id);
      const config = INTENT_CONFIG[intent.intent] || INTENT_CONFIG.Coffee;
      const [lat, lng] = obfuscatePosition(person.lat, person.lng, person.user_id);
      const icon = L.divIcon({
        className: "wavo-live-map-marker",
        html: '<div style="background:' + config.pin + ';color:' + config.pinText + ';border:2px solid rgba(255,255,255,.85);border-radius:999px;padding:5px 8px;font:700 11px/1.2 sans-serif;white-space:nowrap;box-shadow:0 2px 8px #0008">' + config.emoji + " " + initialsFor(intent.name) + '</div>',
        iconSize: [52, 30],
        iconAnchor: [26, 15],
      });
      L.marker([lat, lng], { icon }).bindTooltip(intent.name || "Wavo user", { direction: "top" }).addTo(markersRef.current);
    });
  }, [mapReady, presence, intents, visibleUserIds, uid, myPosition]);

  return (
    <section style={{ margin: "0 14px", borderRadius: 20, overflow: "hidden", position: "relative", flexShrink: 0, height: 260, background: "#0D1A1A", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div ref={elementRef} style={{ width: "100%", height: "100%", background: "#0D1A1A" }} />
      <div style={{ position: "absolute", zIndex: 500, left: 10, top: 10, maxWidth: "78%", padding: "6px 9px", borderRadius: 10, background: "rgba(12,12,20,.88)", color: "#D8D4E8", fontSize: 10, backdropFilter: "blur(8px)" }}>
        {mapError || locationMessage}
      </div>
      <div style={{ position: "absolute", zIndex: 500, right: 10, bottom: 10, padding: "5px 8px", borderRadius: 8, background: "rgba(12,12,20,.82)", color: "#D8D4E8", fontSize: 9 }}>
        {presence.filter((person) => person.user_id !== uid && visibleUserIds.has(person.user_id) && typeof person.lat === "number" && typeof person.lng === "number").length} mapped nearby
      </div>
    </section>
  );
}
