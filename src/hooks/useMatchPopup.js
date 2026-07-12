import { useEffect } from "react";
import { supabase } from "../lib/supabase";

/**
 * REALTIME MATCH POPUP LISTENER
 */
export function useMatchPopup(userId, onMatch) {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("match-popup")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `matched_user_id=eq.${userId}`,
        },
        (payload) => {
          onMatch(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, onMatch]);
}