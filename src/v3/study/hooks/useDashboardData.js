import { useEffect, useRef, useState, useCallback } from 'react';
import api from '../../../api.js';
const cache = new Map();
export function useDashboardData(userId) {
  const [state, setState] = useState({
    userId,
    data: cache.get(userId)?.data || null,
    loading: true,
    refreshing: false,
    errors: []
  });
  const epoch = useRef(0);
  const owner = useRef(userId);
  owner.current = userId;
  const refresh = useCallback(async (force = true) => {
    const run = ++epoch.current;
    const saved = cache.get(userId);
    if (!force && saved && Date.now() - saved.at < 60000) {
      setState({
        userId,
        data: saved.data,
        loading: false,
        refreshing: false,
        errors: []
      });
      return;
    }
    setState(previous => ({
      userId,
      data: previous.userId === userId ? previous.data : saved?.data || null,
      loading: !saved && !previous.data,
      refreshing: true,
      errors: []
    }));
    const errors = [];
    let data = {
      ...(saved?.data || {})
    };
    try {
      const bundle = await api.get('/api/dashboard/bundle', {
        params: {
          userId
        }
      });
      if (!bundle.data || !Array.isArray(bundle.data.schedule)) throw new Error('Invalid dashboard response');
      data = {
        ...data,
        ...bundle.data,
        analytics: data.analytics || bundle.data.analytics
      };
    } catch {
      const names = ['profile', 'progress', 'schedule', 'mood', 'subjects'];
      const results = await Promise.allSettled(names.map(name => api.get(`/api/${name}`, {
        params: {
          userId
        }
      })));
      results.forEach((result, index) => {
        const name = names[index] === 'mood' ? 'moods' : names[index];
        if (result.status === 'fulfilled') data[name] = result.value.data;else errors.push(name);
      });
    }
    // The full analytics route contains diagnosed weak topics; the bundle omits them.
    const extra = await Promise.allSettled([api.get('/api/analytics', {
      params: {
        userId
      }
    }), api.get('/api/flashcards', {
      params: {
        userId
      }
    })]);
    extra.forEach((result, index) => {
      const name = index ? 'flashcards' : 'analytics';
      if (result.status === 'fulfilled') data[name] = result.value.data;else errors.push(name);
    });
    if (owner.current !== userId || run !== epoch.current) return;
    cache.set(userId, {
      data,
      at: Date.now()
    });
    setState({
      userId,
      data,
      loading: false,
      refreshing: false,
      errors
    });
  }, [userId]);
  useEffect(() => {
    setState({
      userId,
      data: cache.get(userId)?.data || null,
      loading: !cache.has(userId),
      refreshing: false,
      errors: []
    });
    refresh(false);
    return () => {
      epoch.current++;
      cache.delete(userId);
    };
  }, [userId, refresh]);
  const update = useCallback(patch => {
    // A save wins over any earlier in-flight dashboard snapshot.
    epoch.current++;
    setState(previous => {
      if (previous.userId !== userId) return previous;
      const data = {
        ...previous.data,
        ...patch
      };
      cache.set(userId, {
        data,
        at: Date.now()
      });
      return {
        ...previous,
        data,
        loading: false,
        refreshing: false
      };
    });
  }, [userId]);
  return state.userId === userId ? {
    ...state,
    refresh,
    update
  } : {
    data: null,
    loading: true,
    refreshing: false,
    errors: [],
    refresh,
    update
  };
}
