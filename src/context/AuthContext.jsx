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
    try {
      // First attempt: read from Supabase public.profiles
      const { data: sbProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (sbProfile && (sbProfile.ca_group || sbProfile.ca_stage)) {
        setProfile(sbProfile);
        setNeedsOnboarding(false);
        return;
      }

      // Second attempt: check backend API
      const res = await axios.get(`/api/profile?userId=${userId}`).catch(() => null);
      if (res?.data && (res.data.ca_group || res.data.ca_stage)) {
        setProfile(res.data);
        setNeedsOnboarding(false);
      } else {
        // User exists but has not completed stream/target setup
        setNeedsOnboarding(true);
      }
    } catch {
      // Default fallback
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
    if (!user) return;
    const updated = {
      id: user.id,
      email: user.email,
      name: user.name,
      ...onboardingData,
      updated_at: new Date().toISOString()
    };

    // Save to Supabase profiles
    await supabase.from('profiles').upsert(updated).catch(() => null);

    // Also sync to local backend API
    await axios.post('/api/profile', { userId: user.id, profile: updated }).catch(() => null);

    setProfile(updated);
    setNeedsOnboarding(false);
  };

  const logout = async () => {
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    setProfile(null);
    setNeedsOnboarding(false);
    localStorage.removeItem('tutovia_user');
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
