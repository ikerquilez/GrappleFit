import { useState, useMemo, useCallback, useEffect } from "react";
import { StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { Text, View } from "@/components/Themed";
import { useTrainingStore } from "@/store/useTrainingStore";
import { useWeightStore } from "@/store/useWeightStore";
import { supabase } from "@/services/supabase";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Phase = "Hypertrophy" | "Strength" | "Power" | "Taper";
type Category = "Push" | "Pull" | "Legs" | "Neck" | "Grip" | "Core";

interface Exercise {
  name: string;
  category: Category;
  baseSets: number;
  reps: string;
  isSupplemental?: boolean;
}

interface WorkoutDay {
  label: string;
  focus: "Upper" | "Lower" | "Full";
  exercises: Exercise[];
}

interface DbExercise {
  name: string;
  category: string;
  is_supplemental: boolean;
}

const CATEGORY_MAP: Record<string, Category> = {
  Push: "Push",
  Pull: "Pull",
  Legs: "Legs",
  Neck: "Neck",
  Grip: "Grip",
};

const PHASE_WORKOUTS: Record<Phase, WorkoutDay[]> = {
  Hypertrophy: [
    {
      label: "Day A — Upper",
      focus: "Upper",
      exercises: [
        { name: "Bench Press", category: "Push", baseSets: 4, reps: "8-10" },
        { name: "Barbell Row", category: "Pull", baseSets: 4, reps: "8-10" },
        { name: "Overhead Press", category: "Push", baseSets: 3, reps: "10-12" },
        { name: "Gi Pull-Ups", category: "Grip", baseSets: 3, reps: "Max", isSupplemental: true },
        { name: "Neck Rotations", category: "Neck", baseSets: 3, reps: "20/side", isSupplemental: true },
      ],
    },
    {
      label: "Day B — Lower",
      focus: "Lower",
      exercises: [
        { name: "Trap Bar Deadlift", category: "Legs", baseSets: 4, reps: "8-10" },
        { name: "Zercher Squat", category: "Legs", baseSets: 4, reps: "8-10" },
        { name: "KB Swing", category: "Legs", baseSets: 3, reps: "15" },
        { name: "Pallof Press", category: "Core", baseSets: 3, reps: "10/side", isSupplemental: true },
        { name: "Plate Pinch Hold", category: "Grip", baseSets: 3, reps: "30-45s", isSupplemental: true },
      ],
    },
    {
      label: "Day C — Full Body",
      focus: "Full",
      exercises: [
        { name: "Trap Bar Deadlift", category: "Legs", baseSets: 3, reps: "8-10" },
        { name: "Bench Press", category: "Push", baseSets: 3, reps: "8-10" },
        { name: "Barbell Row", category: "Pull", baseSets: 3, reps: "8-10" },
        { name: "KB Swing", category: "Legs", baseSets: 3, reps: "15" },
        { name: "Gi Pull-Ups", category: "Grip", baseSets: 3, reps: "Max", isSupplemental: true },
        { name: "Pallof Press", category: "Core", baseSets: 3, reps: "10/side", isSupplemental: true },
        { name: "Neck Rotations", category: "Neck", baseSets: 3, reps: "20/side", isSupplemental: true },
      ],
    },
  ],
  Strength: [
    {
      label: "Day A — Upper",
      focus: "Upper",
      exercises: [
        { name: "Bench Press", category: "Push", baseSets: 5, reps: "3-5" },
        { name: "Weighted Pull-Up", category: "Pull", baseSets: 5, reps: "3-5" },
        { name: "Gi Pull-Ups", category: "Grip", baseSets: 3, reps: "Max", isSupplemental: true },
        { name: "Supine Neck Flexion", category: "Neck", baseSets: 3, reps: "15-25", isSupplemental: true },
      ],
    },
    {
      label: "Day B — Lower",
      focus: "Lower",
      exercises: [
        { name: "Trap Bar Deadlift", category: "Legs", baseSets: 5, reps: "3-5" },
        { name: "Zercher Squat", category: "Legs", baseSets: 4, reps: "5" },
        { name: "Sandbag Get-Up", category: "Core", baseSets: 1, reps: "5/side", isSupplemental: true },
        { name: "Plate Pinch Hold", category: "Grip", baseSets: 3, reps: "30-45s", isSupplemental: true },
      ],
    },
    {
      label: "Day C — Full Body",
      focus: "Full",
      exercises: [
        { name: "Trap Bar Deadlift", category: "Legs", baseSets: 4, reps: "3-5" },
        { name: "Bench Press", category: "Push", baseSets: 4, reps: "3-5" },
        { name: "Weighted Pull-Up", category: "Pull", baseSets: 4, reps: "3-5" },
        { name: "Gi Pull-Ups", category: "Grip", baseSets: 3, reps: "Max", isSupplemental: true },
        { name: "Supine Neck Flexion", category: "Neck", baseSets: 3, reps: "15-25", isSupplemental: true },
        { name: "Plate Pinch Hold", category: "Grip", baseSets: 3, reps: "30-45s", isSupplemental: true },
      ],
    },
  ],
  Power: [
    {
      label: "Day A — Explosive",
      focus: "Full",
      exercises: [
        { name: "Speed Squat", category: "Legs", baseSets: 6, reps: "2" },
        { name: "Plyo Push-Up", category: "Push", baseSets: 4, reps: "5" },
        { name: "Box Jump", category: "Legs", baseSets: 4, reps: "3" },
        { name: "Neck Rotations", category: "Neck", baseSets: 2, reps: "15/side", isSupplemental: true },
      ],
    },
    {
      label: "Day B — Full Body Power",
      focus: "Full",
      exercises: [
        { name: "Trap Bar Deadlift", category: "Legs", baseSets: 4, reps: "2" },
        { name: "Speed Squat", category: "Legs", baseSets: 4, reps: "2" },
        { name: "Plyo Push-Up", category: "Push", baseSets: 3, reps: "5" },
        { name: "Box Jump", category: "Legs", baseSets: 3, reps: "3" },
        { name: "KB Swing", category: "Legs", baseSets: 3, reps: "10" },
        { name: "Neck Rotations", category: "Neck", baseSets: 2, reps: "15/side", isSupplemental: true },
      ],
    },
  ],
  Taper: [
    {
      label: "Primer — Full Body",
      focus: "Full",
      exercises: [
        { name: "Trap Bar Deadlift", category: "Legs", baseSets: 2, reps: "2" },
        { name: "Bench Press", category: "Push", baseSets: 2, reps: "2" },
        { name: "Pull-Up", category: "Pull", baseSets: 2, reps: "3" },
      ],
    },
  ],
};

const PHASE_REPS: Record<Phase, string> = {
  Hypertrophy: "8-10",
  Strength: "3-5",
  Power: "2-3",
  Taper: "2-3",
};

function pickRandom<T>(arr: T[], exclude?: string): T {
  const filtered = exclude
    ? arr.filter((item) => (item as any).name !== exclude)
    : arr;
  return filtered[Math.floor(Math.random() * filtered.length)] ?? arr[0];
}

function getPhase(daysUntilComp: number | null): Phase {
  if (daysUntilComp === null || daysUntilComp > 56) return "Hypertrophy";
  if (daysUntilComp > 21) return "Strength";
  if (daysUntilComp > 7) return "Power";
  return "Taper";
}

export default function WorkoutScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;
  const { volumeModifier } = useTrainingStore();
  const { competitionDate } = useWeightStore();

  const [dbExercises, setDbExercises] = useState<DbExercise[]>([]);
  const [shuffledExercises, setShuffledExercises] = useState<Exercise[] | null>(null);
  const [shuffling, setShuffling] = useState(false);

  const daysUntilComp = competitionDate
    ? Math.ceil(
        (new Date(competitionDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const phase = getPhase(daysUntilComp);
  const days = PHASE_WORKOUTS[phase];
  const [selectedDay, setSelectedDay] = useState(0);
  const workout = days[selectedDay] ?? days[0];

  useEffect(() => {
    supabase
      .from("exercises")
      .select("name, category, is_supplemental")
      .then(({ data }) => {
        if (data) setDbExercises(data);
      });
  }, []);

  useEffect(() => {
    setShuffledExercises(null);
  }, [selectedDay, phase]);

  const handleShuffle = useCallback(() => {
    if (dbExercises.length === 0) return;
    setShuffling(true);

    const byCategory: Record<string, DbExercise[]> = {};
    for (const ex of dbExercises) {
      const cat = ex.category;
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(ex);
    }

    const newExercises = workout.exercises.map((original) => {
      const catKey = original.category === "Core" ? "Push" : original.category;
      const pool = byCategory[catKey];
      if (!pool || pool.length <= 1) return original;

      const picked = pickRandom(pool, original.name);
      const mappedCategory = CATEGORY_MAP[picked.category] ?? original.category;

      return {
        ...original,
        name: picked.name,
        category: mappedCategory,
        isSupplemental: picked.is_supplemental || original.isSupplemental,
      };
    });

    setShuffledExercises(newExercises);
    setTimeout(() => setShuffling(false), 200);
  }, [dbExercises, workout]);

  const activeExercises = shuffledExercises ?? workout.exercises;

  const adjustedExercises = useMemo(
    () =>
      activeExercises.map((ex) => ({
        ...ex,
        adjustedSets: Math.max(1, Math.floor(ex.baseSets * volumeModifier)),
      })),
    [activeExercises, volumeModifier]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={adjustedExercises}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        ListHeaderComponent={
          <View>
            <View style={styles.titleRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>Workout</Text>
                <Text style={styles.phase}>
                  {phase} Phase
                  {daysUntilComp !== null && ` · ${daysUntilComp}d to comp`}
                </Text>
              </View>
              <Pressable
                style={[styles.shuffleButton, { borderColor: tint }]}
                onPress={handleShuffle}
                disabled={shuffling || dbExercises.length === 0}
              >
                {shuffling ? (
                  <ActivityIndicator size="small" color={tint} />
                ) : (
                  <>
                    <FontAwesome name="random" size={14} color={tint} />
                    <Text style={[styles.shuffleText, { color: tint }]}>Shuffle</Text>
                  </>
                )}
              </Pressable>
            </View>

            {shuffledExercises && (
              <Pressable
                style={styles.resetLink}
                onPress={() => setShuffledExercises(null)}
              >
                <Text style={{ color: tint, fontSize: 13 }}>Reset to default</Text>
              </Pressable>
            )}

            {volumeModifier < 1 && (
              <View style={[styles.volumeBanner, { backgroundColor: `${tint}20` }]}>
                <Text style={{ color: tint, fontWeight: "600" }}>
                  Volume reduced to {Math.round(volumeModifier * 100)}% — BJJ recovery
                </Text>
              </View>
            )}

            {days.length > 1 && (
              <View style={styles.dayPicker}>
                {days.map((d, i) => (
                  <Pressable
                    key={d.label}
                    style={[
                      styles.dayTab,
                      selectedDay === i && { backgroundColor: tint },
                    ]}
                    onPress={() => setSelectedDay(i)}
                  >
                    <Text
                      style={[
                        styles.dayTabText,
                        selectedDay === i && { color: "#fff" },
                      ]}
                    >
                      {d.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}

            <View style={styles.separator} />
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.exerciseRow,
              item.isSupplemental && styles.supplementalRow,
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.exerciseName}>{item.name}</Text>
              {item.isSupplemental && (
                <Text style={styles.supplementalTag}>Armor Building</Text>
              )}
            </View>
            <Text
              style={[
                styles.exerciseSets,
                item.adjustedSets < item.baseSets && { color: "#e67e22" },
              ]}
            >
              {item.adjustedSets} × {item.reps}
            </Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 32 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
  title: { fontSize: 24, fontWeight: "bold" },
  phase: { fontSize: 14, color: "#999", marginBottom: 12 },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  shuffleText: { fontSize: 14, fontWeight: "600" },
  resetLink: { marginBottom: 12 },
  volumeBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  dayPicker: { flexDirection: "row", gap: 8, marginBottom: 12 },
  dayTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  dayTabText: { fontSize: 13, fontWeight: "600" },
  separator: {
    height: 1,
    backgroundColor: "rgba(150,150,150,0.3)",
    marginBottom: 12,
  },
  exerciseRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.15)",
  },
  supplementalRow: {
    opacity: 0.7,
  },
  exerciseName: { fontSize: 16, fontWeight: "600" },
  supplementalTag: { fontSize: 11, color: "#e67e22", marginTop: 2 },
  exerciseSets: { fontSize: 15, fontWeight: "600" },
});
