import { create } from "zustand";
import { supabase } from "@/services/supabase";

export interface WeightEntry {
  date: string;
  weight: number;
}

interface WeightState {
  entries: WeightEntry[];
  competitionDate: string | null;
  targetWeight: number | null;
  waterCutManualOverride: boolean | null;
  loading: boolean;
  addEntry: (entry: WeightEntry) => void;
  removeEntry: (date: string) => void;
  setCompetitionDate: (date: string | null) => void;
  setTargetWeight: (weight: number | null) => void;
  setWaterCutManualOverride: (value: boolean | null) => void;
  getLinearRegression: () => { slope: number; intercept: number } | null;
  getExpectedWeight: (date: string) => number | null;
  isWaterCutActive: () => boolean;
  fetchEntries: () => Promise<void>;
  fetchCompetition: () => Promise<void>;
}

function dateToDay(dateStr: string): number {
  return Math.floor(new Date(dateStr).getTime() / (1000 * 60 * 60 * 24));
}

function linearRegression(entries: WeightEntry[]): { slope: number; intercept: number } | null {
  if (entries.length < 2) return null;

  const n = entries.length;
  const xs = entries.map((e) => dateToDay(e.date));
  const ys = entries.map((e) => e.weight);

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((acc, x, i) => acc + x * ys[i], 0);
  const sumX2 = xs.reduce((acc, x) => acc + x * x, 0);

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

export const useWeightStore = create<WeightState>((set, get) => ({
  entries: [],
  competitionDate: null,
  targetWeight: null,
  waterCutManualOverride: null,
  loading: false,

  addEntry: (entry) => {
    set((state) => {
      const filtered = state.entries.filter((e) => e.date !== entry.date);
      return { entries: [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date)) };
    });
    supabase
      .from("weight_entries")
      .upsert({ date: entry.date, weight: entry.weight }, { onConflict: "date" })
      .then(({ error }) => {
        if (error) console.warn("Failed to sync weight entry:", error.message);
      });
  },

  removeEntry: (date) => {
    set((state) => ({ entries: state.entries.filter((e) => e.date !== date) }));
    supabase
      .from("weight_entries")
      .delete()
      .eq("date", date)
      .then(({ error }) => {
        if (error) console.warn("Failed to delete weight entry:", error.message);
      });
  },

  setCompetitionDate: (date) => set({ competitionDate: date }),
  setTargetWeight: (weight) => set({ targetWeight: weight }),
  setWaterCutManualOverride: (value) => set({ waterCutManualOverride: value }),

  getLinearRegression: () => linearRegression(get().entries),

  getExpectedWeight: (date: string) => {
    const reg = linearRegression(get().entries);
    if (!reg) return null;
    return reg.slope * dateToDay(date) + reg.intercept;
  },

  isWaterCutActive: () => {
    const { competitionDate, waterCutManualOverride } = get();
    if (waterCutManualOverride !== null) return waterCutManualOverride;
    if (!competitionDate) return false;
    const now = new Date();
    const comp = new Date(competitionDate);
    const diffDays = (comp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  },

  fetchEntries: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("weight_entries")
      .select("date, weight")
      .order("date", { ascending: true });

    if (data && !error) {
      set({ entries: data, loading: false });
    } else {
      set({ loading: false });
    }
  },

  fetchCompetition: async () => {
    const { data } = await supabase
      .from("competitions")
      .select("date, target_weight_class")
      .gte("date", new Date().toISOString().split("T")[0])
      .order("date", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (data) {
      set({
        competitionDate: data.date,
        targetWeight: data.target_weight_class,
      });
    }
  },
}));
