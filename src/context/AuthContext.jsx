import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../supabaseClient.js';
import axios from '../api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    // 1. Initial check from persistent storage and Supabase session
    const initAuth = async () => {
      try {
        // Immediate local restore for one-time persistent login
        const savedUserStr = localStorage.getItem('tutovia_user') || sessionStorage.getItem('tutovia_user');
        let initialUser = null;
        if (savedUserStr) {
          try {
            initialUser = JSON.parse(savedUserStr);
            setUser(initialUser);
            loadUserProfile(initialUser.id);
          } catch (e) {
            console.warn('Failed to parse cached user:', e);
          }
        }

        // Check active Supabase session in the background
        try {
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session?.user) {
            const sbUser = sessionData.session.user;
            const currentUser = {
              id: sbUser.id,
              email: sbUser.email,
              name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'CA Aspirant',
              isSupabase: true
            };
            setUser(currentUser);
            localStorage.setItem('tutovia_user', JSON.stringify(currentUser));
            await loadUserProfile(currentUser.id);
          }
        } catch (sbErr) {
          console.warn('Supabase session fetch skipped, staying logged in via cached credentials:', sbErr);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 2. Supabase auth state change subscription
    const { data: authSub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const sbUser = session.user;
        const formattedUser = {
          id: sbUser.id,
          email: sbUser.email,
          name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'CA Aspirant',
          isSupabase: true
        };
        setUser(formattedUser);
        localStorage.setItem('tutovia_user', JSON.stringify(formattedUser));
        await loadUserProfile(sbUser.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('tutovia_user');
        sessionStorage.removeItem('tutovia_user');
      }
    });

    return () => {
      authSub?.subscription?.unsubscribe?.();
    };
  }, []);

  const loadUserProfile = async (userId) => {
    if (!userId) return;
    try {
      // 0. Immediate local cache check strictly for THIS user ID
      const cachedProfileStr = localStorage.getItem(`tutovia_profile_${userId}`) || localStorage.getItem('tutovia_profile');
      if (cachedProfileStr) {
        try {
          const cachedProfile = JSON.parse(cachedProfileStr);
          if (cachedProfile && cachedProfile.id === userId && (cachedProfile.ca_group || cachedProfile.ca_stage)) {
            setProfile(cachedProfile);
            setNeedsOnboarding(false);
            return;
          }
        } catch {}
      }

      if (localStorage.getItem(`tutovia_onboarded_${userId}`) === 'true') {
        setNeedsOnboarding(false);
        return;
      }

      // First attempt: read from Supabase public.profiles (with 2.5s timeout)
      const sbPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject('timeout'), 2500));

      const { data: sbProfile } = await Promise.race([sbPromise, timeoutPromise]).catch(() => ({ data: null }));

      if (sbProfile && (sbProfile.ca_group || sbProfile.ca_stage)) {
        setProfile(sbProfile);
        localStorage.setItem(`tutovia_profile_${userId}`, JSON.stringify(sbProfile));
        localStorage.setItem(`tutovia_onboarded_${userId}`, 'true');
        setNeedsOnboarding(false);
        return;
      }

      // Second attempt: check backend API
      const res = await Promise.race([
        axios.get(`/api/profile?userId=${userId}`),
        new Promise((_, reject) => setTimeout(() => reject('timeout'), 2500))
      ]).catch(() => null);

      if (res?.data && (res.data.ca_group || res.data.ca_stage) && res.data.is_onboarded) {
        setProfile(res.data);
        localStorage.setItem(`tutovia_profile_${userId}`, JSON.stringify(res.data));
        localStorage.setItem(`tutovia_onboarded_${userId}`, 'true');
        setNeedsOnboarding(false);
      } else {
        // Brand new user: trigger onboarding modal so they configure their own stage, group, and attempt
        setNeedsOnboarding(true);
      }
    } catch {
      setNeedsOnboarding(false);
    }
  };

  const login = (userData, rememberMe = true) => {
    setUser(userData);
    localStorage.setItem('tutovia_user', JSON.stringify(userData));
    loadUserProfile(userData.id);
  };

  const loginWithSupabase = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUpWithSupabase = async (name, email, password) => {
    // Clear any previous user state from storage
    localStorage.removeItem('tutovia_user');
    localStorage.removeItem('tutovia_profile');
    localStorage.removeItem('tutovia_onboarded');
    sessionStorage.removeItem('tutovia_user');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    });
    if (error) throw error;
    return data;
  };

  const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    return data;
  };

  const completeOnboarding = async (onboardingData) => {
    const currentUid = user?.id || 'student_' + Date.now();
    const updated = {
      id: currentUid,
      email: user?.email || 'student@tutovia.com',
      name: user?.name || 'CA Aspirant',
      ca_stage: 'intermediate',
      ca_group: 'Both Groups',
      is_onboarded: true,
      ...onboardingData,
      updated_at: new Date().toISOString()
    };

    // 1. INSTANT LOCAL PERSISTENCE — Immediately closes modal and unblocks UI
    setProfile(updated);
    setNeedsOnboarding(false);
    localStorage.setItem(`tutovia_profile_${currentUid}`, JSON.stringify(updated));
    localStorage.setItem(`tutovia_onboarded_${currentUid}`, 'true');
    localStorage.setItem('tutovia_profile', JSON.stringify(updated));
    localStorage.setItem('tutovia_onboarded', 'true');

    // 2. Background sync to Supabase (with 2s timeout)
    Promise.race([
      supabase.from('profiles').upsert(updated),
      new Promise((_, reject) => setTimeout(() => reject('timeout'), 2000))
    ]).catch(() => {});

    // 3. Background sync to VM backend
    axios.post('/api/profile', { userId: updated.id, ...updated }).catch(() => {});
  };

  const logout = async () => {
    const currentUid = user?.id;
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    setProfile(null);
    setNeedsOnboarding(false);
    localStorage.removeItem('tutovia_user');
    localStorage.removeItem('tutovia_profile');
    localStorage.removeItem('tutovia_onboarded');
    if (currentUid) {
      localStorage.removeItem(`tutovia_profile_${currentUid}`);
      localStorage.removeItem(`tutovia_onboarded_${currentUid}`);
    }
    sessionStorage.removeItem('tutovia_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading,
      needsOnboarding, 
      login, 
      loginWithSupabase,
      signUpWithSupabase,
      resetPassword,
      completeOnboarding,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
