import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, TrendingUp, Award, Clock, BarChart3, Brain, Play } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import axios from '../api.js';
import { useAuth } from "../context/AuthContext.jsx";

// --- Helpers ---

function heatColor(hours) {
  if (!hours || hours === 0) return "bg-slate-800";
  if (hours <= 2) return "bg-indigo-900";
  if (hours <= 4) return "bg-indigo-700";
  return "bg-indigo-500";
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// --- Sub-components ---

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div
      variants={cardVariants}
      className="glass-panel border border-white/10 rounded-2xl p-5 flex items-center gap-4"
    >
      <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
        <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

function HeatmapTooltip({ data }) {
  return (
    <div className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl pointer-events-none">
      <p className="text-slate-300 font-medium">{data.date}</p>
      <p className="text-indigo-400">{data.hours || 0} hrs studied</p>
    </div>
  );
}

function Heatmap({ dailyData }) {
  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Generate 84 days baseline if dailyData is empty
  const activeDays = useMemo(() => {
    if (dailyData && dailyData.length >= 84) return dailyData;
    const days = 84;
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (days - 1 - i));
      return {
        date: date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        hours: 0,
      };
    });
  }, [dailyData]);

  const weeks = [];
  for (let w = 0; w < 12; w++) {
    weeks.push(activeDays.slice(w * 7, w * 7 + 7));
  }

  return (
    <div className="relative">
      <div className="flex gap-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((day, di) => (
              <div
                key={di}
                className={`w-4 h-4 rounded-sm cursor-pointer transition-all duration-150 ${heatColor(
                  day?.hours || 0
                )} hover:ring-2 hover:ring-indigo-400`}
                onMouseEnter={(e) => {
                  setHovered(day);
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </div>
        ))}
      </div>
      {hovered && (
        <div
          className="fixed z-50"
          style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 48 }}
        >
          <HeatmapTooltip data={hovered} />
        </div>
      )}
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
        <span>0h (Unstudied)</span>
        <div className="w-3 h-3 rounded-sm bg-slate-800" />
        <div className="w-3 h-3 rounded-sm bg-indigo-900" />
        <div className="w-3 h-3 rounded-sm bg-indigo-700" />
        <div className="w-3 h-3 rounded-sm bg-indigo-500" />
        <span>4h+ (High focus)</span>
      </div>
    </div>
  );
}

const CustomLineTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="text-indigo-400 font-bold">{payload[0].value}% Accuracy</p>
      </div>
    );
  }
  return null;
};

const CustomRadarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="text-slate-400 mb-1">{payload[0].payload.subject}</p>
        <p className="text-purple-400 font-bold">{payload[0].value} / 100</p>
      </div>
    );
  }
  return null;
};

// --- Main Component ---

export default function Analytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const uid = user?.id;
      if (!uid) {
        setLoading(false);
        return;
      }
      try {
        const [res, profRes] = await Promise.all([
          axios.get(`/api/analytics?userId=${uid}`).catch(() => null),
          axios.get(`/api/profile?userId=${uid}`).catch(() => null)
        ]);
        if (res?.data) {
          setAnalyticsData(res.data);
        }
        if (profRes?.data) {
          setUserProfile(profRes.data);
        }
      } catch {
        // Safe empty error catch
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [user?.id]);

  const displayedMasteryData = useMemo(() => {
    if (analyticsData?.subjectMasteryData && analyticsData.subjectMasteryData.length > 0) {
      return analyticsData.subjectMasteryData;
    }
    const grp = userProfile?.ca_group || "Both Groups";
    const defaultList = [
      { subject: "Adv. Accounting", score: 0, group: "Group 1" },
      { subject: "Corporate Laws", score: 0, group: "Group 1" },
      { subject: "Taxation", score: 0, group: "Group 1" },
      { subject: "Cost Accounting", score: 0, group: "Group 2" },
      { subject: "Auditing", score: 0, group: "Group 2" },
      { subject: "FM & SM", score: 0, group: "Group 2" },
    ];
    if (grp === "Group 1") return defaultList.filter(s => s.group === "Group 1");
    if (grp === "Group 2") return defaultList.filter(s => s.group === "Group 2");
    return defaultList;
  }, [analyticsData?.subjectMasteryData, userProfile?.ca_group]);

  const hasMasteryData = useMemo(() => {
    return displayedMasteryData.some(s => s.score > 0);
  }, [displayedMasteryData]);

  const accuracyData = useMemo(() => {
    return analyticsData?.accuracyTrend || [];
  }, [analyticsData?.accuracyTrend]);

  const stats = analyticsData
    ? [
        { icon: Clock,      label: "Total Study Hours (This Week)", value: `${analyticsData.weeklyHours || '0.0'}h`, sub: "Goal: 20h/week", color: "bg-indigo-500" },
        { icon: TrendingUp, label: "Average Daily Hours",            value: `${analyticsData.avgDailyHours || '0.0'}h`, sub: "Goal: 3.0h/day", color: "bg-purple-500" },
        { icon: Award,      label: "Exams Taken",                    value: analyticsData.examsTaken || 0, sub: `${analyticsData.passRate || 0}% pass rate`, color: "bg-emerald-500" },
        { icon: Flame,      label: "Current Streak",                 value: `${analyticsData.streak || 1} day${analyticsData.streak > 1 ? 's' : ''}`, sub: "Verified IST daily check-in", color: "bg-orange-500" },
      ]
    : [
        { icon: Clock,      label: "Total Study Hours (This Week)", value: "0.0h", sub: "Goal: 20h/week", color: "bg-indigo-500" },
        { icon: TrendingUp, label: "Average Daily Hours",            value: "0.0h", sub: "Goal: 3.0h/day", color: "bg-purple-500" },
        { icon: Award,      label: "Exams Taken",                    value: "0", sub: "0% pass rate", color: "bg-emerald-500" },
        { icon: Flame,      label: "Current Streak",                 value: "1 day", sub: "Verified IST daily check-in", color: "bg-orange-500" },
      ];

  const groupLabel = userProfile?.ca_group || analyticsData?.group || "Both Groups";

  return (
    <AnimatePresence>
      <div className="min-h-screen bg-background text-white p-4 sm:p-6 md:p-10 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-indigo-500/20">
                <BarChart3 className="w-6 h-6 text-indigo-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Study Analytics
              </h1>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Track your performance and mastery across {groupLabel} subjects for CA {userProfile?.ca_stage ? userProfile.ca_stage.toUpperCase() : 'INTERMEDIATE'}.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold self-start sm:self-auto">
            Filtered: {groupLabel}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
            <p className="text-slate-400 text-sm">Loading your analytics...</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s) => (
                <StatCard key={s.label} {...s} />
              ))}
            </div>

            {/* Heatmap */}
            <motion.div
              variants={cardVariants}
              className="glass-panel border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <Flame className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-semibold text-white">Study Heatmap</h2>
                <span className="text-xs text-slate-500 ml-auto">Last 12 weeks</span>
              </div>
              <div className="overflow-x-auto pb-2">
                <Heatmap dailyData={analyticsData?.dailyActivity} />
              </div>
            </motion.div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Line Chart */}
              <motion.div
                variants={cardVariants}
                className="glass-panel border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-semibold text-white">Exam Accuracy Trend</h2>
                </div>
                {accuracyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={accuracyData} margin={{ top: 4, right: 16, left: -16, bottom: 4 }}>
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomLineTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="accuracy"
                        stroke="url(#lineGrad)"
                        strokeWidth={3}
                        dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#a855f7" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-60 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <TrendingUp className="w-8 h-8 text-slate-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-300">No Exam Accuracy Trend Yet</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs">
                        Complete chapter quizzes or full mock exams to record your score trend.
                      </p>
                    </div>
                    <Link
                      to="/exams"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
                    >
                      <Play className="w-3.5 h-3.5" /> Start First Mock
                    </Link>
                  </div>
                )}
              </motion.div>

              {/* Radar Chart */}
              <motion.div
                variants={cardVariants}
                className="glass-panel border border-white/10 rounded-2xl p-6"
              >
                <div className="flex items-center gap-2 mb-5">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Subject Mastery ({groupLabel})</h2>
                </div>
                {hasMasteryData ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={displayedMasteryData} margin={{ top: 4, right: 24, bottom: 4, left: 24 }}>
                      <PolarGrid stroke="#1e293b" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#475569", fontSize: 9 }} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#a855f7"
                        fill="#a855f7"
                        fillOpacity={0.25}
                        strokeWidth={2}
                      />
                      <Tooltip content={<CustomRadarTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-60 flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <Brain className="w-8 h-8 text-slate-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-300">Subject Mastery Not Evaluated</p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs">
                        Take tests in your {groupLabel} subjects to calculate your syllabus readiness breakdown.
                      </p>
                    </div>
                    <Link
                      to="/exams"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all"
                    >
                      <Play className="w-3.5 h-3.5" /> Practice Subjects
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Subject Breakdown */}
            <motion.div
              variants={cardVariants}
              className="glass-panel border border-white/10 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Subject Breakdown ({groupLabel})</h2>
              </div>
              <div className="space-y-3">
                {displayedMasteryData.map((s) => (
                  <div key={s.subject} className="flex items-center gap-3">
                    <span className="text-sm text-slate-300 w-48 shrink-0">{s.subject}</span>
                    <div className="flex-1 bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.score}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      />
                    </div>
                    <span className="text-sm font-semibold text-indigo-300 w-16 text-right">
                      {s.score > 0 ? `${s.score}%` : 'Not assessed'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
