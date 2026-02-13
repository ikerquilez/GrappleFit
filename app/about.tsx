import { useState } from "react";
import { StyleSheet, ScrollView, Pressable } from "react-native";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Tab = "nerds" | "illiterate";

function Section({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{body}</Text>
    </View>
  );
}

function NerdsContent() {
  return (
    <>
      <Section
        title="The Interference Effect"
        body={
          "The fundamental constraint in training BJJ athletes is the Hickson Interference Effect. " +
          "Resistance training activates the mTOR (mammalian target of rapamycin) pathway, driving protein synthesis and hypertrophy. " +
          "Conversely, the high-intensity sustained output of grappling activates the AMPK (AMP-activated protein kinase) pathway, " +
          "promoting mitochondrial biogenesis but inhibiting mTOR signaling.\n\n" +
          "Without autoregulation, cumulative fatigue from grappling — eccentric muscle damage, high lactate accumulation, " +
          "and significant CNS stress — renders standard percentage-based lifting programs ineffective or dangerous."
        }
      />
      <Section
        title="Volume Autoregulation Algorithm (VAA)"
        body={
          "The VAA applies a Volume Reduction Multiplier (VRM) to training set volume based on BJJ session intensity, " +
          "preserving neural drive (intensity on the bar) while modulating metabolic cost (volume).\n\n" +
          "VRM = 1.0 — No BJJ or Flow rolling (RPE 1-4). Full planned volume.\n" +
          "VRM = 0.75 — Standard class / moderate sparring (RPE 5-7). 25% volume reduction.\n" +
          "VRM = 0.50 — Competition training / Shark Tank (RPE 8-10). Minimum Effective Dose only.\n\n" +
          "This implements the Consolidation of Stressors principle: treating BJJ and lifting as unified systemic load " +
          "rather than independent stimuli, minimizing the interference effect while preserving neuromuscular adaptations."
        }
      />
      <Section
        title="Periodization Model"
        body={
          "The 8-week macrocycle follows a block periodization structure driven by competition proximity:\n\n" +
          "Weeks 8-6 — Hypertrophy (GPP): 70-75% 1RM, 4x8-10. Build tissue tolerance. Zone 2 cardio (60-70% MHR).\n" +
          "Weeks 5-3 — Strength: 80-90% 1RM, 3-5x3-5. Maximize force production. Aerodyne intervals.\n" +
          "Week 2 — Power: 50-60% 1RM, max velocity. Plyometrics. Alactic sprints (<10s, full recovery).\n" +
          "Week 1 — Taper: Single priming session (2x2 @ 70%). Supercompensation.\n\n" +
          "Each phase includes Upper/Lower/Full Body options. Full Body consolidates load for athletes " +
          "limited to 2 lifting sessions per week alongside heavy mat time."
        }
      />
      <Section
        title="Energy System Specificity"
        body={
          "BJJ matches (5-10 min) demand three distinct energy systems:\n\n" +
          "1. Aerobic (Zone 2) — Powers recovery between bursts and positional control. " +
          "Improved via steady-state work at 60-70% MHR. Increases mitochondrial density and cardiac output.\n\n" +
          "2. Glycolytic/Lactic — Fuels 30-90s scrambles. Trained via Aerodyne intervals " +
          "(20s sprint / 40s cruise x 15) to increase VO2max and lactate buffering capacity.\n\n" +
          "3. Alactic (ATP-PC) — Powers maximal efforts <10s (explosions, shots, bridges). " +
          "Trained via short sprints (6s max / 90s rest x 6) to prime the phosphocreatine system."
        }
      />
      <Section
        title="Weight Descent: Linear Regression Model"
        body={
          "The weight tracker implements a least-squares linear regression to project a Daily Loss Target (DLT):\n\n" +
          "DLT = (Current Weight - (Target Weight - Water Cut Buffer)) / Days Until Weigh-In\n\n" +
          "Safety constraints:\n" +
          "• Day-before weigh-in (ADCC): Max acute cut = 8% body mass\n" +
          "• Same-day weigh-in (IBJJF): Max acute cut = 3-5% body mass\n" +
          "• Daily deficit exceeding 1000 kcal triggers a weight class warning\n\n" +
          "Final week switches to a Water Manipulation Protocol:\n" +
          "Days -6 to -4: Water loading (7.5L/day), high sodium — suppresses aldosterone\n" +
          "Day -3: 3.8L, moderate sodium\n" +
          "Day -2: 1.9L, zero sodium\n" +
          "Day -1: Sipping only. No food after 6 PM."
        }
      />
      <Section
        title="Movement Pattern Classification"
        body={
          "Exercise categories follow Dan John's fundamental movement pattern framework, " +
          "adapted for grappling specificity:\n\n" +
          "Push — Horizontal and vertical pressing (bench, OHP). Builds frames and posting strength.\n" +
          "Pull — Rows and pull-ups. Powers collar ties, guard climbing, and back takes.\n" +
          "Hinge & Squat — Hip-dominant (deadlifts, swings) and knee-dominant (squats, lunges). " +
          "The engine of takedowns, sprawls, and guard retention.\n" +
          "Grip — Gi/towel hangs and pinch holds. Isometric endurance for collar/sleeve control.\n" +
          "Neck — Rotations and flexions. The anti-concussion protocol for choke and headlock defense.\n\n" +
          "Supplemental 'Armor Building' exercises (max 2 per session) fill structural gaps " +
          "in neck, grip, and rotational stability required for BJJ longevity."
        }
      />
    </>
  );
}

function IlliterateContent() {
  return (
    <>
      <Section
        title="Why This App Exists"
        body={
          "You train BJJ. You also lift. Some days you do both and feel like a bag of smashed crabs. " +
          "This app makes sure your lifting doesn't wreck your rolling and vice versa. That's it. Trust me."
        }
      />
      <Section
        title="The Volume Thing"
        body={
          "Hard roll today? App cuts your lifting sets in half. " +
          "Normal class? Trims a little. Flow day? Full send.\n\n" +
          "You still lift heavy — we just do less of it when you're cooked. " +
          "Science calls it \"autoregulation.\" We call it \"not being stupid.\""
        }
      />
      <Section
        title="The Phases"
        body={
          "Far from comp: Lift more, build muscle. You're a bodybuilder who happens to choke people.\n\n" +
          "Getting closer: Lift heavier but less. You're becoming dangerous.\n\n" +
          "Almost there: Explosive stuff — jumps, speed work. You're a loaded spring.\n\n" +
          "Competition week: One light session Monday then put the weights down. " +
          "You've done the work. Go strangle someone."
        }
      />
      <Section
        title="Cardio"
        body={
          "Far out: Long, boring, easy cardio. Your heart gets bigger. " +
          "Yes, you actually have to do this.\n\n" +
          "Mid-camp: Air bike intervals that make you question your life choices. " +
          "This is where your gas tank gets built.\n\n" +
          "Final weeks: Short sprints, full rest. " +
          "Think of it as loading the shotgun."
        }
      />
      <Section
        title="Weight Cutting"
        body={
          "The app draws a straight line from your current weight to your target. " +
          "If you're above the line, eat less. Below it, chill.\n\n" +
          "Last week it switches to water manipulation. " +
          "Drink a LOT, then drink a LITTLE, then basically nothing. " +
          "Your body flushes water on autopilot. " +
          "It's not magic — it's just tricking your kidneys. They're not that smart."
        }
      />
      <Section
        title="The Exercises"
        body={
          "Push stuff, pull stuff, pick heavy things off the floor, squat with them. " +
          "We also make you hang from towels and do weird neck exercises because " +
          "getting guillotined with a weak neck is a bad time.\n\n" +
          "Hit shuffle if you're bored. The app swaps exercises from the same category " +
          "so your workout still makes sense even when you're winging it."
        }
      />
    </>
  );
}

export default function AboutScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;
  const [tab, setTab] = useState<Tab>("nerds");

  return (
    <View style={styles.container}>
      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tab, tab === "nerds" && { backgroundColor: tint }]}
          onPress={() => setTab("nerds")}
        >
          <FontAwesome
            name="flask"
            size={14}
            color={tab === "nerds" ? "#fff" : "#999"}
          />
          <Text style={[styles.tabText, tab === "nerds" && { color: "#fff" }]}>
            For Nerds
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, tab === "illiterate" && { backgroundColor: tint }]}
          onPress={() => setTab("illiterate")}
        >
          <FontAwesome
            name="smile-o"
            size={14}
            color={tab === "illiterate" ? "#fff" : "#999"}
          />
          <Text
            style={[styles.tabText, tab === "illiterate" && { color: "#fff" }]}
          >
            For the Illiterate
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.subtitle}>
          {tab === "nerds"
            ? "The Science Behind GrappleFit"
            : "The No-BS Version"}
        </Text>
        {tab === "nerds" ? <NerdsContent /> : <IlliterateContent />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tabText: { fontSize: 14, fontWeight: "600" },
  scroll: { padding: 16, paddingBottom: 48 },
  subtitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  sectionBody: { fontSize: 14, lineHeight: 22, color: "#888" },
});
