import { supabase } from '../../../lib/supabase'

export function askPennyMon({ question, summary }) {
  return supabase.functions.invoke('ask-pennymon', {
    body: { question, summary },
  })
}
