import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tivosvngnljlpfufulgj.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GDz5UGZNZzh3PIye3ceEvg_EvuQ6VwY';

export const supabase = createClient(supabaseUrl, supabaseKey);
