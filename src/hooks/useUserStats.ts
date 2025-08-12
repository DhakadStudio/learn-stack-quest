import { useState, useEffect, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';

interface UserStats {
  totalQuestionsAttempted: number;
  totalQuestionsCompleted: number;
  totalTimeSpent: number; // in seconds
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  questionsToday: number;
}

const DEFAULT_STATS: UserStats = {
  totalQuestionsAttempted: 0,
  totalQuestionsCompleted: 0,
  totalTimeSpent: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: '',
  questionsToday: 0
};

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const { value } = await Preferences.get({ key: 'userStats' });
      if (value) {
        const savedStats = JSON.parse(value);
        setStats(savedStats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveStats = useCallback(async (newStats: UserStats) => {
    try {
      await Preferences.set({ key: 'userStats', value: JSON.stringify(newStats) });
      setStats(newStats);
    } catch (error) {
      console.error('Error saving user stats:', error);
    }
  }, []);

  const updateStats = useCallback(async (updates: Partial<UserStats>) => {
    const updatedStats = { ...stats, ...updates };
    await saveStats(updatedStats);
  }, [stats, saveStats]);

  const recordQuestionCompleted = useCallback(async (timeSpent: number) => {
    const today = new Date().toISOString().split('T')[0];
    const lastActivity = stats.lastActivityDate;
    
    // Calculate streak
    let newStreak = stats.currentStreak;
    if (lastActivity !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (lastActivity === yesterdayStr) {
        // Consecutive day
        newStreak = stats.currentStreak + 1;
      } else if (lastActivity !== today) {
        // Gap in activity, reset streak
        newStreak = 1;
      }
    }

    const questionsToday = lastActivity === today ? stats.questionsToday + 1 : 1;

    await updateStats({
      totalQuestionsAttempted: stats.totalQuestionsAttempted + 1,
      totalQuestionsCompleted: stats.totalQuestionsCompleted + 1,
      totalTimeSpent: stats.totalTimeSpent + timeSpent,
      currentStreak: newStreak,
      longestStreak: Math.max(stats.longestStreak, newStreak),
      lastActivityDate: today,
      questionsToday
    });
  }, [stats, updateStats]);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    recordQuestionCompleted,
    updateStats,
    formatTime
  };
};