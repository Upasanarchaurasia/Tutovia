const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://tivosvngnljlpfufulgj.supabase.co', 'sb_publishable_GDz5UGZNZzh3PIye3ceEvg_EvuQ6VwY');

(async () => {
  const tables = ['profiles', 'user_progress', 'exam_attempts', 'user_notifications', 'icai_exam_cycles', 'exam_schedules', 'exam_date_updates'];
  for (const t of tables) {
    const { data, error } = await sb.from(t).select('*').limit(1);
    console.log(t, '->', error ? ('ERROR: ' + error.message) : ('EXISTS: ' + JSON.stringify(data)));
  }
})();
