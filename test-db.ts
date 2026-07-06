import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function run() {
  const { data: test, error: err } = await supabase.rpc('hello_world'); // Or just fetch table info
  // Try inserting dummy data to see what columns exist
  const { error } = await supabase.from('study_sessions').insert({ user_id: '5ab9ee3e-4bfc-4e51-8935-cbb926668752', duration_minutes: 1 });
  console.log('insert error:', error);
  const { data: cols } = await supabase.from('study_sessions').select('*').limit(1);
  console.log('cols:', cols);
}

run();
