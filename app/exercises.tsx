import { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  SectionList,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { supabase } from "@/services/supabase";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";

interface DbExercise {
  name: string;
  category: string;
  is_supplemental: boolean;
  description: string | null;
}

interface Section {
  title: string;
  data: DbExercise[];
}

const CATEGORY_ORDER = ["Push", "Pull", "Hinge & Squat", "Grip", "Neck", "Cardio"];

const CATEGORY_ICONS: Record<string, React.ComponentProps<typeof FontAwesome>["name"]> = {
  Push: "hand-rock-o",
  Pull: "hand-grab-o",
  "Hinge & Squat": "bolt",
  Grip: "hand-paper-o",
  Neck: "shield",
  Cardio: "heartbeat",
};

export default function ExerciseLibraryScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;

  const [exercises, setExercises] = useState<DbExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedName, setExpandedName] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("exercises")
      .select("name, category, is_supplemental, description")
      .order("category")
      .order("name")
      .then(({ data }) => {
        if (data) setExercises(data);
        setLoading(false);
      });
  }, []);

  const toggle = useCallback(
    (name: string) => setExpandedName((prev) => (prev === name ? null : name)),
    []
  );

  const filtered = activeFilter
    ? exercises.filter((e) => e.category === activeFilter)
    : exercises;

  const sections: Section[] = CATEGORY_ORDER.filter((cat) =>
    filtered.some((e) => e.category === cat)
  ).map((cat) => ({
    title: cat,
    data: filtered.filter((e) => e.category === cat),
  }));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.name}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View>
            <Text style={styles.count}>
              {filtered.length} exercise{filtered.length !== 1 && "s"}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterRow}
            >
              <Pressable
                style={[
                  styles.filterChip,
                  !activeFilter && { backgroundColor: tint },
                ]}
                onPress={() => setActiveFilter(null)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    !activeFilter && { color: "#fff" },
                  ]}
                >
                  All
                </Text>
              </Pressable>
              {CATEGORY_ORDER.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.filterChip,
                    activeFilter === cat && { backgroundColor: tint },
                  ]}
                  onPress={() =>
                    setActiveFilter((prev) => (prev === cat ? null : cat))
                  }
                >
                  <FontAwesome
                    name={CATEGORY_ICONS[cat] ?? "circle"}
                    size={12}
                    color={activeFilter === cat ? "#fff" : "#999"}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      activeFilter === cat && { color: "#fff" },
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        }
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <FontAwesome
              name={CATEGORY_ICONS[title] ?? "circle"}
              size={14}
              color={tint}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.sectionTitle, { color: tint }]}>{title}</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const expanded = expandedName === item.name;
          return (
            <Pressable onPress={() => toggle(item.name)}>
              <View style={styles.row}>
                <View style={styles.rowHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.exerciseName}>{item.name}</Text>
                    {item.is_supplemental && (
                      <Text style={styles.badge}>Armor Building</Text>
                    )}
                  </View>
                  <FontAwesome
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={12}
                    color="#999"
                  />
                </View>
                {expanded && item.description ? (
                  <Text style={styles.description}>{item.description}</Text>
                ) : null}
              </View>
            </Pressable>
          );
        }}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { padding: 16, paddingBottom: 32 },
  count: { fontSize: 13, color: "#999", marginBottom: 8 },
  filterRow: { gap: 8, paddingBottom: 16 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterChipText: { fontSize: 13, fontWeight: "600" },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 6,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", textTransform: "uppercase" },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.15)",
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  exerciseName: { fontSize: 16, fontWeight: "600" },
  badge: {
    fontSize: 11,
    color: "#e67e22",
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
    lineHeight: 20,
  },
});
