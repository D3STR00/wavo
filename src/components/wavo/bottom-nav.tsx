import { Link, useLocation } from "react-router-dom";
import { Radar, MessageCircle, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/nearby", label: "Nearby", icon: Radar },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: UserIcon },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-xl grid grid-cols-3">
        {TABS.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                active ? "text-primary" : "text-foreground/40",
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-14 items-center justify-center rounded-full",
                  active && "bg-primary/15",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
