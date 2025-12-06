import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[supabase] ENV vars missen.')
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)

  // STORE gebruikt window.supabaseClient
  if (typeof window !== 'undefined') {
    window.supabaseClient = supabase
    console.log('[supabase] client OK')
  }
}

export { supabase }
