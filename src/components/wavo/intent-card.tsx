import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { intentBy, initialsFor, fakeDistance, type IntentKind } from "@/lib/wavo";
import { cn } from "@/lib/utils";

export type NearbyItem = {
  userId: string;
  name: string;
  intent: IntentKind;
  message?: string | null;
  createdAt: string;
  expiresAt: string;
  state: "available" | "matched" | "normal";
  waveState?: "idle" | "sent" | "matched";
};

function useCountdown(expiresAt: string) {
  const [left, setLeft] = useState(() =>
    Math.max(0, new Date(expiresAt).getTime() - Date.now()),
  );
  useEffect(() => {
    const end = new Date(expiresAt).getTime();
    const t = setInterval(() => {
      setLeft(Math.max(0, end - Date.now()));
    }, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);
  const sec = Math.ceil(left / 1000);
  const mm = Math.floor(sec / 60);
  const ss = sec % 60;
  return `${mm}:${ss.toString().padStart(2, "0")}`;
}

export function IntentCard({
  item,
  onWave,
  disabled,
}: {
  item: NearbyItem;
  onWave: () => void;
  disabled?: boolean;
}) {
  const intent = intentBy(item.intent);
  const matched = item.waveState === "matched" || item.state === "matched";
  const sent = item.waveState === "sent";
  const countdown = useCountdown(item.expiresAt);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 ring-1 transition-all",
        intent.bg,
        matched ? "ring-brand-green/60" : "ring-white/10",
        item.state === "available" && !matched && "ring-white/25",
      )}
    >
      <span className="pointer-events-none absolute -right-2 -bottom-6 text-8xl opacity-5 select-none">
        {intent.emoji}
      </span>
      <span
        className={cn(
          "pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full blur-3xl opacity-30",
          intent.glow,
        )}
      />

      <div className="relative flex items-start gap-3">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-foreground ring-2",
            intent.glow,
            "ring-white/20",
          )}
        >
          {initialsFor(item.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-foreground">{item.name}</p>
            {item.state === "available" && (
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand-green" />
            )}
          </div>
          <p className="text-xs text-foreground/60">
            {fakeDistance(item.userId)} · live {countdown}
          </p>
          {item.message ? (
            <p className="mt-2 line-clamp-2 text-sm text-foreground/85">
              {item.message}
            </p>
          ) : (
            <p className="mt-2 text-sm text-foreground/70">
              Down for {intent.label.toLowerCase()} right now
            </p>
          )}
        </div>
      </div>

      <div className="relative mt-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-foreground/80 ring-1 ring-white/10">
          {intent.emoji} {intent.label}
        </span>

        <button
          onClick={onWave}
          disabled={disabled || matched || sent}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-70",
            matched
              ? "bg-gradient-to-r from-brand-green to-brand-teal"
              : sent
                ? "bg-white/10 text-foreground/70"
                : `bg-gradient-to-r ${intent.buttonFrom} ${intent.buttonTo} hover:brightness-110`,
          )}
        >
          {matched ? (
            <>
              <Check className="h-4 w-4" /> Matched
            </>
          ) : sent ? (
            <>👋 Wave sent</>
          ) : (
            <>👋 Wave</>
          )}
        </button>
      </div>
    </div>
  );
}
