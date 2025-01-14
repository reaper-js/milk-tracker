import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#14B8A6",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 0.5,
          elevation: 20,
          paddingBottom: 1,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Daily Entry",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="pencil" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calender"
        options={{
          title: "Calendar",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="summary"
        options={{
          title: "Summary",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bar-chart" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
