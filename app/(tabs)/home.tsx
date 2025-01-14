import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

export default function DailyEntryScreen() {
  const [amount, setAmount] = useState("1.5");
  const [isSaved, setIsSaved] = useState(false);
  const [savedAmount, setSavedAmount] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getStorageKey = () => {
    const date = new Date();
    return `milk-entry-${date.toISOString().split("T")[0]}`;
  };

  useFocusEffect(
    useCallback(() => {
      loadTodayEntry();
    }, [])
  );

  const loadTodayEntry = async () => {
    try {
      const savedEntry = await AsyncStorage.getItem(getStorageKey());
      if (savedEntry) {
        setAmount(savedEntry);
        setSavedAmount(savedEntry);
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Error loading entry:", error);
    }
  };

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem(getStorageKey(), amount);
      setSavedAmount(amount);
      setIsSaved(true);
    } catch (error) {
      console.error("Error saving entry: ", error);
    }
  };

  const increment = () => {
    setAmount((parseFloat(amount) + 0.5).toString());
    setIsSaved(false);
  };

  const decrement = () => {
    setAmount((parseFloat(amount) - 0.5).toString());
    setIsSaved(false);
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <View className="w-full p-4 items-center justify-center">
        <Text className="text-center font-bold text-3xl">{today}</Text>
      </View>
      <View className="w-4/5 space-y-4">
        <Text className="text-xl font-bold mb-4 text-center">
          Daily Milk Entry (L)
        </Text>
        <View className="space-y-4">
          <View>
            <View className="flex-row items-center justify-center">
              <TouchableOpacity
                onPress={decrement}
                className="bg-teal-500 w-14 h-14 rounded-3xl items-center justify-center mr-4"
              >
                <Text className="text-white text-6xl">-</Text>
              </TouchableOpacity>
              <TextInput
                className="border-2 p-2 rounded-3xl w-20 h-20 text-center text-3xl font-bold"
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  setIsSaved(false);
                }}
              />
              <TouchableOpacity
                onPress={increment}
                className="bg-teal-500 w-14 h-14 rounded-3xl items-center justify-center ml-4"
              >
                <Text className="text-white text-6xl">+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {isSaved && (
            <Text className="text-green-600 text-xl text-center font-bold mt-2">
              Saved {savedAmount}L for today!
            </Text>
          )}
          <View className="mt-10 items-center justify-center">
            <TouchableOpacity
              onPress={handleSave}
              className="bg-teal-500 w-60 h-14 rounded-3xl items-center justify-center"
            >
              <Text className="text-white text-xl font-bold">
                {isSaved ? "Update" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
