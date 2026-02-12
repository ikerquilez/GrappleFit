import { useState } from "react";
import {
  Modal,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useTrainingStore, BjjIntensity } from "@/store/useTrainingStore";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

const INTENSITY_OPTIONS: { label: string; value: BjjIntensity; description: string }[] = [
  { label: "Flow / Drill", value: "Flow", description: "RPE 1-4 · Light technical work" },
  { label: "Standard Class", value: "Standard", description: "RPE 5-7 · Moderate sparring" },
  { label: "Comp / Shark Tank", value: "Hard", description: "RPE 8-10 · Competition intensity" },
];

const INJURY_OPTIONS = ["Neck", "Knee", "Lower Back", "Elbow", "Shoulder", "Wrist"];

interface Props {
  visible: boolean;
  onDismiss: () => void;
}

export default function DailyCheckInModal({ visible, onDismiss }: Props) {
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;
  const logDay = useTrainingStore((s) => s.logDay);
  const calculateModifier = useTrainingStore((s) => s.calculateModifier);

  const [bjjTrained, setBjjTrained] = useState<boolean | null>(null);
  const [intensity, setIntensity] = useState<BjjIntensity>(null);
  const [selectedInjuries, setSelectedInjuries] = useState<string[]>([]);

  const modifier = calculateModifier(intensity);
  const today = new Date().toISOString().split("T")[0];

  const toggleInjury = (injury: string) => {
    setSelectedInjuries((prev) =>
      prev.includes(injury) ? prev.filter((i) => i !== injury) : [...prev, injury]
    );
  };

  const handleSave = () => {
    logDay({
      date: today,
      bjjTrained: bjjTrained ?? false,
      bjjIntensity: bjjTrained ? intensity : null,
      injuries: selectedInjuries,
    });
    setBjjTrained(null);
    setIntensity(null);
    setSelectedInjuries([]);
    onDismiss();
  };

  const canSave = bjjTrained === false || (bjjTrained === true && intensity !== null);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Daily Check-In</Text>
        <Text style={styles.subtitle}>{today}</Text>

        <View style={styles.section}>
          <Text style={styles.question}>Did you train Jiu-Jitsu today?</Text>
          <View style={styles.row}>
            <Pressable
              style={[
                styles.choiceButton,
                bjjTrained === true && { backgroundColor: tint },
              ]}
              onPress={() => setBjjTrained(true)}
            >
              <Text style={[styles.choiceText, bjjTrained === true && styles.choiceTextActive]}>
                Yes
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.choiceButton,
                bjjTrained === false && { backgroundColor: tint },
              ]}
              onPress={() => {
                setBjjTrained(false);
                setIntensity(null);
              }}
            >
              <Text style={[styles.choiceText, bjjTrained === false && styles.choiceTextActive]}>
                No
              </Text>
            </Pressable>
          </View>
        </View>

        {bjjTrained && (
          <View style={styles.section}>
            <Text style={styles.question}>Rate the intensity</Text>
            {INTENSITY_OPTIONS.map((opt) => (
              <Pressable
                key={opt.value}
                style={[
                  styles.intensityOption,
                  intensity === opt.value && { borderColor: tint, backgroundColor: `${tint}15` },
                ]}
                onPress={() => setIntensity(opt.value)}
              >
                <Text style={[styles.intensityLabel, intensity === opt.value && { color: tint }]}>
                  {opt.label}
                </Text>
                <Text style={styles.intensityDesc}>{opt.description}</Text>
              </Pressable>
            ))}
            {intensity && (
              <View style={[styles.modifierBadge, { backgroundColor: `${tint}20` }]}>
                <Text style={{ color: tint, fontWeight: "600" }}>
                  Volume Modifier: {modifier}x
                  {modifier < 1 && ` — Sets reduced by ${Math.round((1 - modifier) * 100)}%`}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.question}>Any new aches / injuries?</Text>
          <View style={styles.injuryGrid}>
            {INJURY_OPTIONS.map((inj) => (
              <Pressable
                key={inj}
                style={[
                  styles.injuryChip,
                  selectedInjuries.includes(inj) && { backgroundColor: "#e74c3c" },
                ]}
                onPress={() => toggleInjury(inj)}
              >
                <Text
                  style={[
                    styles.injuryChipText,
                    selectedInjuries.includes(inj) && { color: "#fff" },
                  ]}
                >
                  {inj}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={[styles.saveButton, { backgroundColor: canSave ? tint : "#999" }]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <Text style={styles.saveButtonText}>Save Check-In</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.select({ ios: 60, default: 24 }),
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  question: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  choiceButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  choiceText: {
    fontSize: 16,
    fontWeight: "600",
  },
  choiceTextActive: {
    color: "#fff",
  },
  intensityOption: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  intensityLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  intensityDesc: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  modifierBadge: {
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },
  injuryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  injuryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  injuryChipText: {
    fontSize: 14,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
