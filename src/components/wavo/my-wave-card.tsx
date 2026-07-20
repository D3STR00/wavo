import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";
import { intentBy, timeAgo, type IntentKind } from "@/lib/wavo";
import { cn } from "@/lib/utils";

/** Hero card at the top of Nearby: "your live wave is broadcasting". */
export function MyWaveCard({
  kind,
  message,
  createdAt,
}: {
  kind: IntentKind;
  message: string | null;
  createdAt: string;
}) {
  const i = intentBy(kind);
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 ring-1 ring-white/15",
        i.bg,
      )}
    >
      <span
        className={cn(
          "pointer-events-none absolute -top-14 -right-10 h-40 w-40 rounded-full blur-3xl opacity-40",
          i.glow,
        )}
      />
      <span
        className="pointer-events-none absolute -left-6 -bottom-8 h-32 w-32 rounded-full blur-3xl opacity-25 bg-brand-purple"
      />

      <div className="relative flex items-center gap-3">
        <div className="relative">
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full text-lg ring-2 ring-white/25",
              i.glow,
            )}
          >
            {i.emoji}
          </span>
          <span className="pulse-dot absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-brand-green ring-2 ring-background" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/60">
            You're live · {timeAgo(createdAt)}
          </p>
          <p className="truncate font-semibold text-foreground">
            {message?.trim() ? message : `Down for ${i.label.toLowerCase()} right now`}
          </p>
        </div>
        <Link
          to="/profile"
          aria-label="Edit your wave"
          className="rounded-full bg-white/10 p-2 text-foreground/80 ring-1 ring-white/15 hover:bg-white/15"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
