import { supabase } from '../../../lib/supabase'

export function savePennyMonProfile({ accessory, coins, mood, room, userId }) {
  return supabase
    .from('pennymon_profiles')
    .upsert(
      {
        user_id: userId,
        coins,
        mood,
        accessory,
        room,
      },
      { onConflict: 'user_id' },
    )
}
