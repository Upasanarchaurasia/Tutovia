const { createClient } = require('/home/ubuntu/tutovia/node_modules/@supabase/supabase-js');
const db = require('/home/ubuntu/tutovia/database.json');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tivosvngnljlpfufulgj.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GDz5UGZNZzh3PIye3ceEvg_EvuQ6VwY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testUnifiedUsers() {
  let supabaseProfiles = [];
  let supabaseProgress = [];

  if (supabase) {
    try {
      const [pRes, progRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('user_progress').select('*')
      ]);
      if (pRes.data) supabaseProfiles = pRes.data;
      if (progRes.data) supabaseProgress = progRes.data;
    } catch (err) {
      console.warn('[Admin] Warning querying Supabase:', err.message);
    }
  }

  const userMap = new Map();

  for (const sp of supabaseProfiles) {
    userMap.set(sp.id, {
      id: sp.id,
      name: sp.name || 'CA Aspirant',
      email: sp.email || '',
      phone: sp.phone || '',
      ca_stage: sp.ca_stage || 'intermediate',
      ca_group: sp.ca_group || 'Both Groups',
      attempt: sp.attempt || 'September 2026',
      target_score: sp.target_score || '60%',
      daily_study_hours: sp.daily_study_hours || 6,
      wake_time: sp.wake_time || '',
      sleep_time: sp.sleep_time || '',
      commitments: sp.commitments || '',
      joined: sp.created_at ? new Date(sp.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
      created_at_raw: sp.created_at || null,
      source: 'Supabase Cloud'
    });
  }

  const userProfileDB = db.userProfileDB || {};
  const usersDB = db.usersDB || [];
  const userProgressDB = db.userProgressDB || {};

  for (const [uid, p] of Object.entries(userProfileDB)) {
    const existing = userMap.get(uid) || {};
    const localUser = usersDB.find(u => u.id === uid) || {};
    userMap.set(uid, {
      id: uid,
      name: p.name || existing.name || localUser.name || 'CA Aspirant',
      email: p.email || existing.email || localUser.email || '',
      phone: p.phone || existing.phone || localUser.phone || '',
      ca_stage: p.ca_stage || existing.ca_stage || 'intermediate',
      ca_group: p.ca_group || existing.ca_group || 'Both Groups',
      attempt: p.attempt || existing.attempt || 'September 2026',
      target_score: p.target_score || existing.target_score || '60%',
      daily_study_hours: p.daily_study_hours || existing.daily_study_hours || 6,
      wake_time: p.wake_time || existing.wake_time || '',
      sleep_time: p.sleep_time || existing.sleep_time || '',
      commitments: p.commitments || existing.commitments || '',
      joined: p.createdAt || existing.joined || 'N/A',
      created_at_raw: existing.created_at_raw || null,
      source: existing.source || 'Local Database'
    });
  }

  for (const u of usersDB) {
    if (!userMap.has(u.id)) {
      userMap.set(u.id, {
        id: u.id,
        name: u.name || 'CA Aspirant',
        email: u.email || '',
        phone: u.phone || '',
        ca_stage: 'intermediate',
        ca_group: 'Both Groups',
        attempt: 'September 2026',
        target_score: '60%',
        daily_study_hours: 6,
        joined: u.createdAt || 'N/A',
        source: 'Local Database'
      });
    }
  }

  const sbProgMap = new Map(supabaseProgress.map(p => [p.user_id, p]));
  const todayIST = new Date().toISOString().slice(0, 10);

  const userList = [];
  for (const [uid, uData] of userMap.entries()) {
    if (uid === 'u2' && uData.email?.includes('student2@icai.org')) continue;

    const localProg = userProgressDB[uid] || {};
    const sbProg = sbProgMap.get(uid) || {};

    const total_study_minutes = Math.max(localProg.total_study_minutes || 0, sbProg.total_study_minutes || 0);
    const completed_pomodoros = Math.max(localProg.completed_pomodoros || 0, sbProg.completed_pomodoros || 0);
    const completed_exams = Math.max(localProg.completed_exams || 0, sbProg.completed_exams || 0);
    const current_streak = Math.max(localProg.current_streak || 0, sbProg.current_streak || 0);
    const last_active_date = localProg.last_active_date || (total_study_minutes > 0 ? 'Recent' : 'Never');

    let activity_status = 'inactive';
    let status_label = 'Inactive';

    if (total_study_minutes > 0 || current_streak > 0) {
      activity_status = 'active_today';
      status_label = 'Active Today';
    }

    const study_hours = (total_study_minutes / 60).toFixed(1);

    userList.push({
      ...uData,
      total_study_minutes,
      study_hours: `${study_hours}h`,
      completed_pomodoros,
      completed_exams,
      current_streak,
      last_active_date,
      activity_status,
      status_label
    });
  }

  console.log('Resulting users count:', userList.length);
  console.log(JSON.stringify(userList, null, 2));
}

testUnifiedUsers();
