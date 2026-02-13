import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import "react-native-reanimated";
import "react-native-gesture-handler";
import "../global.css";

import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import DailyCheckInModal from "@/components/DailyCheckInModal";
import { useTrainingStore } from "@/store/useTrainingStore";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme() ?? "light";
  const tint = Colors[colorScheme].tint;
  const { todayLogged, loading, checkTodayLog } = useTrainingStore();
  const [showCheckIn, setShowCheckIn] = useState(false);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  useEffect(() => {
    checkTodayLog().then(() => {
      setShowCheckIn(true);
    });
  }, []);

  const modalVisible = showCheckIn && !loading && !todayLogged;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            drawerType: isLargeScreen ? "permanent" : "front",
            drawerStyle: isLargeScreen ? { width: 250 } : undefined,
            drawerActiveTintColor: tint,
            headerTintColor: tint,
          }}
        >
          <Drawer.Screen
            name="(tabs)"
            options={{
              drawerLabel: "Home",
              title: "GrappleFit",
              drawerIcon: ({ color, size }) => (
                <FontAwesome name="home" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="user"
            options={{
              drawerLabel: "User",
              title: "User",
              drawerIcon: ({ color, size }) => (
                <FontAwesome name="user" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="tournaments"
            options={{
              drawerLabel: "Tournaments",
              title: "Tournaments",
              drawerIcon: ({ color, size }) => (
                <FontAwesome name="trophy" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="exercises"
            options={{
              drawerLabel: "Exercise Library",
              title: "Exercise Library",
              drawerIcon: ({ color, size }) => (
                <FontAwesome name="list" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="about"
            options={{
              drawerLabel: "About",
              title: "About",
              drawerIcon: ({ color, size }) => (
                <FontAwesome name="info-circle" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="modal"
            options={{ drawerItemStyle: { display: "none" } }}
          />
          <Drawer.Screen
            name="+not-found"
            options={{ drawerItemStyle: { display: "none" } }}
          />
        </Drawer>
        <DailyCheckInModal
          visible={modalVisible}
          onDismiss={() => setShowCheckIn(false)}
        />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
