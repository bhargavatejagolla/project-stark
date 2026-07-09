import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: skills } = await supabase.from('skills').select('*');
  console.log("Skills Table:", skills);
  const { data: sessions } = await supabase.from('study_sessions').select('*').order('started_at', { ascending: false }).limit(5);
  console.log("Sessions Table:", sessions);
}
main();
