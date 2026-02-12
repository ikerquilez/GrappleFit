import { useState, useMemo } from "react";
import { StyleSheet, FlatList, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { useTrainingStore } from "@/store/useTrainingStore";
import { useWeightStore } from "@/store/useWeightStore";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

type Phase = "Hypertrophy" | "Strength" | "Power" | "Taper";

interface Exercise {
  name: string;
  category: "Push" | "Pull" | "Legs" | "Neck" | "Grip" | "Core";
  baseSets: number;
  reps: string;
  isSupplemental?: boolean;
}

interface WorkoutDay {
  label: string;
  focus: "Upper" | "Lower" | "Full";
  exercises: Exercise[];
}

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

function getPhase(daysUntilComp: number | null): Phase {
  if (daysUntilComp === null || daysUntilComp > 56) return "Hypertrophy";
  if (daysUntilComp > 21) return "Strength";
  if (daysUntilComp > 7) return "Power";
  return "Taper";
}

export default function WorkoutScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;
  const { volumeModifier, todayLogged } = useTrainingStore();
  const { competitionDate } = useWeightStore();

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

  const adjustedExercises = useMemo(
    () =>
      workout.exercises.map((ex) => ({
        ...ex,
        adjustedSets: Math.max(1, Math.floor(ex.baseSets * volumeModifier)),
      })),
    [workout, volumeModifier]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={adjustedExercises}
        keyExtractor={(item) => item.name}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Workout</Text>
            <Text style={styles.phase}>
              {phase} Phase
              {daysUntilComp !== null && ` · ${daysUntilComp}d to comp`}
            </Text>

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
  title: { fontSize: 24, fontWeight: "bold" },
  phase: { fontSize: 14, color: "#999", marginBottom: 12 },
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
