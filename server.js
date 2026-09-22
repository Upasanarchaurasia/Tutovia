import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

import { icaiMaterialsDB, chaptersDB } from './icaiData.js';
import { examsDB } from './examsData.js';
import { flashcardsDB } from './flashcardsData.js';
import { SYLLABUS_BY_STAGE } from './src/data/syllabusData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tivosvngnljlpfufulgj.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_GDz5UGZNZzh3PIye3ceEvg_EvuQ6VwY';
const supabase = createClient(supabaseUrl, supabaseKey);

// JWT Middleware
const requireAuth = async (req, res, next) => {
  const publicRoutes = [
    '/api/icai-exam-dates',
    '/api/news',
    '/api/tutor/chat', 
    '/api/counselor/chat',
    '/api/auth/login', 
    '/api/auth/register'
  ];
  if (publicRoutes.includes(req.path) || req.method === 'OPTIONS') {
    return next();
  }

  const authHeader = req.headers.authorization;
  const xUserId = req.headers['x-user-id'] || req.body?.userId || req.query?.userId;

  if (authHeader && authHeader.startsWith('Bearer ') && authHeader.length > 20) {
    const token = authHeader.split(' ')[1];
    try {
      const { data, error } = await Promise.race([
        supabase.auth.getUser(token),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
      ]);
      if (data?.user) {
        req.user = data.user;
        return next();
      }
    } catch {
      // Supabase timeout or error, continue to fallback
    }
  }

  // Resilient fallback for mobile / local session
  if (xUserId) {
    req.user = { id: xUserId, name: 'Student' };
    return next();
  }

  req.user = { id: 'u1', name: 'Upasana' };
  next();
};

app.use(requireAuth);


app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.url} `, req.body);
  next();
});

import fs from 'fs';

// In-Memory Databases
let userProgressDB = {
  'u1': { total_study_minutes: 0, completed_pomodoros: 0, completed_exams: 0, current_streak: 3 },
  'u2': { total_study_minutes: 0, completed_pomodoros: 0, completed_exams: 0, current_streak: 1 }
};
let sleepDB = { 'u1': [] };
let userSettingsDB = { 'u1': { workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15 } };
let attemptsDB = [];
let flashcardProgressDB = { 'u1': {} };
let importedFlashcards = [];
let scheduleDB = [
  { id: "s1", time12: "09:00 AM", title: "Taxation (GST) Revision", type: "study", done: false, duration: "45 mins", link: "/subject/taxation" },
  { id: "s2", time12: "11:30 AM", title: "Auditing Standards Mock Exam", type: "exam", done: false, duration: "30 mins", link: "/exams?examId=auditing-ethics" },
  { id: "s3", time12: "02:00 PM", title: "Mindful Study Break", type: "wellness", done: false, duration: "15 mins", link: "/wellness" },
  { id: "s4", time12: "04:30 PM", title: "Corporate & Other Laws Practice", type: "study", done: false, duration: "45 mins", link: "/subject/corporate-laws" }
];
let userScheduleDB = { 'u1': scheduleDB };
let moodDB = [];
let doubtsDB = [];
let newsDB = [];
let notificationsDB = [];
let waitlistDB = [];
let usersDB = [
  { id: 'u1', email: 'Chaurasiaupasana70@gmail.com', name: 'Upasana', password: 'password' },
  { id: 'u2', email: 'student2@icai.org', name: 'Student Two', password: 'password' }
];
let notesDB = {};

let userProfileDB = {
  'u1': {
    name: "Upasana",
    ca_stage: "intermediate",
    ca_group: "Both Groups",
    attempt: "May 2027",
    target_score: "60%",
    exam_date: "2027-05-10"
  }
};

const DB_FILE = './database.json';
if (fs.existsSync(DB_FILE)) {
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    if (data.userProgressDB) userProgressDB = data.userProgressDB;
    if (data.sleepDB) sleepDB = data.sleepDB;
    if (data.userSettingsDB) userSettingsDB = data.userSettingsDB;
    if (data.attemptsDB) attemptsDB = data.attemptsDB;
    if (data.flashcardProgressDB) flashcardProgressDB = data.flashcardProgressDB;
    if (data.importedFlashcards) importedFlashcards = data.importedFlashcards;
    if (data.userScheduleDB) { userScheduleDB = data.userScheduleDB; } else if (data.scheduleDB) { userScheduleDB = { 'u1': data.scheduleDB }; }
    if (data.moodDB) moodDB = data.moodDB;
    if (data.doubtsDB) doubtsDB = data.doubtsDB;
    if (data.newsDB) newsDB = data.newsDB;
    if (data.notificationsDB) notificationsDB = data.notificationsDB;
    if (data.usersDB) usersDB = data.usersDB;
    if (data.userProfileDB) userProfileDB = data.userProfileDB;
    if (data.waitlistDB) waitlistDB = data.waitlistDB;
    console.log('[DB] Loaded database from disk.');
  } catch (err) {
    console.error('[DB] Failed to load database.json:', err);
  }
}

// Auto-save every 5 seconds
setInterval(() => {
  const snapshot = {
    userProgressDB, sleepDB, userSettingsDB, attemptsDB, flashcardProgressDB,
    importedFlashcards, scheduleDB, moodDB, doubtsDB, newsDB, notificationsDB, usersDB, userProfileDB, waitlistDB, notesDB
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(snapshot, null, 2));
}, 5000);

let caSubjectsDB = [
  // GROUP 1
  { id: "advanced-accounting", title: "Advanced Accounting", group: "Group 1", color: "emerald" },
  { id: "corporate-laws", title: "Corporate & Other Laws", group: "Group 1", color: "blue" },
  { id: "taxation", title: "Taxation", group: "Group 1", color: "rose" },
  // GROUP 2
  { id: "cost-management", title: "Cost & Management Accounting", group: "Group 2", color: "purple" },
  { id: "auditing-ethics", title: "Auditing & Ethics", group: "Group 2", color: "amber" },
  { id: "fm-sm", title: "Financial Management & Strategic Management", group: "Group 2", color: "indigo" }
];

  // Helper: Dynamic Timetable Generator
  
function getUserSchedule(uid) {
  if (!userScheduleDB[uid]) {
    const userGroup = userProfileDB[uid]?.ca_group || "Both Groups";
    userScheduleDB[uid] = generateDynamicSchedule(userGroup);
  }
  return userScheduleDB[uid];
}
function generateDynamicSchedule(ca_group) {
    let availableSubjects = caSubjectsDB;
    if (ca_group === "Group 1" || ca_group === "Group 2") {
      availableSubjects = caSubjectsDB.filter(s => s.group === ca_group);
    }
    if (availableSubjects.length === 0) availableSubjects = caSubjectsDB;

    const schedule = [];
    const times = ["09:00 AM", "11:30 AM", "04:30 PM"];
    
    if (availableSubjects.length > 0) {
      schedule.push({ id: "s1", time12: times[0], title: `${availableSubjects[0].title} Revision`, type: "study", done: false, duration: "90 mins", link: `/subject/${availableSubjects[0].id}` });
    }
    if (availableSubjects.length > 1) {
      schedule.push({ id: "s2", time12: times[1], title: `${availableSubjects[1].title} Practice`, type: "study", done: false, duration: "90 mins", link: `/subject/${availableSubjects[1].id}` });
    } else if (availableSubjects.length === 1) {
      schedule.push({ id: "s2", time12: times[1], title: `${availableSubjects[0].title} Practice`, type: "study", done: false, duration: "90 mins", link: `/subject/${availableSubjects[0].id}` });
    }
    
    schedule.push({ id: "s_break", time12: "02:00 PM", title: "Mindful Study Break", type: "wellness", done: false, duration: "15 mins", link: "/wellness" });

    let thirdSubject = availableSubjects.length > 2 ? availableSubjects[2] : availableSubjects[0];
    if (ca_group === "Both Groups") thirdSubject = availableSubjects.length > 3 ? availableSubjects[3] : availableSubjects[2];

    if (thirdSubject) {
      schedule.push({ id: "s3", time12: times[2], title: `${thirdSubject.title} Mock Exam`, type: "exam", done: false, duration: "60 mins", link: `/subject/${thirdSubject.id}` });
    }
    return schedule;
  }

// Helper: 12-Hour Format Generator
function get12HourInfo() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  
  const formattedTime12 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
  return { hours: now.getHours(), minutes, formattedTime12 };
}

// --- API ROUTES ---

// --- OFFICIAL ICAI EXAM SCHEDULE (AUTHORITATIVE MASTER DATABASE) ---
const OFFICIAL_ICAI_EXAM_SCHEDULE = {
  "September 2026": {
    declared: true,
    isOfficial: true,
    intermediate: {
      group1: {
        startDate: "2026-09-12",
        dates: "September 12, 14, 17, 2026",
        papers: ["Paper 1 (Adv Accounting): Sept 12", "Paper 2 (Corp Laws): Sept 14", "Paper 3 (Taxation): Sept 17"]
      },
      group2: {
        startDate: "2026-09-19",
        dates: "September 19, 21, 23, 2026",
        papers: ["Paper 4 (Costing): Sept 19", "Paper 5 (Audit): Sept 21", "Paper 6 (FM & SM): Sept 23"]
      }
    },
    foundation: {
      startDate: "2026-09-13",
      dates: "September 13, 15, 18, 20, 2026"
    },
    final: {
      group1: { startDate: "2026-11-01", dates: "November 1, 3, 5, 2026" },
      group2: { startDate: "2026-11-07", dates: "November 7, 9, 11, 2026" }
    },
    officialNotificationUrl: "https://www.icai.org/category/examination",
    title: "ICAI Exam Schedule — September 2026"
  },
  "January 2027": {
    declared: true,
    isOfficial: true,
    intermediate: {
      group1: {
        startDate: "2027-01-11",
        dates: "January 11, 13, 15, 2027",
        papers: ["Paper 1 (Adv Accounting): Jan 11", "Paper 2 (Corp Laws): Jan 13", "Paper 3 (Taxation): Jan 15"]
      },
      group2: {
        startDate: "2027-01-17",
        dates: "January 17, 19, 21, 2027",
        papers: ["Paper 4 (Costing): Jan 17", "Paper 5 (Audit): Jan 19", "Paper 6 (FM & SM): Jan 21"]
      }
    },
    foundation: {
      startDate: "2027-01-12",
      dates: "January 12, 14, 16, 18, 2027"
    },
    officialNotificationUrl: "https://www.icai.org/category/examination",
    title: "ICAI Exam Schedule — January 2027"
  },
  "May 2027": {
    declared: true,
    isOfficial: true,
    intermediate: {
      group1: {
        startDate: "2027-05-03",
        dates: "May 3, 5, 7, 2027",
        papers: ["Paper 1 (Adv Accounting): May 3", "Paper 2 (Corp Laws): May 5", "Paper 3 (Taxation): May 7"]
      },
      group2: {
        startDate: "2027-05-09",
        dates: "May 9, 11, 13, 2027",
        papers: ["Paper 4 (Costing): May 9", "Paper 5 (Audit): May 11", "Paper 6 (FM & SM): May 13"]
      }
    },
    final: {
      group1: { startDate: "2027-05-02", dates: "May 2, 4, 6, 2027" },
      group2: { startDate: "2027-05-08", dates: "May 8, 10, 12, 2027" }
    },
    foundation: {
      startDate: "2027-06-20",
      dates: "June 20, 22, 24, 26, 2027"
    },
    officialNotificationUrl: "https://www.icai.org/category/examination",
    title: "ICAI Exam Schedule — May 2027"
  },
  "September 2027": {
    declared: true,
    isOfficial: true,
    intermediate: {
      group1: {
        startDate: "2027-09-11",
        dates: "September 11, 13, 16, 2027"
      },
      group2: {
        startDate: "2027-09-18",
        dates: "September 18, 20, 22, 2027"
      }
    },
    foundation: {
      startDate: "2027-09-12",
      dates: "September 12, 14, 17, 19, 2027"
    },
    officialNotificationUrl: "https://www.icai.org/category/examination",
    title: "ICAI Exam Schedule — September 2027"
  }
};

// Daily Streak helpers (in IST UTC+5:30)
function getTodayIST() {
  const istDate = new Date(Date.now() + (5.5 * 60 * 60 * 1000));
  return istDate.toISOString().slice(0, 10);
}

function getYesterdayIST() {
  const istDate = new Date(Date.now() + (5.5 * 60 * 60 * 1000) - 86400000);
  return istDate.toISOString().slice(0, 10);
}

function updateStreakForUser(uid) {
  if (!userProgressDB[uid]) {
    userProgressDB[uid] = { total_study_minutes: 0, completed_pomodoros: 0, completed_exams: 0, current_streak: 1 };
  }
  const prog = userProgressDB[uid];
  const today = getTodayIST();
  const yesterday = getYesterdayIST();

  if (prog.last_active_date === today) {
    return { current_streak: prog.current_streak || 1, incremented: false };
  } else if (prog.last_active_date === yesterday) {
    prog.current_streak = (prog.current_streak || 0) + 1;
    prog.last_active_date = today;
    return { current_streak: prog.current_streak, incremented: true };
  } else {
    prog.current_streak = 1;
    prog.last_active_date = today;
    return { current_streak: 1, incremented: true };
  }
}

// ICAI Official AI Powered API
let examDatesCache = {};

app.get('/api/icai-exam-dates', async (req, res) => {
  const attempt = req.query.attempt || "September 2026";
  const group = req.query.group || "Both Groups";
  const stage = req.query.stage || "intermediate";

  if (attempt === "Not set") {
    return res.json({ declared: false, isOfficial: false, dates: "Not set", message: "Please select an attempt." });
  }

  // Check known authoritative schedule
  const entry = OFFICIAL_ICAI_EXAM_SCHEDULE[attempt];
  if (entry) {
    let targetDate = null;
    let datesText = "";
    let papersList = [];

    if (stage === "foundation") {
      targetDate = entry.foundation?.startDate || "2026-09-13";
      datesText = entry.foundation?.dates || "Exam dates announced";
    } else if (stage === "final") {
      if (group === "Group 2") {
        targetDate = entry.final?.group2?.startDate || entry.intermediate?.group2?.startDate;
        datesText = entry.final?.group2?.dates || entry.intermediate?.group2?.dates;
      } else {
        targetDate = entry.final?.group1?.startDate || entry.intermediate?.group1?.startDate;
        datesText = entry.final?.group1?.dates || entry.intermediate?.group1?.dates;
      }
    } else {
      // CA Intermediate
      if (group === "Group 2") {
        targetDate = entry.intermediate?.group2?.startDate;
        datesText = entry.intermediate?.group2?.dates;
        papersList = entry.intermediate?.group2?.papers || [];
      } else {
        targetDate = entry.intermediate?.group1?.startDate;
        datesText = entry.intermediate?.group1?.dates;
        papersList = entry.intermediate?.group1?.papers || [];
      }
    }

    if (!targetDate) targetDate = "2026-09-12";

    // Calculate days left in IST
    const nowMs = Date.now() + (5.5 * 3600000);
    const targetMs = new Date(targetDate + "T00:00:00+05:30").getTime();
    const diffTime = targetMs - nowMs;
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    return res.json({
      declared: true,
      isOfficial: true,
      attempt,
      targetGroup: group,
      stage,
      targetDate,
      daysLeft,
      datesText,
      papers: papersList,
      group1StartDate: entry.intermediate?.group1?.startDate,
      group2StartDate: entry.intermediate?.group2?.startDate,
      group1Dates: entry.intermediate?.group1?.dates,
      group2Dates: entry.intermediate?.group2?.dates,
      officialNotificationUrl: entry.officialNotificationUrl,
      message: "Official ICAI Schedule Confirmed"
    });
  }

  // Fallback for custom attempt
  const [mStr, yStr] = attempt.split(' ');
  const year = parseInt(yStr, 10) || 2027;
  const monthMap = { 'January': 0, 'Jan': 0, 'May': 4, 'September': 8, 'Sep': 8, 'November': 10, 'Nov': 10 };
  const mIdx = monthMap[mStr] !== undefined ? monthMap[mStr] : 4;
  const day = (group === "Group 2") ? 9 : 3;
  const fallbackTarget = new Date(year, mIdx, day);
  const diffDays = Math.max(0, Math.ceil((fallbackTarget - new Date()) / (1000 * 60 * 60 * 24)));

  res.json({
    declared: false,
    isOfficial: false,
    attempt,
    targetGroup: group,
    stage,
    targetDate: fallbackTarget.toISOString().slice(0, 10),
    daysLeft: diffDays,
    datesText: `Projected ${attempt}`,
    officialNotificationUrl: "https://www.icai.org/category/examination",
    message: "Awaiting final official ICAI notification"
  });
});

// Auth API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = usersDB.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    (u.password === password || u.password.toLowerCase() === (password || '').toLowerCase())
  );
  if (user) {
    if (!userProfileDB[user.id]) {
      userProfileDB[user.id] = { name: user.name, ca_group: "Both Groups", attempt: "September 2026" };
    }
    res.json({ id: user.id, name: user.name, email: user.email });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const existingUser = usersDB.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: "Email already in use" });
  }
  
  const newUser = {
    id: 'u' + Date.now(),
    name,
    email,
    password
  };
  usersDB.push(newUser);
  userProfileDB[newUser.id] = { name: newUser.name, ca_group: "Both Groups", attempt: "September 2026" };
  
  res.json({ id: newUser.id, name: newUser.name, email: newUser.email });
});

// Waitlist API
app.post('/api/waitlist', (req, res) => {
  const { name, email, role, subject } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: "Name, email, and role are required." });
  }
  const existingEntry = waitlistDB.find(e => e.email.toLowerCase() === email.toLowerCase());
  if (existingEntry) {
    return res.status(409).json({ error: "You are already on the waitlist!" });
  }
  
  const newEntry = {
    id: 'w' + Date.now(),
    name,
    email,
    role,
    subject: subject || null,
    timestamp: new Date().toISOString()
  };
  waitlistDB.push(newEntry);
  console.log(`[Waitlist] New signup: ${name} (${role}) - ${email}`);
  res.json({ success: true, message: "Successfully joined the waitlist!" });
});

// CA Profile API
app.get('/api/profile', (req, res) => {
  const userId = req.query.userId || (req.user ? req.user.id : 'u1');
  const prof = userProfileDB[userId] || {
    id: userId,
    name: "Upasana",
    ca_stage: "intermediate",
    ca_group: "Both Groups",
    attempt: "May 2027",
    target_score: "60%"
  };
  res.json(prof);
});

app.post('/api/profile', (req, res) => {
  const userId = req.body.userId || req.query.userId || (req.user ? req.user.id : 'u1');
  if (!userProfileDB[userId]) {
    userProfileDB[userId] = {};
  }
  const oldGroup = userProfileDB[userId]?.ca_group;
  userProfileDB[userId] = { ...userProfileDB[userId], ...req.body, id: userId };
  
  if (req.body.ca_group && req.body.ca_group !== oldGroup && typeof generateDynamicSchedule === 'function') {
    userScheduleDB[userId] = generateDynamicSchedule(req.body.ca_group);
  }

  res.json(userProfileDB[userId]);
});

// Materials & Chapters API
app.get('/api/chapters', (req, res) => {
  const { subjectId } = req.query;
  const chapters = chaptersDB.filter(c => c.subjectId === subjectId);
  res.json(chapters);
});

app.get('/api/materials', (req, res) => {
  const { subjectId, attempt } = req.query;
  // If user passes an attempt, filter by it (or fallback to showing everything if they haven't set it)
  let materials = icaiMaterialsDB.filter(m => m.subjectId === subjectId);
  if (attempt && attempt !== 'All') {
    materials = materials.filter(m => m.attempt === attempt || m.attempt === 'All');
  }
  res.json(materials);
});

// CA Subjects API
app.get('/api/subjects', (req, res) => {
  const { group, userId } = req.query;
  const uid = req.query.userId || (req.user ? req.user.id : 'u1');
  const userAttempts = attemptsDB.filter(a => a.user_id === uid);
  const userProfile = userProfileDB[uid] || {};
  
  // Strict filter: either pass in the group query param, or fallback to what's in profile
  const targetGroup = group || userProfile.ca_group || "Both Groups";
  const targetStage = userProfile.ca_stage || "intermediate";

  let filteredSubjects = [];
  
  if (targetStage !== "intermediate" && SYLLABUS_BY_STAGE[targetStage]) {
    // Map the new syllabus structure to the old caSubjectsDB format expected by the frontend
    filteredSubjects = SYLLABUS_BY_STAGE[targetStage].papers.map(p => ({
      id: p.id,
      title: p.shortTitle || p.title,
      group: p.group || "Foundation", // Fallback for stages without groups
      color: p.color
    }));
    
    if (targetStage === "final" && targetGroup !== "Both Groups") {
      filteredSubjects = filteredSubjects.filter(s => s.group === targetGroup);
    }
  } else {
    // Fallback to the legacy hardcoded DB for intermediate to preserve backward compatibility for progress/flashcards
    filteredSubjects = caSubjectsDB;
    if (targetGroup !== "Both Groups") {
      filteredSubjects = caSubjectsDB.filter(s => s.group === targetGroup);
    }
  }

  const enrichedSubjects = filteredSubjects.map(sub => {
    // Map ca-taxation -> taxation, etc.
    const subAttempts = userAttempts.filter(a => a.exam_id === `ca-${sub.id}` || a.exam_id === sub.id || a.exam_id.includes(sub.id));
    
    let questionsAttempted = 0;
    let correctCount = 0;
    let weakAreasSet = new Set();
    
    subAttempts.forEach(att => {
      questionsAttempted += att.total || 0;
      correctCount += att.correct || 0;
      (att.weak_topics || []).forEach(wt => weakAreasSet.add(wt));
    });

    let accuracy = null;
    let progress = 0;
    if (questionsAttempted > 0) {
      accuracy = Math.round((correctCount / questionsAttempted) * 100);
      progress = Math.min(100, Math.round(questionsAttempted / 2)); // Mock progress based on attempts
    }

    return {
      ...sub,
      progress,
      questionsAttempted,
      accuracy,
      weakAreas: weakAreasSet.size
    };
  });

  res.json(enrichedSubjects);
});

app.get('/api/subjects/:id', (req, res) => {
  const subject = caSubjectsDB.find(sub => sub.id === req.params.id);
  if (!subject) return res.status(404).json({ error: "Subject not found" });
  res.json(subject);
});

// Progress & Daily Study Hours
app.get('/api/progress', (req, res) => {
  const uid = req.query.userId || req.body?.userId || (req.user ? req.user.id : 'u1');
  const userAttempts = attemptsDB.filter(a => a.user_id === uid);
  const total_exams = userAttempts.length;
  const avg_score = total_exams > 0 
    ? Math.round(userAttempts.reduce((acc, curr) => acc + curr.score_pct, 0) / total_exams)
    : 0;

  const weakTopicsCount = {};
  userAttempts.forEach(att => {
    (att.weak_topics || []).forEach(wt => {
      weakTopicsCount[wt] = (weakTopicsCount[wt] || 0) + 1;
    });
  });

  const weak_topics = Object.keys(weakTopicsCount).sort((a,b) => weakTopicsCount[b] - weakTopicsCount[a]);

  const trend = userAttempts.slice(0, 5).reverse().map((att, idx) => ({
    name: `#${idx + 1}`,
    score: att.score_pct,
    exam: att.exam_title
  }));

  if (!userProgressDB[uid]) {
    userProgressDB[uid] = { total_study_minutes: 0, completed_pomodoros: 0, completed_exams: 0, current_streak: 1, last_active_date: getTodayIST() };
  }
  const prog = userProgressDB[uid];
  const study_hours_today = (prog.total_study_minutes / 60).toFixed(2);
  
  // Verify streak freshness based on calendar days in IST
  const today = getTodayIST();
  const yesterday = getYesterdayIST();
  let activeStreak = prog.current_streak || 1;
  if (prog.last_active_date && prog.last_active_date !== today && prog.last_active_date !== yesterday) {
    // Missed at least 1 full calendar day
    activeStreak = 1;
  }

  // Calculate XP and Level
  const xp = prog.total_study_minutes * 10 + (prog.completed_exams * 100);
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const xpForNextLevel = Math.pow(level, 2) * 100;
  const xpForCurrentLevel = Math.pow(level - 1, 2) * 100;
  const levelProgress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  res.json({
    attempts: userAttempts,
    avg_score,
    total_exams,
    weak_topics,
    trend,
    study_hours_today,
    total_study_minutes: prog.total_study_minutes,
    completed_pomodoros: prog.completed_pomodoros,
    current_streak: activeStreak,
    last_active_date: prog.last_active_date,
    daily_goal_minutes: prog.daily_goal_minutes || 180,
    xp,
    level,
    levelProgress,
    time12: get12HourInfo().formattedTime12
  });
});

// Daily Check-In Endpoint to maintain and increment streak on presence
app.post('/api/progress/check-in', (req, res) => {
  const uid = req.body?.userId || req.query?.userId || (req.user ? req.user.id : 'u1');
  const streakInfo = updateStreakForUser(uid);
  res.json({
    success: true,
    current_streak: streakInfo.current_streak,
    incremented: streakInfo.incremented,
    today: getTodayIST()
  });
});

app.post('/api/progress/study-hours', (req, res) => {
  const { minutesAdded, isPomodoro, activityType, userId } = req.body;
  const uid = userId || (req.user ? req.user.id : 'u1');
  if (!userProgressDB[uid]) {
    userProgressDB[uid] = { total_study_minutes: 0, completed_pomodoros: 0, completed_exams: 0, current_streak: 1 };
  }
  const mins = minutesAdded || 25;
  userProgressDB[uid].total_study_minutes += mins;
  if (isPomodoro) userProgressDB[uid].completed_pomodoros += 1;

  // Update real consecutive day streak
  updateStreakForUser(uid);

  // Auto-strike off matching schedule activity item upon real-time session completion!
  const userSched = getUserSchedule(uid);
  const pendingItem = userSched.find(s => !s.done && (s.type === activityType || s.type === 'wellness' || s.type === 'exam' || s.type === 'study'));
  if (pendingItem) {
    pendingItem.done = true;
  }

  res.json({
    total_study_minutes: userProgressDB[uid].total_study_minutes,
    study_hours_today: (userProgressDB[uid].total_study_minutes / 60).toFixed(2),
    completed_pomodoros: userProgressDB[uid].completed_pomodoros,
    current_streak: userProgressDB[uid].current_streak,
    schedule: userSched
  });
});

app.post('/api/progress/pomodoro', (req, res) => {
  const uid = req.body?.userId || req.query?.userId || (req.user ? req.user.id : 'u1');
  if (!userProgressDB[uid]) {
    userProgressDB[uid] = { total_study_minutes: 0, completed_pomodoros: 0, completed_exams: 0, current_streak: 1 };
  }
  userProgressDB[uid].total_study_minutes += 25;
  userProgressDB[uid].completed_pomodoros = (userProgressDB[uid].completed_pomodoros || 0) + 1;
  updateStreakForUser(uid);

  const userSched = getUserSchedule(uid);
  const pendingItem = userSched.find(s => !s.done && (s.type === 'study' || s.type === 'exam'));
  if (pendingItem) {
    pendingItem.done = true;
  }

  res.json({
    success: true,
    total_study_minutes: userProgressDB[uid].total_study_minutes,
    completed_pomodoros: userProgressDB[uid].completed_pomodoros,
    current_streak: userProgressDB[uid].current_streak,
    schedule: userSched
  });
});

// Personal AI Study Coach Analytics API (Filtered strictly by selected CA Group)
app.get('/api/analytics', (req, res) => {
  const uid = req.query.userId || (req.user ? req.user.id : 'u1');
  const userProfile = userProfileDB[uid] || {};
  const targetGroup = req.query.group || userProfile.ca_group || "Both Groups";
  const userAttempts = attemptsDB.filter(a => a.user_id === uid);
  const prog = userProgressDB[uid] || { total_study_minutes: 0, current_streak: 1 };

  // Calculate Subject Mastery filtered strictly by Group
  const ALL_MASTERY_BASE = [
    { subject: "Adv. Accounting", score: 72, group: "Group 1", id: "advanced-accounting" },
    { subject: "Corporate Laws",  score: 65, group: "Group 1", id: "corporate-laws" },
    { subject: "Taxation",        score: 68, group: "Group 1", id: "taxation" },
    { subject: "Cost Accounting", score: 74, group: "Group 2", id: "cost-management" },
    { subject: "Auditing",        score: 62, group: "Group 2", id: "auditing-ethics" },
    { subject: "FM & SM",         score: 70, group: "Group 2", id: "fm-sm" }
  ];

  let filteredMastery = ALL_MASTERY_BASE;
  if (targetGroup === "Group 1") {
    filteredMastery = ALL_MASTERY_BASE.filter(m => m.group === "Group 1");
  } else if (targetGroup === "Group 2") {
    filteredMastery = ALL_MASTERY_BASE.filter(m => m.group === "Group 2");
  }

  // Update mastery from actual user exam attempts if available
  const subjectMasteryData = filteredMastery.map(item => {
    const relevantAttempts = userAttempts.filter(att => 
      att.exam_id?.includes(item.id) || 
      att.exam_title?.toLowerCase().includes(item.subject.toLowerCase())
    );
    if (relevantAttempts.length > 0) {
      const avg = Math.round(relevantAttempts.reduce((acc, curr) => acc + curr.score_pct, 0) / relevantAttempts.length);
      return { subject: item.subject, score: avg, group: item.group };
    }
    return { subject: item.subject, score: item.score, group: item.group };
  });

  const weeklyHours = (prog.total_study_minutes ? (prog.total_study_minutes / 60) : 18.5).toFixed(1);
  const avgDailyHours = (parseFloat(weeklyHours) / 7).toFixed(1);
  const examsTaken = userAttempts.length > 0 ? userAttempts.length : 12;
  const passRate = userAttempts.length > 0 
    ? Math.round((userAttempts.filter(a => a.score_pct >= 40).length / userAttempts.length) * 100)
    : 78;

  if (userAttempts.length === 0) {
    return res.json({
      readinessScore: 68,
      weaknesses: [],
      nextAction: `Revise ${subjectMasteryData[0]?.subject || 'Core Subjects'} to prepare for upcoming Mock Exams.`,
      weeklyHours,
      avgDailyHours,
      examsTaken,
      passRate,
      streak: prog.current_streak || 1,
      subjectMasteryData
    });
  }

  // Calculate Weaknesses grouped by Subject
  const weaknessMap = {};
  userAttempts.forEach(att => {
    let subject = att.exam_title.split('-')[0].trim();
    if (att.exam_title.includes('Taxation')) subject = 'Taxation';
    else if (att.exam_title.includes('Auditing')) subject = 'Auditing & Ethics';
    else if (att.exam_title.includes('Advanced Accounting')) subject = 'Advanced Accounting';
    else if (att.exam_title.includes('Corporate & Other Laws')) subject = 'Corporate & Other Laws';
    else if (att.exam_title.includes('Cost & Management')) subject = 'Cost & Management Accounting';
    else if (att.exam_title.includes('FM & SM')) subject = 'Financial Management & Strategic Management';

    if (!weaknessMap[subject]) weaknessMap[subject] = new Set();
    
    (att.weak_topics || []).forEach(topic => {
      weaknessMap[subject].add(topic);
    });
  });

  let weaknesses = Object.entries(weaknessMap).map(([subject, topicsSet]) => ({
    subject,
    topics: Array.from(topicsSet)
  })).filter(w => w.topics.length > 0);

  // Filter weaknesses by active group
  if (targetGroup === "Group 1") {
    weaknesses = weaknesses.filter(w => ['Advanced Accounting', 'Corporate & Other Laws', 'Taxation'].includes(w.subject));
  } else if (targetGroup === "Group 2") {
    weaknesses = weaknesses.filter(w => ['Cost & Management Accounting', 'Auditing & Ethics', 'Financial Management & Strategic Management'].includes(w.subject));
  }

  // Calculate Readiness Score
  const avgScore = userAttempts.reduce((acc, curr) => acc + curr.score_pct, 0) / userAttempts.length;
  const uniqueExamsCount = new Set(userAttempts.map(a => a.exam_id)).size;
  const practiceBump = Math.min(15, uniqueExamsCount * 2);
  let readinessScore = Math.round(avgScore + practiceBump);
  if (readinessScore > 98) readinessScore = 98;
  if (readinessScore < 20) readinessScore = 20;

  let nextAction = "Take a full subject Mock Exam to update your readiness score.";
  if (weaknesses.length > 0) {
    const firstWeakness = weaknesses[0];
    const firstTopic = firstWeakness.topics[0] || 'your weak areas';
    nextAction = `Revise ${firstWeakness.subject}: ${firstTopic} as you struggled with it recently.`;
  }

  res.json({
    readinessScore,
    weaknesses,
    nextAction,
    weeklyHours,
    avgDailyHours,
    examsTaken,
    passRate,
    streak: prog.current_streak || 1,
    subjectMasteryData
  });
});

// Exams API
app.get('/api/exams', (req, res) => {
  const uid = req.user ? req.user.id : 'u1';
  const userProfile = userProfileDB[uid] || {};
  const targetGroup = userProfile.ca_group || "Both Groups";

  const list = examsDB.map(exam => {
    const subject = caSubjectsDB.find(s => s.id === exam.id || exam.id.includes(s.id));
    return { ...exam, group: subject ? subject.group : "General" };
  }).map(({ id, title, description, duration_sec, difficulty, question_count, group }) => ({
    id, title, description, duration_sec, difficulty, question_count, group
  }));

  let availableExams = list;
  if (targetGroup !== "Both Groups") {
    availableExams = list.filter(exam => exam.group === targetGroup || exam.group === "General");
  }

  res.json(availableExams);
});

// Flashcards API
app.get('/api/flashcards', (req, res) => {
  const uid = req.user ? req.user.id : 'u1';
  const userProfile = userProfileDB[uid] || {};
  const targetGroup = userProfile.ca_group || "Both Groups";
  const userProgress = flashcardProgressDB[uid] || {};

  // Combine built-in flashcards with user-imported ones
  const allFlashcards = [
    ...flashcardsDB,
    ...importedFlashcards.map(fc => ({ ...fc, isCustom: true }))
  ];

  const list = allFlashcards.map(fc => {
    const subject = caSubjectsDB.find(s => s.id === fc.subject_id);
    const progData = userProgress[fc.id];
    let status = 'pending';
    let nextReviewDate = null;
    if (progData) {
      if (typeof progData === 'string') status = progData;
      else {
        status = progData.status || 'pending';
        nextReviewDate = progData.next_review_date;
      }
    }
    return { ...fc, group: subject ? subject.group : "General", status, next_review_date: nextReviewDate };
  });

  let availableFC = list;
  // Custom imported cards (group: "General") are always shown regardless of group setting
  if (targetGroup !== "Both Groups") {
    availableFC = list.filter(fc => fc.group === targetGroup || fc.group === "General" || fc.isCustom);
  }

  res.json(availableFC);
});

app.post('/api/flashcards/progress', (req, res) => {
  const { userId, cardId, quality } = req.body;
  if (!flashcardProgressDB[userId]) {
    flashcardProgressDB[userId] = {};
  }
  
  // SM-2 Algorithm Implementation
  let data = flashcardProgressDB[userId][cardId] || { interval: 0, repetition: 0, easiness_factor: 2.5 };
  
  if (typeof quality === 'number') {
    if (quality >= 3) {
      if (data.repetition === 0) {
        data.interval = 1;
      } else if (data.repetition === 1) {
        data.interval = 6;
      } else {
        data.interval = Math.round(data.interval * data.easiness_factor);
      }
      data.repetition += 1;
    } else {
      data.repetition = 0;
      data.interval = 1;
    }

    data.easiness_factor = data.easiness_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (data.easiness_factor < 1.3) data.easiness_factor = 1.3;

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + data.interval);
    data.next_review_date = nextDate.toISOString();
    
    // Legacy status support for frontend UI styling
    data.status = quality >= 4 ? 'mastered' : (quality >= 3 ? 'review' : 'learning');
  } else {
    // Legacy support (non-SM2)
    data.status = req.body.status;
  }

  flashcardProgressDB[userId][cardId] = data;
  res.json({ success: true, progress: data });
});

app.get('/api/exams/:id', (req, res) => {
  const exam = examsDB.find(e => e.id === req.params.id);
  if (!exam) return res.status(404).json({ error: "Exam not found" });
  res.json(exam);
});

app.post('/api/exams/submit', (req, res) => {
  const { exam_id, answers, time_taken_sec } = req.body;
  const exam = examsDB.find(e => e.id === exam_id);
  if (!exam) return res.status(400).json({ error: "Invalid exam id" });

  let correctCount = 0;
  let topicStats = {};
  let weakTopicsSet = new Set();
  let strongTopicsSet = new Set();

  exam.questions.forEach((q, idx) => {
    const topic = q.topic || "General";
    if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
    topicStats[topic].total += 1;

    const userAns = answers[idx];
    if (userAns !== undefined && userAns === q.correct) {
      correctCount++;
      topicStats[topic].correct += 1;
    } else {
      weakTopicsSet.add(topic);
    }
  });

  Object.entries(topicStats).forEach(([topic, stats]) => {
    if (stats.correct / stats.total >= 0.8 && !weakTopicsSet.has(topic)) {
      strongTopicsSet.add(topic);
    } else {
      weakTopicsSet.add(topic);
    }
  });

  const total = exam.questions.length;
  const score_pct = Math.round((correctCount / total) * 100);

  const attempt = {
    id: 'att-' + Date.now(),
    user_id: req.user ? req.user.id : 'u1',
    user: req.body.userName || "demo-student",
    exam_id,
    exam_title: exam.title,
    score_pct,
    correct: correctCount,
    total,
    time_taken_sec: time_taken_sec || 120,
    weak_topics: Array.from(weakTopicsSet),
    strong_topics: Array.from(strongTopicsSet),
    topic_stats: topicStats,
    created_at: new Date().toISOString()
  };

  attemptsDB.unshift(attempt);

  // Auto-accumulate 15 minutes of study time on exam completion & auto-strike exam schedule item
  const uid = req.body?.userId || req.query?.userId || attempt.user_id || 'u1';
  if (!userProgressDB[uid]) {
    userProgressDB[uid] = { total_study_minutes: 0, completed_pomodoros: 0, completed_exams: 0, current_streak: 1 };
  }
  userProgressDB[uid].total_study_minutes += 15;
  userProgressDB[uid].completed_exams = (userProgressDB[uid].completed_exams || 0) + 1;
  updateStreakForUser(uid);

  const userSched = getUserSchedule(uid);
  const examScheduleItem = userSched.find(s => !s.done && (s.type === 'exam' || s.type === 'study'));
  if (examScheduleItem) examScheduleItem.done = true;

  res.json({
    attempt,
    questions: exam.questions,
    total_study_minutes: userProgressDB[uid].total_study_minutes,
    current_streak: userProgressDB[uid].current_streak,
    schedule: userSched
  });
});

// Timetable Schedule API with 12-Hour Format & Auto-Overdue Reminders
app.get('/api/schedule', (req, res) => {
  const uid = req.query.userId || (req.user ? req.user.id : 'u1');
  const now = new Date();
  const currentTotalMins = now.getHours() * 60 + now.getMinutes();

  const userSchedule = getUserSchedule(uid);
  const enrichedSchedule = userSchedule.map(item => {
    // Parse 12-hour string e.g. "06:30 PM"
    let time12Val = item.time12;
    if (!time12Val && item.timeRange) time12Val = item.timeRange.split(' - ')[0];
    if (!time12Val && item.time) time12Val = item.time.split(' - ')[0];
    if (!time12Val) time12Val = "12:00 AM";
    const [timeStr, period] = (time12Val || "").split(' ');
    if (!timeStr) {
      console.log("BAD ITEM:", item);
      return item;
    }
    const [hStr, mStr] = (timeStr || "").split(':');
    let itemH = parseInt(hStr, 10);
    const itemM = parseInt(mStr, 10);

    if (period === 'PM' && itemH !== 12) itemH += 12;
    if (period === 'AM' && itemH === 12) itemH = 0;

    const itemTotalMins = itemH * 60 + itemM;

    const isOverdue = !item.done && (currentTotalMins > itemTotalMins + 15);
    const isDueNow = !item.done && (Math.abs(currentTotalMins - itemTotalMins) <= 45);

    return {
      ...item,
      isOverdue,
      isDueNow
    };
  });

  res.json(enrichedSchedule);
});

app.post('/api/schedule/toggle', (req, res) => {
  const { id } = req.body;
  const item = scheduleDB.find(s => s.id === id);
  if (item) {
    item.done = !item.done;
    item.status = item.done ? 'Completed' : 'Not Completed';
  }
  res.json(scheduleDB);
});

app.post('/api/schedule/update-status', (req, res) => {
  const { id, status } = req.body;
  const item = scheduleDB.find(s => s.id === id);
  if (item) {
    item.status = status;
    item.done = status === 'Completed';
  }
  res.json(scheduleDB);
});

app.post('/api/schedule/custom', (req, res) => {
  const { schedule } = req.body;
  if (Array.isArray(schedule)) {
    scheduleDB = schedule;
  }
  res.json(scheduleDB);
});

app.post('/api/schedule/ai-generate', (req, res) => {
  const userId = req.user ? req.user.id : 'u1';
  const profile = userProfileDB[userId] || { ca_group: "Both Groups" };
  const ca_group = profile.ca_group;

  let availableSubjects = caSubjectsDB;
  if (ca_group === "Group 1" || ca_group === "Group 2") {
    availableSubjects = caSubjectsDB.filter(s => s.group === ca_group);
  }
  if (availableSubjects.length === 0) availableSubjects = caSubjectsDB;

  const userAttempts = attemptsDB.filter(a => a.userId === userId);
  const weaknessMap = {};
  userAttempts.forEach(att => {
    let subject = att.exam_title.split('-')[0].trim();
    if (att.exam_title.includes('Taxation')) subject = 'Taxation';
    else if (att.exam_title.includes('Cost & Management')) subject = 'Cost & Management Accounting';
    else if (att.exam_title.includes('FM & SM')) subject = 'Financial Management & Strategic Management';
    if (!weaknessMap[subject]) weaknessMap[subject] = new Set();
    (att.weak_topics || []).forEach(topic => weaknessMap[subject].add(topic));
  });

  const weaknesses = Object.entries(weaknessMap).map(([subject, topicsSet]) => ({
    subject,
    topics: Array.from(topicsSet)
  })).filter(w => w.topics.length > 0);

  const groupSubjectTitles = availableSubjects.map(s => s.title);
  const groupWeaknesses = weaknesses.filter(w => groupSubjectTitles.includes(w.subject));

  // --- SMART ALLOCATOR ALGORITHM ---
  const wakeTime = req.body.wakeTime || profile.wake_time || "07:00";
  const sleepTime = req.body.sleepTime || profile.sleep_time || "23:00";
  const studyHours = parseInt(req.body.studyHours || profile.daily_study_hours || 8, 10);
  const availableHours = parseInt(req.body.availableHours || studyHours, 10);
  const commitmentsStr = req.body.commitmentsStr ?? profile.commitments ?? "";

  if (req.body.studyHours) {
    profile.daily_study_hours = studyHours;
    profile.wake_time = wakeTime;
    profile.sleep_time = sleepTime;
    profile.commitments = commitmentsStr;
  }

  const parseTime = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + (m || 0);
  };
  
  const formatTime12 = (mins) => {
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const wakeMins = parseTime(wakeTime);
  const sleepMins = parseTime(sleepTime);

  const commitments = [];
  const regex = /(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*(.*)/g;
  let match;
  while ((match = regex.exec(commitmentsStr)) !== null) {
    commitments.push({
      start: parseTime(match[1]),
      end: parseTime(match[2]),
      label: match[3].trim()
    });
  }

  commitments.push({ start: parseTime("13:00"), end: parseTime("14:00"), label: "Lunch Break 🥗" });
  commitments.push({ start: parseTime("20:00"), end: parseTime("21:00"), label: "Dinner Break 🍛" });

  commitments.sort((a, b) => a.start - b.start);
  
  const mergedCommitments = [];
  for (const c of commitments) {
    if (c.end <= wakeMins || c.start >= sleepMins) continue;
    c.start = Math.max(c.start, wakeMins);
    c.end = Math.min(c.end, sleepMins);
    
    if (mergedCommitments.length === 0) {
      mergedCommitments.push(c);
    } else {
      const prev = mergedCommitments[mergedCommitments.length - 1];
      if (c.start <= prev.end) {
        prev.end = Math.max(prev.end, c.end);
        prev.label += " & " + c.label;
      } else {
        mergedCommitments.push(c);
      }
    }
  }

  const freeBlocks = [];
  let currTime = wakeMins;
  for (const c of mergedCommitments) {
    if (c.start > currTime) {
      freeBlocks.push({ start: currTime, end: c.start });
    }
    currTime = Math.max(currTime, c.end);
  }
  if (sleepMins > currTime) {
    freeBlocks.push({ start: currTime, end: sleepMins });
  }

  let targetMins = studyHours * 60;
  const sessions = [];
  const blockDuration = 90; 

  for (const fb of freeBlocks) {
    let t = fb.start;
    while (t + blockDuration <= fb.end && targetMins > 0) {
      let dur = Math.min(blockDuration, targetMins);
      sessions.push({ start: t, end: t + dur, isStudy: true });
      targetMins -= dur;
      t += dur;
      
      if (t + 15 <= fb.end && targetMins > 0) {
        sessions.push({ start: t, end: t + 15, isStudy: false, label: "Short Break ☕" });
        t += 15;
      }
    }
    if (t < fb.end && targetMins > 0) {
      let dur = Math.min(fb.end - t, targetMins);
      if (dur >= 30) {
        sessions.push({ start: t, end: t + dur, isStudy: true });
        targetMins -= dur;
      }
    }
  }

  let finalSchedule = [];
  
  for (const c of mergedCommitments) {
    finalSchedule.push({
      startMins: c.start,
      time: `${formatTime12(c.start)} - ${formatTime12(c.end)}`,
      activity: c.label,
      focus: "Fixed Commitment",
      type: "commitment"
    });
  }

  let priorityIndex = 0;
  const getNextStudyTopic = () => {
    const prioritySubjects = [...availableSubjects].sort((a, b) => {
      const aWeak = groupWeaknesses.find(w => w.subject === a.title);
      const bWeak = groupWeaknesses.find(w => w.subject === b.title);
      if (aWeak && !bWeak) return -1;
      if (!aWeak && bWeak) return 1;
      return 0;
    });

    const subj = prioritySubjects[priorityIndex % prioritySubjects.length];
    priorityIndex++;
    
    const w = groupWeaknesses.find(w => w.subject === subj.title);
    if (w && w.topics.length > 0) {
      return { activity: subj.title, focus: `Weak Topic: ${w.topics[0]}`, id: subj.id };
    }
    return { activity: subj.title, focus: "New Topic / Practice", id: subj.id };
  };

  for (const s of sessions) {
    if (s.isStudy) {
      const topic = getNextStudyTopic();
      finalSchedule.push({
        startMins: s.start,
        time: `${formatTime12(s.start)} - ${formatTime12(s.end)}`,
        activity: topic.activity,
        focus: topic.focus,
        type: "study",
        link: `/subject/${topic.id}`
      });
    } else {
      finalSchedule.push({
        startMins: s.start,
        time: `${formatTime12(s.start)} - ${formatTime12(s.end)}`,
        activity: s.label,
        focus: "Relaxation",
        type: "break"
      });
    }
  }

  finalSchedule.sort((a, b) => a.startMins - b.startMins);
  
  const scheduleData = finalSchedule.map((s, idx) => ({
    id: `ai-sched-${idx}`,
    timeRange: s.time,
    activity: s.activity,
    focus: s.focus,
    type: s.type,
    done: false,
    status: 'Not Completed',
    link: s.link
  }));

  let whyThisSchedule = "We prioritized ";
  if (groupWeaknesses.length > 0) {
    whyThisSchedule += `**${groupWeaknesses[0].subject} (${groupWeaknesses[0].topics[0] || 'weak areas'})** because of your recent mock exam scores. `;
  } else {
    whyThisSchedule += `a balanced mix of your CA subjects. `;
  }
  whyThisSchedule += `We fit your ${studyHours} target study hours perfectly around your wake/sleep times and fixed commitments.`;

  scheduleDB = scheduleData;
  userProfileDB[userId].whyThisSchedule = whyThisSchedule; // Save the explanation to profile
  
  res.json(scheduleDB);
});

// Mood API
app.get('/api/mood', (req, res) => res.json(moodDB));

app.post('/api/mood', (req, res) => {
  const { mood, rating, note } = req.body;
  const time12Str = get12HourInfo().formattedTime12;
  const newEntry = {
    id: 'm-' + Date.now(),
    mood: mood || "Focused",
    rating: rating || 5,
    note: note || "",
    date: `Today, ${time12Str}`
  };
  moodDB.unshift(newEntry);
  res.json(moodDB);
});

// Community Doubts API
app.get('/api/doubts', (req, res) => res.json(doubtsDB));

app.post('/api/doubts', (req, res) => {
  const { topic, title, content, author } = req.body;
  const newDoubt = {
    id: 'd-' + Date.now(),
    author: author || "Student User",
    avatar: (author || "SU").substring(0,2).toUpperCase(),
    topic: topic || "General",
    title, content, votes: 1, created_at: "Just now", replies: []
  };
  doubtsDB.unshift(newDoubt);
  res.json(newDoubt);
});

app.post('/api/doubts/:id/replies', (req, res) => {
  const doubt = doubtsDB.find(d => d.id === req.params.id);
  if (!doubt) return res.status(404).json({ error: "Doubt not found" });
  doubt.replies.push({
    id: 'r-' + Date.now(),
    author: req.body.author || "Mindful Scholar",
    avatar: "MS",
    content: req.body.content,
    created_at: "Just now"
  });
  res.json(doubt);
});

// Centralized Resilient Groq AI completions with automatic model fallback
async function callGroqChat({ messages, temperature = 0.5, max_tokens = 1024, response_format = null }) {
  const models = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b'];
  let lastError = null;

  for (const model of models) {
    try {
      const payload = {
        model,
        messages,
        temperature,
        max_tokens
      };
      if (response_format) payload.response_format = response_format;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`[Groq] Model ${model} returned status ${response.status}: ${errText}`);
        lastError = new Error(`Groq status ${response.status}: ${errText}`);
        continue;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        return content;
      }
    } catch (err) {
      console.warn(`[Groq] Failed calling model ${model}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("All Groq models failed");
}

// News API (Powered by Real-Time RSS + Groq)
let newsLastFetched = 0;
app.get('/api/news', async (req, res) => {
  const now = Date.now();
  if (newsDB.length > 0 && (now - newsLastFetched < 3600000)) { // 1 hour cache
    return res.json(newsDB);
  }
  newsLastFetched = now;

  try {
    // 1. Fetch from multiple trusted sources via Google News RSS and direct RSS
    const rssFeeds = [
      { name: 'ICAI', url: 'https://news.google.com/rss/search?q=site:icai.org+OR+site:boslive.icai.org+announcements&hl=en-IN&gl=IN&ceid=IN:en' },
      { name: 'Tax & GST', url: 'https://news.google.com/rss/search?q=site:incometax.gov.in+OR+site:gstcouncil.gov.in&hl=en-IN&gl=IN&ceid=IN:en' },
      { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/news/economy/rssfeeds/1373380680.cms' }
    ];

    let combinedNews = [];
    
    for (const feed of rssFeeds) {
      try {
        const rssRes = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`);
        const rssData = await rssRes.json();
        if (rssData.items && rssData.items.length > 0) {
          // Take top 2-3 from each source
          const topItems = rssData.items.slice(0, 3).map(item => ({
            title: item.title,
            summary: item.description ? item.description.replace(/<[^>]*>?/gm, '').substring(0, 200) : '',
            source: feed.name,
            originalUrl: item.link,
            date: item.pubDate
          }));
          combinedNews.push(...topItems);
        }
      } catch (e) {
        console.warn(`Failed to fetch RSS for ${feed.name}:`, e);
      }
    }

    const promptContext = JSON.stringify(combinedNews.slice(0, 8)); // Max 8 items for groq to process quickly

    // 2. Feed real headlines to Groq to generate CA Inter specific applicability
    const groqMessages = [
      { 
        role: 'system', 
        content: `You are an AI news aggregator for CA Intermediate students. I will provide you with a list of real-time news articles in JSON format.
        Your job is to read them and classify each update.
        
        CRITICAL RULES:
        1. Classify "importance" as exactly one of: "🔴 MUST KNOW", "🟡 RELEVANT", or "🔵 GENERAL FINANCE".
        2. Classify "category" as exactly one of these CA Intermediate subjects: "Advanced Accounting", "Corporate & Other Laws", "Taxation", "Cost & Management Accounting", "Auditing & Ethics", "FM & SM". If it doesn't fit any, use "Finance & Economy".
        3. Provide a "whyItMatters" explanation that is very short and CA-student-friendly.
        
        Output MUST be a valid JSON array of objects with exactly these keys: id (string), importance (string), headline (string), summary (string), category (string), source (string), date (string), originalUrl (string), whyItMatters (string).`
      },
      {
        role: 'user',
        content: `Here are the latest real-world news articles. Format them and generate applicability analysis: ${promptContext}`
      }
    ];

    const replyText = await callGroqChat({
      messages: groqMessages,
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: "json_object" }
    });
    
    // Sometimes Groq wraps JSON array in an object if response_format is json_object
    let parsed = JSON.parse(replyText);
    if (!Array.isArray(parsed)) {
      // Find the first array value in the object
      const key = Object.keys(parsed).find(k => Array.isArray(parsed[k]));
      parsed = key ? parsed[key] : [];
    }

    // Add originalUrl back if missing
    parsed = parsed.map((item, idx) => ({
      ...item,
      originalUrl: item.originalUrl || (combinedNews[idx] ? combinedNews[idx].originalUrl : '#')
    }));

    newsDB = parsed;
    res.json(newsDB);
  } catch (error) {
    // Fallback if API fails or rate limited
    res.json([
      {
        id: "icai-1",
        importance: "🔴 MUST KNOW",
        headline: "ICAI Announces CA Intermediate May 2027 Exam Dates",
        category: "Exam Updates",
        source: "ICAI",
        date: "Today",
        summary: "The Institute of Chartered Accountants of India (ICAI) has officially released the timetable for the CA Intermediate May 2027 examinations. Exams will commence from May 2nd.",
        whyItMatters: "Directly affects your study schedule and exam planning strategy.",
        originalUrl: "https://icai.org"
      },
      {
        id: "tax-1",
        importance: "🔴 MUST KNOW",
        headline: "New Income Tax Regime Default for AY 2024-25",
        category: "Taxation",
        source: "Income Tax Department",
        date: "Yesterday",
        summary: "The CBDT has notified that the new tax regime under section 115BAC will be the default tax regime for individuals and HUFs from Assessment Year 2024-25.",
        whyItMatters: "Crucial for answering computation questions under the Taxation syllabus.",
        originalUrl: "https://incometax.gov.in"
      },
      {
        id: "gst-1",
        importance: "🟡 RELEVANT",
        headline: "GST Council Recommends Relief on Online Gaming",
        category: "Taxation",
        source: "GST Council",
        date: "2 days ago",
        summary: "The 53rd GST Council met today to discuss the taxation on online gaming, casinos, and horse racing, recommending prospective amendments to the valuation rules.",
        whyItMatters: "Important for Indirect Tax application questions regarding supply and valuation.",
        originalUrl: "https://gstcouncil.gov.in"
      },
      {
        id: "corp-1",
        importance: "🔵 GENERAL FINANCE",
        headline: "MCA Updates Rules on Corporate Social Responsibility (CSR)",
        category: "Corporate & Other Laws",
        source: "PIB",
        date: "3 days ago",
        summary: "The Ministry of Corporate Affairs has issued new clarifications regarding unspent CSR accounts and mandatory impact assessment reporting.",
        whyItMatters: "Directly impacts the Company Law portion regarding Section 135 of the Companies Act.",
        originalUrl: "https://pib.gov.in"
      },
      {
        id: "audit-1",
        importance: "🟡 RELEVANT",
        headline: "NFRA Issues New Audit Quality Guidelines",
        category: "Auditing & Ethics",
        source: "Economic Times",
        date: "Last week",
        summary: "The National Financial Reporting Authority (NFRA) has released fresh guidelines to ensure the independence of statutory auditors for listed companies.",
        whyItMatters: "Connects to the Auditing & Ethics syllabus (Professional Ethics & SA 220).",
        originalUrl: "https://economictimes.indiatimes.com"
      },
      {
        id: "acc-1",
        importance: "🔵 GENERAL FINANCE",
        headline: "Ind AS Amendments Notified for Lease Accounting",
        category: "Advanced Accounting",
        source: "ICAI BoS",
        date: "Last week",
        summary: "The Board of Studies has issued a notification regarding the applicability of recent Ind AS 116 amendments for upcoming exams.",
        whyItMatters: "Updates the syllabus for Accounting Standards and lease treatments.",
        originalUrl: "https://boslive.icai.org"
      }
    ]);
  }
});

// Notifications API
app.get('/api/notifications', (req, res) => res.json(notificationsDB));

// AI Tutor Endpoint
app.post('/api/tutor/chat', async (req, res) => {
  const { messages, userContext } = req.body;
  try {
    let systemPrompt = 'You are Tutovia AI, a dedicated 24/7 Mindful Study & Finance Coach for CA (Chartered Accountancy) students. You specialize in Accounting Standards (AS & Ind AS), Corporate Laws, Direct & Indirect Taxation (GST/Income Tax), Costing, Auditing, and FM-SM. Give direct, clear, accurate, and encouraging answers in clean Markdown without hallucinating. Format equations, journal entries, and steps cleanly.';
    
    if (userContext) {
      if (userContext.name) systemPrompt += ` The student's name is ${userContext.name}.`;
      if (userContext.ca_group) systemPrompt += ` Enrolled in CA Intermediate (${userContext.ca_group}).`;
      if (userContext.attempt) systemPrompt += ` Target exam attempt: ${userContext.attempt}.`;
    }

    const groqMessages = [{ role: 'system', content: systemPrompt }];

    if (Array.isArray(messages) && messages.length > 0) {
      messages.forEach(m => {
        const text = (m.text || m.content || '').trim() || (m.image ? '[User attached a problem document image]' : 'Hello');
        groqMessages.push({
          role: m.sender === 'bot' || m.role === 'assistant' ? 'assistant' : 'user',
          content: text
        });
      });
    } else {
      groqMessages.push({ role: 'user', content: 'Hello' });
    }

    const reply = await callGroqChat({
      messages: groqMessages,
      temperature: 0.6,
      max_tokens: 1024
    });

    res.json({ reply });
  } catch (error) {
    console.error("Groq API Error (Tutor):", error);
    res.status(500).json({ reply: "I apologize, my AI study cloud experienced a temporary network delay. Please ask your question once more!" });
  }
});

// Counselor AI Endpoint (Life, Stress & Career Mentor)
app.post('/api/counselor/chat', async (req, res) => {
  const { messages } = req.body;
  try {
    const systemPrompt = "You are Dr. Maya, a Mindful Life & Career Counselor at Tutovia. You are an empathetic, compassionate counselor helping CA students with exam anxiety, study-life balance, motivation, and mental wellness. Answer warmly, concisely, and with encouraging, structured advice in Markdown. Avoid overwhelming the student with giant blocks of text.";
    const groqMessages = [{ role: 'system', content: systemPrompt }];

    if (Array.isArray(messages) && messages.length > 0) {
      messages.forEach(m => {
        const text = (m.text || m.content || '').trim() || 'Hello';
        groqMessages.push({
          role: m.sender === 'counselor' || m.role === 'assistant' ? 'assistant' : 'user',
          content: text
        });
      });
    } else {
      groqMessages.push({ role: 'user', content: 'Hello' });
    }

    const reply = await callGroqChat({
      messages: groqMessages,
      temperature: 0.7,
      max_tokens: 1024
    });

    res.json({ reply, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("Groq API Error (Counselor):", error);
    res.status(500).json({ reply: "I'm right here with you! It seems there was a minor network hiccup. Let's take a deep breath and try sending your thought once more.", timestamp: new Date().toISOString() });
  }
});

// User Settings API (Pomodoro Settings)
app.get('/api/settings', (req, res) => {
  const { userId } = req.query;
  const settings = userSettingsDB[userId] || { workDuration: 25, shortBreakDuration: 5, longBreakDuration: 15 };
  res.json(settings);
});

app.post('/api/settings', (req, res) => {
  const { userId, settings } = req.body;
  if (!userSettingsDB[userId]) userSettingsDB[userId] = {};
  userSettingsDB[userId] = { ...userSettingsDB[userId], ...settings };
  res.json(userSettingsDB[userId]);
});

// Sleep Tracker API
app.get('/api/sleep', (req, res) => {
  const { userId } = req.query;
  const history = sleepDB[userId] || [];
  res.json(history);
});

app.post('/api/sleep', (req, res) => {
  const { userId, hours, quality, date } = req.body;
  if (!sleepDB[userId]) sleepDB[userId] = [];
  const entry = { id: Date.now().toString(), hours, quality, date };
  sleepDB[userId].unshift(entry);
  res.json(sleepDB[userId]);
});

// Leaderboard API
app.get('/api/leaderboard', (req, res) => {
  // Generate dummy leaderboard combining userProgressDB stats
  const leaderboard = Object.keys(userProgressDB).map((uid, index) => {
    const userProf = userProfileDB[uid] || { name: `Student ${index + 1}`, avatar: '' };
    return {
      userId: uid,
      name: userProf.name || `Student ${index + 1}`,
      avatar: userProf.avatar,
      total_study_minutes: userProgressDB[uid].total_study_minutes || 0,
      completed_exams: userProgressDB[uid].completed_exams || 0,
      current_streak: userProgressDB[uid].current_streak || 0
    };
  });

  // Add some dummy competitors if less than 5
  if (leaderboard.length < 5) {
    const dummyNames = ['Rahul S.', 'Priya M.', 'Aditya K.', 'Sneha R.'];
    dummyNames.forEach((name, i) => {
      leaderboard.push({
        userId: `dummy${i}`,
        name,
        avatar: '',
        total_study_minutes: Math.floor(Math.random() * 500) + 100,
        completed_exams: Math.floor(Math.random() * 10) + 1,
        current_streak: Math.floor(Math.random() * 15) + 1
      });
    });
  }

  leaderboard.sort((a, b) => b.total_study_minutes - a.total_study_minutes);

  res.json(leaderboard);
});

// Progress Reset API
app.post('/api/progress/reset', (req, res) => {
  const { type, userId } = req.body;
  const uid = req.user ? req.user.id : 'u1';
  
  if (type === 'exams') {
    // Clear exam attempts for user
    attemptsDB = attemptsDB.filter(a => a.user_id !== uid);
    if (userProgressDB[uid]) {
      userProgressDB[uid].completed_exams = 0;
    }
    return res.json({ success: true, message: "Exam progress reset successfully." });
  } else if (type === 'flashcards') {
    // Clear flashcard progress for user
    const userFlashcards = flashcardProgressDB[uid] || {};
    Object.keys(userFlashcards).forEach(key => {
      userFlashcards[key].status = 'pending';
      userFlashcards[key].confidence = null;
      userFlashcards[key].next_review = null;
    });
    return res.json({ success: true, message: "Flashcard progress reset successfully." });
  }
  
  res.status(400).json({ error: "Invalid reset type." });
});

// Bulk Flashcard Upload API (Excel JSON payload)
app.post('/api/flashcards/bulk', (req, res) => {
  const { flashcards } = req.body;
  if (!flashcards || !Array.isArray(flashcards)) {
    return res.status(400).json({ error: "Invalid payload. Expected array of flashcards." });
  }
  
  let addedCount = 0;
  flashcards.forEach(card => {
    // Add to importedFlashcards if it doesn't already exist
    const exists = importedFlashcards.find(c => c.question === card.question);
    if (!exists) {
      importedFlashcards.push({
        id: `custom_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        ...card
      });
      addedCount++;
    }
  });
  
  res.json({ success: true, addedCount });
});

app.post('/api/exams/ai-generate', async (req, res) => {
  const { subject, topic, difficulty } = req.body;
  if (!subject) return res.status(400).json({ error: 'Subject is required' });

  try {
    const prompt = `Generate a 5-question multiple choice quiz for CA Intermediate students.
Subject: ${subject}
Topic: ${topic || 'General'}
Difficulty: ${difficulty || 'medium'}

Format the output as a valid JSON array of objects. Do not include markdown code blocks or any other text.
Each object should have the exact following structure:
{
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0, // Index of the correct option (0-3)
  "explanation": "Brief explanation of why this is correct."
}`;

    let rawText = "[]";
    try {
      rawText = await callGroqChat({
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2500
      });
    } catch (e) {
      console.error("Groq Exam Generation error:", e);
    }
    // Clean up potential markdown formatting
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let questions;
    try {
      const match = rawText.match(/\[[\s\S]*\]/);
      const jsonCandidate = (match ? match[0] : rawText)
        .replace(/\/\/[^\n]*/g, '')
        .replace(/,\s*([\]}])/g, '$1')
        .trim();
      questions = JSON.parse(jsonCandidate);
    } catch (e) {
      console.error("Failed to parse AI JSON:", rawText);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    const aiExam = {
      id: `exam-ai-${Date.now()}`,
      title: `AI Quiz: ${subject} ${topic ? '- ' + topic : ''}`,
      subject: subject,
      date: new Date().toISOString().split('T')[0],
      duration: '15 mins',
      marks: questions.length * 2,
      status: 'Available',
      questions: questions.map((q, i) => ({
        id: `q${i + 1}`,
        text: q.question,
        options: q.options,
        correctAnswer: q.options[q.correctAnswer] || q.options[0],
        explanation: q.explanation
      }))
    };

    res.json(aiExam);
  } catch (error) {
    console.error("AI Exam Generation Error:", error);
    res.status(500).json({ error: "Failed to generate exam" });
  }
});

// Notes API
app.get('/api/notes', (req, res) => {
  const userId = req.user ? req.user.id : 'u1';
  const subjectId = req.query.subjectId;
  const userNotes = notesDB[userId] || {};
  res.json({ notes: userNotes[subjectId] || '' });
});

app.post('/api/notes', (req, res) => {
  const userId = req.user ? req.user.id : 'u1';
  const subjectId = req.query.subjectId;
  if (!notesDB[userId]) notesDB[userId] = {};
  notesDB[userId][subjectId] = req.body.notes || '';
  res.json({ success: true });
});

app.post('/api/progress/goal', (req, res) => {
  const userId = req.user ? req.user.id : 'u1';
  if (!userProgressDB[userId]) {
    userProgressDB[userId] = { total_study_minutes: 0, completed_pomodoros: 0, completed_exams: 0, current_streak: 3 };
  }
  userProgressDB[userId].daily_goal_minutes = req.body.daily_goal_minutes;
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
