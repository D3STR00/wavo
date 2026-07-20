import { Bell } from "lucide-react";
import { INTENTS, type IntentKind } from "@/lib/wavo";
import { cn } from "@/lib/utils";

export function WavoBanner({
  liveCount,
  selected,
  onSelect,
}: {
  liveCount: number;
  selected: IntentKind | null;
  onSelect: (k: IntentKind | null) => void;
}) {
  return (
    <header className="relative overflow-hidden banner-gradient">
      {/* Glow circles — locked in master doc */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-purple/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-16 -bottom-20 h-56 w-56 rounded-full bg-brand-teal/30 blur-3xl" />

      <div className="relative px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-logo-gradient font-display text-3xl font-extrabold tracking-tight">
              wavo
            </h1>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green/15 px-2.5 py-1 text-xs font-semibold text-brand-green ring-1 ring-brand-green/30">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-brand-green" />
              {liveCount} live
            </span>
          </div>
          <button
            aria-label="Notifications"
            className="rounded-full bg-white/5 p-2 text-foreground/80 ring-1 ring-white/10 hover:bg-white/10"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-foreground/70">
          What are you down for right now?
        </p>

        <div className="mt-4 -mx-1 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {INTENTS.map((i) => {
            const active = selected === i.kind;
            return (
              <button
                key={i.kind}
                onClick={() => onSelect(active ? null : i.kind)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-primary/20 text-foreground ring-1 ring-primary"
                    : "bg-white/5 text-foreground/80 ring-1 ring-white/10 hover:bg-white/10",
                )}
              >
                <span className="mr-1.5">{i.emoji}</span>
                {i.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
