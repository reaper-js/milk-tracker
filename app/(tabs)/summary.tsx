import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MonthSummary {
  month: string;
  totalVolume: number;
  dailyAverage: number;
  highestDay: {
    amount: number;
    date: string;
  };
}

export default function SummaryScreen() {
  const [monthsSummary, setMonthsSummary] = useState<MonthSummary[]>([]);

  const getMonthSummary = (
    entries: [string, string | null][],
    monthOffset: number
  ) => {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() - monthOffset);
    const targetMonth = targetDate.getMonth();
    const targetYear = targetDate.getFullYear();

    const monthEntries = entries.filter(([key]) => {
      const entryDate = new Date(key.replace("milk-entry-", ""));
      return (
        entryDate.getMonth() === targetMonth &&
        entryDate.getFullYear() === targetYear
      );
    });

    let total = 0;
    let highest = { amount: 0, date: "" };

    monthEntries.forEach(([key, value]) => {
      if (value) {
        const amount = parseFloat(value);
        total += amount;

        if (amount > highest.amount) {
          highest = {
            amount: amount,
            date: new Date(key.replace("milk-entry-", "")).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
              }
            ),
          };
        }
      }
    });

    return {
      month: targetDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      totalVolume: total,
      dailyAverage: monthEntries.length > 0 ? total / monthEntries.length : 0,
      highestDay: highest,
    };
  };

  const loadSummaryData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const milkEntryKeys = keys.filter((key) => key.startsWith("milk-entry-"));
      const entries = await AsyncStorage.multiGet(milkEntryKeys);

      const summaries = [0, 1, 2].map((offset) =>
        getMonthSummary(entries as [string, string | null][], offset)
      );
      setMonthsSummary(summaries);
    } catch (error) {
      console.error("Error loading summary data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSummaryData();
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <Text className="text-3xl font-bold mb-4 text-center mt-10">
          Last 3 Months Summary
        </Text>
        {monthsSummary.map((summary, index) => (
          <View key={index} className="mb-6">
            <Text className="text-3xl font-bold text-teal-600 mb-2 text-center">
              {summary.month}
            </Text>
            <View className="flex-1 space-y-3 items-center justify-center">
              <View className="bg-teal-700 p-4 w-40 rounded-3xl">
                <Text className="font-bold text-white text-center">Total</Text>
                <Text className="text-2xl text-white text-center">
                  {summary.totalVolume.toFixed(1)} L
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
