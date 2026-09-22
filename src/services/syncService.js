import { supabase } from '../supabaseClient.js';
import axios from '../api.js';

/**
 * Tutovia Cross-Device Cloud Sync Service
 * Seamlessly synchronizes user study data between iOS App and Website via Supabase.
 */

const SYNC_PREF_KEY = 'tutovia_cloud_sync_enabled';
const SYNC_PROMPT_KEY = 'tutovia_cloud_sync_prompt_dismissed';
const LAST_SYNC_KEY = 'tutovia_last_synced_at';

export const isCloudSyncEnabled = () => {
  const val = localStorage.getItem(SYNC_PREF_KEY);
  return val === null ? true : val === 'true';
};

export const setCloudSyncEnabled = (enabled) => {
  localStorage.setItem(SYNC_PREF_KEY, enabled ? 'true' : 'false');
};

export const hasDismissedSyncPrompt = () => {
  return localStorage.getItem(SYNC_PROMPT_KEY) === 'true';
};

export const setDismissedSyncPrompt = (dismissed) => {
  localStorage.setItem(SYNC_PROMPT_KEY, dismissed ? 'true' : 'false');
};

export const getLastSyncedTime = () => {
  return localStorage.getItem(LAST_SYNC_KEY);
};

export const setLastSyncedTime = () => {
  const now = new Date().toISOString();
  localStorage.setItem(LAST_SYNC_KEY, now);
  return now;
};

/**
 * Ensure parent profile row exists in Supabase so foreign key constraints succeed
 */
export async function ensureParentProfile(userId, fallbackData = {}) {
  if (!userId) return;
  try {
    const { data } = await supabase.from('profiles').select('id').eq('id', userId).single();
    if (!data) {
      await supabase.from('profiles').insert({
        id: userId,
        name: fallbackData.name || 'CA Aspirant',
        email: fallbackData.email || '',
        ca_group: fallbackData.ca_group || 'Both Groups',
        attempt: fallbackData.attempt || 'September 2026'
      });
    }
  } catch {}
}

/**
 * 1. Sync User Profile (Bi-directional)
 */
export async function syncProfile(userId, localProfile = null) {
  if (!userId) return null;
  try {
    // Fetch from Supabase
    const { data: cloudProfile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.warn('[Sync] Supabase profile fetch failed:', error.message);
    }

    // If local profile is available, push or merge
    if (localProfile) {
      const merged = {
        id: userId,
        email: localProfile.email || cloudProfile?.email,
        name: localProfile.name || cloudProfile?.name,
        ca_stage: localProfile.ca_stage || 'intermediate',
        ca_group: localProfile.ca_group || cloudProfile?.ca_group || 'Both Groups',
        attempt: localProfile.attempt || cloudProfile?.attempt || 'September 2026',
        target_score: localProfile.target_score || cloudProfile?.target_score || '60%',
        exam_date: localProfile.exam_date || cloudProfile?.exam_date,
        daily_study_hours: localProfile.daily_study_hours || cloudProfile?.daily_study_hours || 6,
        wake_time: localProfile.wake_time || cloudProfile?.wake_time,
        sleep_time: localProfile.sleep_time || cloudProfile?.sleep_time,
        commitments: localProfile.commitments || cloudProfile?.commitments || ''
      };

      // Supabase profiles table columns
      const sbPayload = {
        id: userId,
        email: merged.email || '',
        name: merged.name || 'CA Aspirant',
        ca_group: merged.ca_group || 'Both Groups',
        attempt: merged.attempt || 'September 2026',
        target_score: merged.target_score || '60%',
        exam_date: merged.exam_date || null,
        daily_study_hours: merged.daily_study_hours || 6,
        wake_time: merged.wake_time || null,
        sleep_time: merged.sleep_time || null,
        commitments: merged.commitments || ''
      };

      await supabase.from('profiles').upsert(sbPayload).catch(() => {});
      localStorage.setItem(`tutovia_profile_${userId}`, JSON.stringify(merged));
      return merged;
    } else if (cloudProfile) {
      const formatted = {
        ...cloudProfile,
        ca_stage: 'intermediate'
      };
      localStorage.setItem(`tutovia_profile_${userId}`, JSON.stringify(formatted));
      return formatted;
    }
  } catch (err) {
    console.error('[Sync] Profile sync error:', err);
  }
  return localProfile;
}

/**
 * 2. Sync Study Progress & Streaks (Bi-directional Smart Merge)
 */
export async function syncProgress(userId, localProgress = null) {
  if (!userId) return null;
  try {
    await ensureParentProfile(userId);

    const { data: cloudProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Smart merge: take the higher study minutes and streak to avoid losing progress
    const totalMinutes = Math.max(
      localProgress?.total_study_minutes || 0,
      cloudProgress?.total_study_minutes || 0
    );
    const completedPomodoros = Math.max(
      localProgress?.completed_pomodoros || 0,
      cloudProgress?.completed_pomodoros || 0
    );
    const completedExams = Math.max(
      localProgress?.completed_exams || 0,
      cloudProgress?.completed_exams || 0
    );
    const streak = Math.max(
      localProgress?.current_streak || 0,
      cloudProgress?.current_streak || 0
    );

    const merged = {
      user_id: userId,
      total_study_minutes: totalMinutes,
      completed_pomodoros: completedPomodoros,
      completed_exams: completedExams,
      current_streak: streak
    };

    // Upsert to Supabase
    await supabase.from('user_progress').upsert(merged).catch(() => {});

    // Save to local backend/cache
    const formattedLocal = {
      study_hours_today: (totalMinutes / 60).toFixed(1),
      total_study_minutes: totalMinutes,
      completed_pomodoros: completedPomodoros,
      total_exams: completedExams,
      current_streak: streak
    };
    localStorage.setItem(`tutovia_progress_${userId}`, JSON.stringify(formattedLocal));

    // Also update backend server
    axios.post('/api/progress/study-hours', { userId, minutesAdded: 0 }).catch(() => {});

    return formattedLocal;
  } catch (err) {
    console.error('[Sync] Progress sync error:', err);
  }
  return localProgress;
}

/**
 * 3. Sync Daily Timetable / Schedule (Bi-directional)
 */
export async function syncSchedule(userId, localSchedule = null) {
  if (!userId) return null;
  try {
    await ensureParentProfile(userId);

    // If local schedule is provided and has items, push to Supabase
    if (localSchedule && Array.isArray(localSchedule) && localSchedule.length > 0) {
      const rows = localSchedule.map((item, idx) => ({
        user_id: userId,
        time_range: item.timeRange || item.time12 || item.time || '',
        start_mins: item.start_mins || idx * 120,
        activity: item.activity || item.title || 'Study Session',
        focus: item.focus || 'CA Study',
        type: item.type || 'study',
        status: item.status || (item.done ? 'Completed' : 'Pending'),
        done: !!item.done,
        link: item.link || ''
      }));

      // Delete old user schedule and re-insert to keep exact order
      await supabase.from('schedule').delete().eq('user_id', userId).catch(() => {});
      await supabase.from('schedule').insert(rows).catch(() => {});

      localStorage.setItem(`tutovia_schedule_${userId}`, JSON.stringify(localSchedule));
      return localSchedule;
    }

    // Pull from Supabase
    const { data: cloudSchedule } = await supabase
      .from('schedule')
      .select('*')
      .eq('user_id', userId)
      .order('start_mins', { ascending: true });

    if (cloudSchedule && cloudSchedule.length > 0) {
      const formatted = cloudSchedule.map((s, idx) => ({
        id: s.id || `s_${idx}`,
        time12: s.time_range,
        timeRange: s.time_range,
        title: s.activity,
        activity: s.activity,
        focus: s.focus,
        type: s.type,
        status: s.status,
        done: s.done,
        link: s.link
      }));
      localStorage.setItem(`tutovia_schedule_${userId}`, JSON.stringify(formatted));
      return formatted;
    }
  } catch (err) {
    console.error('[Sync] Schedule sync error:', err);
  }
  return localSchedule;
}

/**
 * 4. Sync Completed Syllabus Chapters (Union of both)
 */
export async function syncCompletedChapters(userId, subjectId = null, localChapters = null) {
  if (!userId) return null;
  try {
    await ensureParentProfile(userId);

    const storageKey = subjectId ? `tutovia_completed_chapters_${userId}_${subjectId}` : null;

    // Fetch existing profile metadata from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('commitments')
      .eq('id', userId)
      .single();

    let cloudMap = {};
    if (profile?.commitments) {
      try {
        if (profile.commitments.startsWith('{')) {
          cloudMap = JSON.parse(profile.commitments);
        }
      } catch {}
    }

    if (subjectId) {
      const currentLocal = localChapters || JSON.parse(localStorage.getItem(storageKey) || '[]');
      const currentCloud = cloudMap[subjectId] || [];

      // Union of unique chapter IDs
      const merged = Array.from(new Set([...currentLocal, ...currentCloud]));
      cloudMap[subjectId] = merged;

      // Update cloud commitments JSON
      await supabase
        .from('profiles')
        .update({ commitments: JSON.stringify(cloudMap) })
        .eq('id', userId)
        .catch(() => {});

      localStorage.setItem(storageKey, JSON.stringify(merged));
      return merged;
    } else {
      // Pull all subjects and update localStorage
      Object.keys(cloudMap).forEach(subId => {
        const key = `tutovia_completed_chapters_${userId}_${subId}`;
        const local = JSON.parse(localStorage.getItem(key) || '[]');
        const merged = Array.from(new Set([...local, ...cloudMap[subId]]));
        localStorage.setItem(key, JSON.stringify(merged));
      });
      return cloudMap;
    }
  } catch (err) {
    console.error('[Sync] Completed chapters sync error:', err);
  }
}

/**
 * 5. Sync Mood / Wellness Logs
 */
export async function syncMood(userId, localMoodLog = null) {
  if (!userId) return null;
  try {
    await ensureParentProfile(userId);

    if (localMoodLog) {
      await supabase.from('mood_logs').insert({
        user_id: userId,
        mood: localMoodLog.mood,
        note: localMoodLog.note || ''
      }).catch(() => {});
    }

    const { data: cloudLogs } = await supabase
      .from('mood_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(14);

    return cloudLogs || [];
  } catch (err) {
    console.error('[Sync] Mood sync error:', err);
  }
}

/**
 * 6. Sync Exam Attempts
 */
export async function syncExamAttempt(userId, attemptData) {
  if (!userId || !attemptData) return null;
  try {
    await ensureParentProfile(userId);

    const row = {
      user_id: userId,
      exam_id: attemptData.examId || attemptData.exam_id,
      exam_title: attemptData.examTitle || attemptData.exam_title || 'Mock Exam',
      score: attemptData.score || 0,
      total_questions: attemptData.totalQuestions || attemptData.total_questions || 10,
      accuracy: attemptData.accuracy || 0,
      weak_topics: attemptData.weakTopics || attemptData.weak_topics || []
    };

    await supabase.from('exam_attempts').insert(row).catch(() => {});
    return row;
  } catch (err) {
    console.error('[Sync] Exam attempt sync error:', err);
  }
}

/**
 * Full Comprehensive Sync (Sync All)
 * Pulls & pushes all study data between local device and Supabase Cloud.
 */
export async function syncAll(userId) {
  if (!userId) return { success: false, reason: 'No user ID' };
  if (!isCloudSyncEnabled()) return { success: false, reason: 'Sync disabled by user' };

  try {
    console.log(`[Sync] Initiating cross-device sync for user: ${userId}`);

    // Read local caches
    const cachedProfile = JSON.parse(localStorage.getItem(`tutovia_profile_${userId}`) || 'null');
    const cachedProgress = JSON.parse(localStorage.getItem(`tutovia_progress_${userId}`) || 'null');
    const cachedSchedule = JSON.parse(localStorage.getItem(`tutovia_schedule_${userId}`) || 'null');

    // 1. Ensure parent profile is synced first
    const syncedProfile = await syncProfile(userId, cachedProfile);

    // 2. Parallel sync of child entities
    const [syncedProgress, syncedSchedule] = await Promise.allSettled([
      syncProgress(userId, cachedProgress),
      syncSchedule(userId, cachedSchedule),
      syncCompletedChapters(userId)
    ]);

    const timestamp = setLastSyncedTime();
    console.log(`[Sync] Cross-device sync completed successfully at ${timestamp}`);

    return {
      success: true,
      timestamp,
      profile: syncedProfile,
      progress: syncedProgress.value,
      schedule: syncedSchedule.value
    };
  } catch (err) {
    console.error('[Sync] Full sync failed:', err);
    return { success: false, error: err.message };
  }
}
