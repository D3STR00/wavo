import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { INTENTS, intentBy, type IntentKind } from "@/lib/wavo";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const BROADCAST_MS = 5 * 60 * 1000;

export type LiveIntent = {
  id: string;
  kind: IntentKind;
  createdAt: string;
};

export function GoLiveControl({
  uid,
  live,
  onChange,
}: {
  uid: string;
  live: LiveIntent | null;
  onChange: () => void;
}) {
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [remaining, setRemaining] = useState<number>(0);

  // Countdown tick
  useEffect(() => {
    if (!live) {
      setRemaining(0);
      return;
    }
    const end = new Date(live.createdAt).getTime() + BROADCAST_MS;
    const tick = () => {
      const left = end - Date.now();
      setRemaining(left);
      if (left <= 0) {
        void goOffline();
      }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live?.id]);

  async function pick(kind: IntentKind) {
    if (busy) return;
    setBusy(true);
    try {
      // End any prior live intents
      await supabase
        .from("intents")
        .update({ status: "idle" })
        .eq("user_id", uid)
        .eq("status", "live");
      const expires = new Date(Date.now() + BROADCAST_MS).toISOString();
      await supabase.from("intents").insert({
        user_id: uid,
        kind,
        status: "live",
        expires_at: expires,
      });
      await supabase.from("user_presence").upsert({
        user_id: uid,
        is_online: true,
        last_seen_at: new Date().toISOString(),
      });
      setPicking(false);
      onChange();
    } finally {
      setBusy(false);
    }
  }

  async function goOffline() {
    if (busy) return;
    setBusy(true);
    try {
      await supabase
        .from("intents")
        .update({ status: "idle", expires_at: new Date().toISOString() })
        .eq("user_id", uid)
        .eq("status", "live");
      await supabase.from("user_presence").upsert({
        user_id: uid,
        is_online: false,
        last_seen_at: new Date().toISOString(),
      });
      onChange();
    } finally {
      setBusy(false);
    }
  }

  if (live) {
    const i = intentBy(live.kind);
    const totalSec = Math.max(0, Math.ceil(remaining / 1000));
    const mm = Math.floor(totalSec / 60);
    const ss = totalSec % 60;
    return (
      <div className={cn("relative overflow-hidden rounded-2xl p-4 ring-1 ring-white/15", i.bg)}>
        <span className={cn("pointer-events-none absolute -top-14 -right-10 h-40 w-40 rounded-full blur-3xl opacity-40", i.glow)} />
        <div className="relative flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/20 px-2.5 py-1 text-xs font-bold uppercase tracking-widest text-brand-green ring-1 ring-brand-green/40">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand-green" />
            Live
          </span>
          <span className="text-sm text-foreground/80">
            {i.emoji} {i.label}
          </span>
          <span className="ml-auto font-mono text-lg font-semibold tabular-nums text-foreground">
            {mm}:{ss.toString().padStart(2, "0")}
          </span>
        </div>
        <button
          onClick={goOffline}
          disabled={busy}
          className="relative mt-3 w-full rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-foreground/90 ring-1 ring-white/15 hover:bg-white/15 disabled:opacity-60"
        >
          Go offline
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setPicking(true)}
        className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-brand-purple to-brand-green py-4 text-base font-semibold text-primary-foreground shadow-lg hover:brightness-110"
      >
        <span className="pulse-dot mr-2 inline-block h-2 w-2 rounded-full bg-white/90 align-middle" />
        Go Live
      </button>

      {picking && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          onClick={() => !busy && setPicking(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-background p-5 ring-1 ring-white/10 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg font-bold">Pick your vibe</h3>
                <p className="text-xs text-foreground/60">
                  You'll broadcast for 5 minutes.
                </p>
              </div>
              <button
                onClick={() => setPicking(false)}
                aria-label="Close"
                className="rounded-full bg-white/5 p-2 ring-1 ring-white/10 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {INTENTS.map((i) => (
                <button
                  key={i.kind}
                  disabled={busy}
                  onClick={() => pick(i.kind)}
                  className={cn(
                    "rounded-2xl p-4 text-left ring-1 ring-white/10 transition hover:ring-primary disabled:opacity-60",
                    i.bg,
                  )}
                >
                  <div className="text-2xl">{i.emoji}</div>
                  <div className="mt-1 font-semibold">{i.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
