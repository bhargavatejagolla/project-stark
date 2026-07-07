import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data, error } = await supabase.from('skills').update({ logged_hours: 0.3 }).eq('id', 'cc7f0da0-acc1-406f-8c98-59258ea859aa').select();
  console.log("Update result:", data);
  console.log("Error:", error);
}
main();
