import axios from 'axios';
import { supabase } from './supabaseClient.js';

// Route to VM server only when in mobile app (Capacitor)
const isCapacitor = typeof window !== 'undefined' && (
  window.Capacitor !== undefined || 
  window.location.protocol === 'capacitor:'
);

const API_BASE = import.meta.env.VITE_API_URL || (isCapacitor ? 'http://161.118.173.142' : '');

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000 // 30-second timeout allows Groq AI generation without premature abort
});

api.interceptors.request.use(async (config) => {
  // 1. Non-blocking Supabase token check with fast 200ms timeout race
  try {
    const sessionPromise = supabase.auth.getSession();
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('timeout'), 200));
    const { data } = await Promise.race([sessionPromise, timeoutPromise]);
    if (data?.session?.access_token) {
      config.headers.Authorization = `Bearer ${data.session.access_token}`;
    }
  } catch {
    // Supabase offline, paused, or timed out - proceed without blocking request
  }

  // 2. Attach user ID header for resilient server-side fallback
  try {
    const cachedUser = localStorage.getItem('tutovia_user');
    if (cachedUser) {
      const u = JSON.parse(cachedUser);
      if (u?.id) {
        config.headers['x-user-id'] = u.id;
      }
    }
  } catch {}

  return config;
});

export default api;
