import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "./global.css";
import { View } from "react-native";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_TASK = "update-milk-data";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

TaskManager.defineTask(BACKGROUND_TASK, async () => {
  try {
    const now = new Date();
    console.log("background task started!", now);

    if (now.getHours() === 7 && now.getMinutes() === 0) {
      const getStorageKey = () => {
        const date = new Date();
        return `milk-entry-${date.toISOString().split("T")[0]}`;
      };
      const storageKey = getStorageKey();
      await AsyncStorage.setItem(storageKey, "1.5");

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Daily Milk Update",
          body: "Today's milk 1.5L has been added",
        },
        trigger: null,
      });

      return BackgroundFetch.BackgroundFetchResult.NewData;
    }

    return BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.log("background task failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

async function registerBackgroundFetchAsync() {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Notification permissions not granted");
    }

    await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
      minimumInterval: 60 * 60, //every hour check
      stopOnTerminate: false,
      startOnBoot: true,
    });
    console.log("Background task registered successfully!");

    return true;
  } catch (error) {
    console.log("Task registration failed:", error);
    return false;
  }
}

// const registerBackgroundTask = async () => {
//   try {
//     await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK, {
//       minimumInterval: 1*60,
//       stopOnTerminate: false,
//       startOnBoot: true,
//     });
//     console.log("Updated Milk Data");
//   } catch (error) {
//     console.error("Error updating milk data:", error);
//   }
// };

// const requestNotificationPermission = async () => {
//   const { status } = await Notifications.requestPermissionsAsync();
//   if (status !== "granted") {
//     alert("You need to enable notifications for this feature to work.");
//   }
// };

SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      const setup = async () => {
        await registerBackgroundFetchAsync();
        await BackgroundFetch.setMinimumIntervalAsync(1 * 60);
      };
      setup();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0d9488" },
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
