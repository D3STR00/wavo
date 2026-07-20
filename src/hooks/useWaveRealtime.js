import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useWaveRealtime() {
  const [incomingWave, setIncomingWave] = useState(null);

  useEffect(() => {
    let channel;

    const setupRealtime = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) return;


      channel = supabase
        .channel(`incoming-waves-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "waves",
            filter: `to_user_id=eq.${user.id}`,
          },
          (payload) => {

            const wave = payload.new;

            if (wave.status !== "pending") return;


            setIncomingWave({
              waveId: wave.id,
              fromUserId: wave.from_user_id,
              fromName: "Wavo User",
              intent: wave.intent_type,
            });

          }
        )
        .subscribe();

    };


    setupRealtime();


    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };

  }, []);


  return {
    incomingWave,
    setIncomingWave,
  };
}