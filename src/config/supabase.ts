import { createClient } from "@supabase/supabase-js";

// Deze waarden moeten worden vervangen door de echte Supabase project URL en anonieme sleutel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL en anonieme sleutel zijn vereist");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
