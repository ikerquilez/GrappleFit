import { create } from "zustand";
import { supabase } from "@/services/supabase";

export type BjjIntensity = "Flow" | "Standard" | "Hard" | null;

export interface DailyLog {
  id?: string;
  date: string;
  bjjTrained: boolean;
  bjjIntensity: BjjIntensity;
  volumeModifier: number;
  injuries: string[];
  weightLog?: number;
}

interface TrainingState {
  dailyReadiness: DailyLog | null;
  volumeModifier: number;
  todayLogged: boolean;
  loading: boolean;

  calculateModifier: (intensity: BjjIntensity) => number;
  logDay: (log: Omit<DailyLog, "volumeModifier">) => void;
  checkTodayLog: () => Promise<void>;
  reset: () => void;
}

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export const useTrainingStore = create<TrainingState>((set, get) => ({
  dailyReadiness: null,
  volumeModifier: 1.0,
  todayLogged: false,
  loading: false,

  calculateModifier: (intensity: BjjIntensity): number => {
    switch (intensity) {
      case "Hard":
        return 0.5;
      case "Standard":
        return 0.75;
      case "Flow":
      default:
        return 1.0;
    }
  },

  logDay: (log) => {
    const modifier = get().calculateModifier(log.bjjIntensity);
    const fullLog: DailyLog = { ...log, volumeModifier: modifier };

    set({ dailyReadiness: fullLog, volumeModifier: modifier, todayLogged: true });

    supabase
      .from("daily_logs")
      .upsert(
        {
          date: fullLog.date,
          bjj_intensity: fullLog.bjjIntensity,
          volume_modifier: fullLog.volumeModifier,
          weight_log: fullLog.weightLog ?? null,
          injuries: fullLog.injuries,
        },
        { onConflict: "date" }
      )
      .then(({ error }) => {
        if (error) console.warn("Failed to sync daily log:", error.message);
      });
  },

  checkTodayLog: async () => {
    set({ loading: true });
    const today = formatDate(new Date());

    const { data, error } = await supabase
      .from("daily_logs")
      .select("*")
      .eq("date", today)
      .maybeSingle();

    if (data && !error) {
      set({
        dailyReadiness: {
          id: data.id,
          date: data.date,
          bjjTrained: !!data.bjj_intensity,
          bjjIntensity: data.bjj_intensity,
          volumeModifier: data.volume_modifier,
          injuries: data.injuries ?? [],
          weightLog: data.weight_log,
        },
        volumeModifier: data.volume_modifier ?? 1.0,
        todayLogged: true,
        loading: false,
      });
    } else {
      set({ todayLogged: false, loading: false });
    }
  },

  reset: () =>
    set({ dailyReadiness: null, volumeModifier: 1.0, todayLogged: false }),
}));
