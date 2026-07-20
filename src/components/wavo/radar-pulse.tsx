import { intentBy, type IntentKind } from "@/lib/wavo";
import { cn } from "@/lib/utils";

/** Animated radar visualization — used when the wall is empty.
 *  Communicates "you're broadcasting live" instead of "nothing here". */
export function RadarPulse({ intent }: { intent?: IntentKind }) {
  const i = intent ? intentBy(intent) : null;
  return (
    <div className="relative mx-auto mt-6 flex h-64 w-64 items-center justify-center">
      {/* concentric rings */}
      {[0, 1, 2].map((k) => (
        <span
          key={k}
          className="radar-ring absolute inset-0 rounded-full ring-1 ring-white/10"
          style={{ animationDelay: `${k * 1.1}s` }}
        />
      ))}
      {/* grid crosshair */}
      <span className="absolute inset-x-6 top-1/2 h-px bg-white/5" />
      <span className="absolute inset-y-6 left-1/2 w-px bg-white/5" />
      {/* sweeping cone */}
      <span
        className={cn(
          "radar-sweep absolute inset-4 rounded-full",
          i ? i.glow : "bg-brand-purple",
        )}
      />
      {/* core */}
      <span
        className={cn(
          "relative z-10 flex h-16 w-16 items-center justify-center rounded-full text-2xl ring-2 ring-white/25 shadow-[0_0_40px_-4px_currentColor]",
          i ? i.glow : "bg-brand-purple",
        )}
      >
        {i?.emoji ?? "◉"}
      </span>
    </div>
  );
}
