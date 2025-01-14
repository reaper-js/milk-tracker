import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     router.replace("/home");
  //   }, 3000);

  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <View className="flex-1 items-center justify-center bg-teal-500 w-100 h-100">
      <Text className="text-center text-3xl color-white font-sans">
        Welcome to Milk Tracker
      </Text>
    </View>
  );
}
