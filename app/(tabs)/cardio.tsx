import { useState, useEffect, useRef } from "react";
import { StyleSheet, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import { useWeightStore } from "@/store/useWeightStore";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

type CardioPhase = "zone2" | "intervals" | "alactic";

interface PhaseConfig {
  phase: CardioPhase;
  title: string;
  description: string;
  frequency: string;
  color: string;
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  continuous: boolean;
}

const PHASE_CONFIGS: Record<CardioPhase, PhaseConfig> = {
  zone2: {
    phase: "zone2",
    title: "Zone 2 — Aerobic Base",
    description: "Steady state at 60-70% Max HR. Build the engine.",
    frequency: "3x / week · 45-60 min",
    color: "#2ecc71",
    workSeconds: 0,
    restSeconds: 0,
    rounds: 1,
    continuous: true,
  },
  intervals: {
    phase: "intervals",
    title: "Aerodyne Intervals",
    description: "High intensity intervals. Lactate buffering & VO2 max.",
    frequency: "2-3x / week · 15-20 min",
    color: "#e67e22",
    workSeconds: 20,
    restSeconds: 40,
    rounds: 15,
    continuous: false,
  },
  alactic: {
    phase: "alactic",
    title: "Alactic Sprints",
    description: "Max effort bursts with full recovery. Stay sharp.",
    frequency: "2x / week · 10-12 min",
    color: "#e74c3c",
    workSeconds: 6,
    restSeconds: 90,
    rounds: 6,
    continuous: false,
  },
};

function getCardioPhase(daysUntilComp: number | null): CardioPhase {
  if (daysUntilComp === null || daysUntilComp > 60) return "zone2";
  if (daysUntilComp > 14) return "intervals";
  return "alactic";
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function CardioScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;
  const { competitionDate } = useWeightStore();

  const daysUntilComp = competitionDate
    ? Math.ceil(
        (new Date(competitionDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  const phase = getCardioPhase(daysUntilComp);
  const config = PHASE_CONFIGS[phase];

  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [isWork, setIsWork] = useState(true);
  const [roundTimer, setRoundTimer] = useState(config.workSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    setRunning(false);
    setElapsed(0);
    setCurrentRound(1);
    setIsWork(true);
    setRoundTimer(config.workSeconds);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [phase]);

  const startTimer = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);

      if (!config.continuous) {
        setRoundTimer((prev) => {
          if (prev <= 1) {
            setIsWork((wasWork) => {
              if (wasWork) {
                setRoundTimer(config.restSeconds);
                return false;
              } else {
                setCurrentRound((r) => {
                  if (r >= config.rounds) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setRunning(false);
                    return r;
                  }
                  return r + 1;
                });
                setRoundTimer(config.workSeconds);
                return true;
              }
            });
            return prev;
          }
          return prev - 1;
        });
      }
    }, 1000);
  };

  const stopTimer = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setElapsed(0);
    setCurrentRound(1);
    setIsWork(true);
    setRoundTimer(config.workSeconds);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cardio</Text>
      <Text style={styles.subtitle}>
        {daysUntilComp !== null ? `${daysUntilComp}d to comp` : "No competition set"}
      </Text>

      <View style={[styles.phaseCard, { borderColor: config.color }]}>
        <Text style={[styles.phaseTitle, { color: config.color }]}>
          {config.title}
        </Text>
        <Text style={styles.phaseDesc}>{config.description}</Text>
        <Text style={styles.phaseFreq}>{config.frequency}</Text>
      </View>

      <View style={[styles.timerContainer, { backgroundColor: config.color + "15" }]}>
        {config.continuous ? (
          <>
            <Text style={styles.timerLabel}>Elapsed</Text>
            <Text style={[styles.timerDisplay, { color: config.color }]}>
              {formatTime(elapsed)}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.timerLabel}>
              Round {currentRound}/{config.rounds} ·{" "}
              {isWork ? "WORK" : "REST"}
            </Text>
            <Text style={[styles.timerDisplay, { color: config.color }]}>
              {formatTime(roundTimer)}
            </Text>
            <Text style={styles.totalElapsed}>Total: {formatTime(elapsed)}</Text>
          </>
        )}
      </View>

      <View style={styles.controls}>
        {!running ? (
          <Pressable
            style={[styles.controlButton, { backgroundColor: config.color }]}
            onPress={startTimer}
          >
            <Text style={styles.controlText}>
              {elapsed > 0 ? "Resume" : "Start"}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={[styles.controlButton, { backgroundColor: "#999" }]}
            onPress={stopTimer}
          >
            <Text style={styles.controlText}>Pause</Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.controlButton, { backgroundColor: "transparent", borderWidth: 1, borderColor: "#999" }]}
          onPress={resetTimer}
        >
          <Text style={[styles.controlText, { color: "#999" }]}>Reset</Text>
        </Pressable>
      </View>

      {!config.continuous && (
        <View style={styles.protocolInfo}>
          <Text style={styles.protocolTitle}>Protocol</Text>
          <Text style={styles.protocolDetail}>
            {config.workSeconds}s work / {config.restSeconds}s rest × {config.rounds} rounds
          </Text>
          {phase === "intervals" && (
            <Text style={styles.protocolDetail}>
              Modality: Air Bike, Rower, or Assault Bike
            </Text>
          )}
          {phase === "alactic" && (
            <Text style={styles.protocolDetail}>
              Max effort sprints — full recovery between sets
            </Text>
          )}
        </View>
      )}

      {config.continuous && (
        <View style={styles.protocolInfo}>
          <Text style={styles.protocolTitle}>Protocol</Text>
          <Text style={styles.protocolDetail}>
            45-60 min steady state at 60-70% Max HR
          </Text>
          <Text style={styles.protocolDetail}>
            Modality: Rower, Air Bike, or Jogging
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold" },
  subtitle: { fontSize: 14, color: "#999", marginBottom: 16 },
  phaseCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
  },
  phaseTitle: { fontSize: 18, fontWeight: "700" },
  phaseDesc: { fontSize: 14, color: "#999", marginTop: 4 },
  phaseFreq: { fontSize: 13, color: "#999", marginTop: 8, fontWeight: "600" },
  timerContainer: {
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  timerLabel: { fontSize: 14, fontWeight: "600", color: "#999" },
  timerDisplay: { fontSize: 64, fontWeight: "800", fontVariant: ["tabular-nums"] },
  totalElapsed: { fontSize: 13, color: "#999", marginTop: 4 },
  controls: { flexDirection: "row", gap: 12, marginBottom: 24 },
  controlButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  controlText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  protocolInfo: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(150,150,150,0.2)",
  },
  protocolTitle: { fontSize: 15, fontWeight: "600", marginBottom: 6 },
  protocolDetail: { fontSize: 14, color: "#999", marginTop: 2 },
});
