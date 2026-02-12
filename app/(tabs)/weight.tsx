import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Switch,
  Platform,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useWeightStore, WeightEntry } from "@/store/useWeightStore";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

export default function WeightTrackerScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;

  const {
    entries,
    competitionDate,
    targetWeight,
    waterCutManualOverride,
    addEntry,
    removeEntry,
    setCompetitionDate,
    setTargetWeight,
    setWaterCutManualOverride,
    getLinearRegression,
    getExpectedWeight,
    isWaterCutActive,
  } = useWeightStore();

  const [weightInput, setWeightInput] = useState("");
  const [compDateInput, setCompDateInput] = useState(competitionDate ?? "");
  const [targetInput, setTargetInput] = useState(
    targetWeight?.toString() ?? ""
  );

  const todayStr = formatDate(new Date());
  const regression = getLinearRegression();
  const expectedToday = getExpectedWeight(todayStr);
  const waterCutActive = isWaterCutActive();

  const expectedAtComp = competitionDate
    ? getExpectedWeight(competitionDate)
    : null;

  const daysUntilComp = competitionDate
    ? Math.ceil(
        (new Date(competitionDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const handleAddWeight = () => {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w <= 0) return;
    addEntry({ date: todayStr, weight: w });
    setWeightInput("");
  };

  const handleSaveProfile = () => {
    setCompetitionDate(compDateInput || null);
    const tw = parseFloat(targetInput);
    setTargetWeight(isNaN(tw) ? null : tw);
  };

  const renderEntry = ({ item }: { item: WeightEntry }) => {
    const expected = getExpectedWeight(item.date);
    const diff = expected ? item.weight - expected : null;
    return (
      <View style={styles.entryRow}>
        <Text style={styles.entryDate}>{item.date}</Text>
        <Text style={styles.entryWeight}>{item.weight.toFixed(1)} kg</Text>
        {diff !== null && (
          <Text
            style={[
              styles.entryDiff,
              { color: diff > 0 ? "#e74c3c" : "#2ecc71" },
            ]}
          >
            {diff > 0 ? "+" : ""}
            {diff.toFixed(2)}
          </Text>
        )}
        <Pressable onPress={() => removeEntry(item.date)}>
          <Text style={{ color: "#e74c3c", fontSize: 16 }}>✕</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.date}
        renderItem={renderEntry}
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>Weight Tracker</Text>

            {waterCutActive && (
              <View style={[styles.banner, { backgroundColor: "#e74c3c" }]}>
                <Text style={[styles.bannerText, { color: "#fff" }]}>
                  Water Cut Mode Active
                  {daysUntilComp !== null && ` — ${daysUntilComp}d to comp`}
                </Text>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Log Today's Weight</Text>
              <View style={styles.row}>
                <TextInput
                  style={[
                    styles.input,
                    { color: Colors[colorScheme].text, borderColor: tint },
                  ]}
                  placeholder="Weight (kg)"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                  value={weightInput}
                  onChangeText={setWeightInput}
                />
                <Pressable
                  style={[styles.button, { backgroundColor: tint }]}
                  onPress={handleAddWeight}
                >
                  <Text style={styles.buttonText}>Add</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: Colors[colorScheme].text,
                    borderColor: tint,
                    marginBottom: 8,
                  },
                ]}
                placeholder="Competition date (YYYY-MM-DD)"
                placeholderTextColor="#999"
                value={compDateInput}
                onChangeText={setCompDateInput}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    color: Colors[colorScheme].text,
                    borderColor: tint,
                    marginBottom: 8,
                  },
                ]}
                placeholder="Target weight (kg)"
                placeholderTextColor="#999"
                keyboardType="decimal-pad"
                value={targetInput}
                onChangeText={setTargetInput}
              />
              <Pressable
                style={[styles.button, { backgroundColor: tint }]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.buttonText}>Save Profile</Text>
              </Pressable>
            </View>

            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.sectionTitle}>Water Cut Mode</Text>
                <Switch
                  value={waterCutActive}
                  onValueChange={(val) => setWaterCutManualOverride(val)}
                  trackColor={{ false: "#767577", true: "#e74c3c" }}
                />
              </View>
              {waterCutManualOverride !== null && (
                <Pressable onPress={() => setWaterCutManualOverride(null)}>
                  <Text style={{ color: tint, marginTop: 4, fontSize: 13 }}>
                    Reset to auto
                  </Text>
                </Pressable>
              )}
            </View>

            {regression && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trend</Text>
                <Text>
                  Rate: {(regression.slope * 7).toFixed(2)} kg/week
                </Text>
                {expectedToday !== null && (
                  <Text>Expected today: {expectedToday.toFixed(1)} kg</Text>
                )}
                {expectedAtComp !== null && targetWeight !== null && (
                  <Text>
                    Expected at comp: {expectedAtComp.toFixed(1)} kg (target:{" "}
                    {targetWeight} kg,{" "}
                    {expectedAtComp <= targetWeight ? "on track ✓" : "over ✗"})
                  </Text>
                )}
              </View>
            )}

            <View style={styles.separator} />
            <Text style={styles.sectionTitle}>History</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No entries yet. Log your weight above.</Text>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: Platform.select({ ios: 12, default: 8 }),
    fontSize: 16,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  banner: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  bannerText: {
    fontWeight: "700",
    fontSize: 15,
  },
  separator: {
    marginVertical: 12,
    height: 1,
    backgroundColor: "rgba(150,150,150,0.3)",
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  entryDate: {
    flex: 1,
    fontSize: 14,
  },
  entryWeight: {
    fontSize: 15,
    fontWeight: "600",
  },
  entryDiff: {
    fontSize: 13,
    width: 60,
    textAlign: "right",
  },
  empty: {
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});
