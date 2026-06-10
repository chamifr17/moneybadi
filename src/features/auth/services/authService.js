import { supabase } from '../../../lib/supabase'

export function getCurrentSession() {
  return supabase.auth.getSession()
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange(callback)
}

export function signUpWithEmail({ email, name, password }) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name || email.split('@')[0],
      },
    },
  })
}

export function signInWithEmail({ email, password }) {
  return supabase.auth.signInWithPassword({ email, password })
}

export function signOut() {
  return supabase.auth.signOut()
}
