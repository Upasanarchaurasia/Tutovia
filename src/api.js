import axios from 'axios';
import { supabase } from './supabaseClient.js';

// Route to VM server when in mobile app or when configured
const isMobileOrLocal = typeof window !== 'undefined' && (
  window.Capacitor !== undefined || 
  window.location.protocol === 'capacitor:' || 
  window.location.hostname === 'localhost' ||
  !window.location.origin.includes('161.118.173.142')
);

const API_BASE = import.meta.env.VITE_API_URL || (isMobileOrLocal ? 'http://161.118.173.142' : '');

const api = axios.create({
  baseURL: API_BASE
});

api.interceptors.request.use(async (config) => {
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.access_token) {
      config.headers.Authorization = `Bearer ${data.session.access_token}`;
    }
  } catch {
    // Supabase offline or unreachable, continue
  }
  return config;
});

export default api;
