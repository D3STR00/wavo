import { supabase } from "../lib/supabase";

/**
 * SEND WAVE + REALTIME SAFE MATCH CHECK
 * - prevents duplicates
 * - checks mutual wave
 * - creates match only once
 */
export async function sendWaveToUser(targetUserId, intentType) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  if (!user) return { error: "Not authenticated" };

  const fromUserId = user.id;

  // 0. Prevent duplicate wave
  const { data: existingWave } = await supabase
    .from("waves")
    .select("id")
    .eq("from_user_id", fromUserId)
    .eq("to_user_id", targetUserId)
    .eq("status", "pending")
    .maybeSingle();

  if (existingWave) {
    return { matched: false };
  }

  // 1. Insert wave (A → B)
  const { error: insertError } = await supabase.from("waves").insert({
    from_user_id: fromUserId,
    to_user_id: targetUserId,
    intent_type: intentType,
    status: "pending",
  });

  if (insertError) {
    console.error("Wave insert error:", insertError);
    return { error: insertError };
  }

  // 2. Check reverse wave (B → A)
  const { data: reverseWave, error: reverseError } = await supabase
    .from("waves")
    .select("id")
    .eq("from_user_id", targetUserId)
    .eq("to_user_id", fromUserId)
    .eq("status", "pending")
    .maybeSingle();

  if (reverseError) {
    console.error("Reverse wave check error:", reverseError);
    return { error: reverseError };
  }

  // 3. No match yet
  if (!reverseWave) {
    return { matched: false };
  }

  // 4. Check existing match (prevent duplicates)
  const { data: existingMatch, error: matchCheckError } = await supabase
    .from("matches")
    .select("id")
    .or(
      `and(user_id.eq.${fromUserId},matched_user_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},matched_user_id.eq.${fromUserId})`
    )
    .maybeSingle();

  if (matchCheckError) {
    console.error("Match check error:", matchCheckError);
    return { matched: true };
  }

  // 5. Create match if none exists
  if (!existingMatch) {
    const { data: newMatch, error: matchInsertError } = await supabase
      .from("matches")
      .insert({
        user_id: fromUserId,
        matched_user_id: targetUserId,
        intent_type: intentType,
        score: 1,
      })
      .select("id")
      .single();

    if (matchInsertError) {
      console.error("Match insert error:", matchInsertError);
      return { matched: true };
    }

    return {
      matched: true,
      matchId: newMatch.id,
    };
  }

  return {
    matched: true,
    matchId: existingMatch.id,
  };
}