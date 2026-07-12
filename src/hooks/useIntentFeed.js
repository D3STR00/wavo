import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const INTENT_LIFETIME_MINUTES = 5;

export function useIntentFeed() {
  const [intents, setIntents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIntents = async () => {
    const { data, error } = await supabase
      .from("active_intents")
      .select(`
        id,
        type,
        message,
        status,
        created_at,
        expires_at,
        user_id,
        users (
          id,
          name
        )
      `)
      .eq("status", "active")
      .gt("expires_at", new Date().toISOString()) // HARD expiry enforcement
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching intents:", error);
      setLoading(false);
      return;
    }

    const now = Date.now();

    const formatted = data.map((intent) => {
      const name = intent.users?.name || "Wavo User";

      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const intentType =
        intent.type.charAt(0).toUpperCase() + intent.type.slice(1);

      const rawTimestamp = intent.created_at;
      const safeTimestamp =
        rawTimestamp.includes("Z") || rawTimestamp.includes("+")
          ? rawTimestamp
          : rawTimestamp + "Z";

      const createdTime = new Date(safeTimestamp).getTime();
      const minutesAgo = Math.floor((now - createdTime) / 60000);

      const remainingMinutes = INTENT_LIFETIME_MINUTES - minutesAgo;

      return {
        id: intent.id,
        userId: intent.user_id,
        initials,
        name,
        intent: intentType,
        message: intent.message || "Down to meet up!",

        // CLEAN TIME LOGIC
        time:
          minutesAgo < 1
            ? "just now"
            : `${minutesAgo} min ago`,

        expiresIn:
          remainingMinutes > 0
            ? `${remainingMinutes} min left`
            : "expired",

        distance: "nearby",
        walk: "",
        online: true,
        matched: false,
      };
    });

    setIntents(formatted);
    setLoading(false);
  };

  useEffect(() => {
    fetchIntents();

    // 🔁 FIX: live refresh so timers don't freeze
    const interval = setInterval(() => {
      fetchIntents();
    }, 60000);

    const channel = supabase
      .channel("intents-feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "intents" },
        fetchIntents
      )
      .subscribe();

    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    intents,
    loading,
    refetch: fetchIntents,
  };
}