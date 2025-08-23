// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ylfmefcvwkaxqrmugwjm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZm1lZmN2d2theHFybXVnd2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjE5MzAsImV4cCI6MjA3MDgzNzkzMH0.uEEdwKyJccQbVof1z3dgqnEXCVySWE0DA1jr5h-s_mk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)