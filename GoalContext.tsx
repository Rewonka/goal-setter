import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import React, { createContext, useContext, useState } from 'react';

export interface Goal {
    id: string;
    title: string;
    doneToday: boolean;
    lastChecked: string;       // "2025‑04‑20" etc.
    streak: number;            // number of day
  }

type GoalContextType = {
  goals: Goal[];
  addGoal: (title: string) => void;
  toggleDone: (id: string) => void;
};

const GoalContext = createContext<GoalContextType | null>(null);
const todayISO = () => new Date().toISOString().slice(0, 10); // "YYYY‑MM‑DD"
const STORAGE_KEY = 'goals-v1';

export function GoalProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[] | null>(null);  // null = still loading
  /* ---------- LOAD on mount ---------- */
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const stored: Goal[] = raw ? JSON.parse(raw) : [];
      const today = todayISO();

      // reset doneToday if lastChecked !== today
      const reset = stored.map(g => ({
        ...g,
        doneToday: g.lastChecked === today ? g.doneToday : false,
      }));

      setGoals(reset);
    })();
  }, []);

  /* ---------- SAVE whenever goals change ---------- */
  useEffect(() => {
    if (goals) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  /* ---------- API ---------- */
  const addGoal = (title: string) => {
    setGoals(prev => {
      const now = todayISO();
      const list = prev ?? [];
      return [
        ...list,
        {
          id: Date.now().toString(),
          title,
          doneToday: false,
          lastChecked: now,
          streak: 0,
        } satisfies Goal,
      ];
    });
  };

  const toggleDone = (id: string) => {
    setGoals(prev =>
      prev!.map(g => {
        if (g.id !== id) return g;
  
        const today = todayISO();
        
        
        // If already doneToday, un‑tick and leave streak unchanged
        if (g.doneToday) return { ...g, doneToday: false };
        
        /* --- marking done for the first time today --- */
        const d = new Date(today);
        d.setDate(d.getDate() - 1);
        const yesterdayISO = d.toISOString().slice(0, 10);
  
        const nextStreak = g.lastChecked === yesterdayISO ? g.streak + 1 : 1;
  
        return {
          ...g,
          doneToday: true,
          lastChecked: today,
          streak: nextStreak,
        };
      })
    );
  };

  /* ---------- Render ---------- */
  if (!goals) return null;           // can replace with a splash later


  return (
    <GoalContext.Provider value={{ goals, addGoal, toggleDone }}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoals() {
  const ctx = useContext(GoalContext);
  if (!ctx) throw new Error('useGoals must be inside GoalProvider');
  return ctx;
}
