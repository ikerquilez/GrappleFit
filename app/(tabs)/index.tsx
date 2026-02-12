import { StyleSheet, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { useTrainingStore } from "@/store/useTrainingStore";
import { useWeightStore } from "@/store/useWeightStore";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;
  const { dailyReadiness, volumeModifier, todayLogged } = useTrainingStore();
  const { competitionDate, targetWeight, entries, isWaterCutActive } =
    useWeightStore();

  const latestWeight = entries.length > 0 ? entries[entries.length - 1] : null;
  const waterCut = isWaterCutActive();

  const daysUntilComp = competitionDate
    ? Math.ceil(
        (new Date(competitionDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const getPhaseLabel = () => {
    if (daysUntilComp === null) return "No competition set";
    if (daysUntilComp > 56) return "General Prep (GPP)";
    if (daysUntilComp > 21) return "Strength & Threshold";
    if (daysUntilComp > 7) return "Power & Peaking";
    return "Taper Week";
  };

  const getModifierLabel = () => {
    if (!todayLogged) return "Not checked in";
    if (volumeModifier === 1.0) return "Full Volume";
    if (volumeModifier === 0.75) return "75% Volume";
    return "50% Volume (Min Dose)";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GrappleFit</Text>
      <Text style={styles.subtitle}>Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Today's Readiness</Text>
        <Text style={[styles.cardValue, { color: tint }]}>
          {getModifierLabel()}
        </Text>
        {dailyReadiness?.bjjIntensity && (
          <Text style={styles.cardDetail}>
            BJJ: {dailyReadiness.bjjIntensity}
          </Text>
        )}
        {dailyReadiness?.injuries && dailyReadiness.injuries.length > 0 && (
          <Text style={[styles.cardDetail, { color: "#e74c3c" }]}>
            Injuries: {dailyReadiness.injuries.join(", ")}
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Training Phase</Text>
        <Text style={[styles.cardValue, { color: tint }]}>
          {getPhaseLabel()}
        </Text>
        {daysUntilComp !== null && (
          <Text style={styles.cardDetail}>
            {daysUntilComp} days until competition
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Weight</Text>
        {latestWeight ? (
          <Text style={[styles.cardValue, { color: tint }]}>
            {latestWeight.weight.toFixed(1)} kg
          </Text>
        ) : (
          <Text style={styles.cardDetail}>No entries yet</Text>
        )}
        {targetWeight && (
          <Text style={styles.cardDetail}>Target: {targetWeight} kg</Text>
        )}
        {waterCut && (
          <View style={[styles.badge, { backgroundColor: "#e74c3c" }]}>
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>
              Water Cut Active
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.2)",
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 13,
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  cardDetail: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
});
