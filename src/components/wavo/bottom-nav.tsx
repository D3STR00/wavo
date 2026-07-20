import { Radar, MessageCircle, User as UserIcon } from "lucide-react";

const TABS = [
  { key: "nearby", label: "Nearby", icon: Radar },
  { key: "chat", label: "Chat", icon: MessageCircle },
  { key: "profile", label: "Profile", icon: UserIcon },
];

export default function BottomNav({
  active,
  onNearby,
  onChat,
  onProfile,
}: {
  active: string;
  onNearby: () => void;
  onChat: () => void;
  onProfile: () => void;
}) {

  const actions = {
    nearby: onNearby,
    chat: onChat,
    profile: onProfile,
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-[#0C0C14]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-xl grid grid-cols-3">

        {TABS.map(({ key, label, icon: Icon }) => {

          const selected = active === key;

          return (
            <button
              key={key}
              onClick={actions[key as keyof typeof actions]}
              className={`flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                selected
                  ? "text-white"
                  : "text-white/40"
              }`}
            >
              <span
                className={`flex h-9 w-14 items-center justify-center rounded-full ${
                  selected ? "bg-white/10" : ""
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>

              {label}

            </button>
          );

        })}

      </div>
    </nav>
  );
}