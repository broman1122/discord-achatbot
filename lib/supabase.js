// lib/supabase.js
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Supabase URL or Anon Key is missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.",
  )
  // في بيئة الإنتاج، قد ترغب في التعامل مع هذا الخطأ بشكل أكثر قوة،
  // ولكن هنا سنسمح للبوت بالبدء مع تحذير.
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
