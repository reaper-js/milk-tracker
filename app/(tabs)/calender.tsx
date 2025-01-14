import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

export default function CalendarScreen() {
  const [milkData, setMilkData] = useState<{
    [key: string]: { marked: boolean; dotColor: string; amount: string };
  }>({});
  const [selectedData, setSelectedData] = useState<string | null>(null);
  const [thatDate, setThatDate] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useFocusEffect(
    useCallback(() => {
      loadMilkData();
      setThatDate(today);
      handleDayPress({ dateString: today });
    }, [])
  );

  const loadMilkData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const milkEntryKeys = keys.filter((key) => key.startsWith("milk-entry-"));
      const entries = await AsyncStorage.multiGet(milkEntryKeys);

      const markedDates = entries.reduce((acc, [key, value]) => {
        const date = key.replace("milk-entry-", "");
        if (value) {
          acc[date] = {
            marked: true,
            dotColor: "#50cebb",
            amount: value,
          };
        }
        return acc;
      }, {} as { [key: string]: any });

      setMilkData(markedDates);
    } catch (error) {
      console.error("Error loading milk data:", error);
    }
  };

  const handleEdit = async () => {
    if (!thatDate || thatDate > today) return;
    setEditAmount(selectedData || "");
    setIsModalVisible(true);
  };

  const handleDayPress = async (day: any) => {
    const selectedDate = day.dateString;
    setThatDate(selectedDate);
    if (selectedDate <= today) {
      const storageKey = `milk-entry-${selectedDate}`;
      try {
        const value = await AsyncStorage.getItem(storageKey);
        setSelectedData(value);
      } catch (error) {
        console.error("Error fetching data for date:", error);
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="mt-10">
        <Text className="text-center font-bold text-3xl mt-4">
          Previous Entries
        </Text>
      </View>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={milkData}
        minDate={"2024-01-01"}
        maxDate={today}
        disableAllTouchEventsForDisabledDays={true}
        futureScrollRange={0}
        theme={{
          textDisabledColor: "#d9e1e8",
          todayTextColor: "#0a7ea4",
        }}
      />
      {selectedData && (
        <View className="mt-10">
          <Text className="text-center font-bold text-xl mt-4">
            Milk entered on {thatDate}
          </Text>
          <Text className="text-center text-teal-500 font-bold text-4xl mt-4">
            {selectedData} L
          </Text>
        </View>
      )}
      {!selectedData && (
        <View className="mt-10">
          <Text className="text-center font-bold text-xl mt-4">
            No entry for {thatDate}
          </Text>
        </View>
      )}
      <View className="items-center justify-center">
        <TouchableOpacity
          className="bg-teal-500 w-24 p-4 rounded-3xl mt-10"
          onPress={handleEdit}
        >
          <Text className="text-center text-white">Edit ✎</Text>
        </TouchableOpacity>
      </View>
      <Modal
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setEditAmount("");
          setIsModalVisible(false);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-4 rounded-lg w-80">
            <TextInput
              className="border border-gray-300 p-2 rounded"
              keyboardType="numeric"
              value={editAmount}
              onChangeText={setEditAmount}
              placeholder="Enter milk amount in liters"
            />
            <View className="flex-row justify-end mt-4 space-x-2">
              <TouchableOpacity
                onPress={() => {
                  setEditAmount("");
                  setIsModalVisible(false);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const storageKey = `milk-entry-${thatDate}`;
                  try {
                    await AsyncStorage.setItem(storageKey, editAmount);
                    setSelectedData(editAmount);
                    await loadMilkData();
                    setIsModalVisible(false);
                    setEditAmount("");
                  } catch (error) {
                    console.error("Error saving edited amount:", error);
                  }
                }}
                className="bg-teal-500 px-4 py-2 rounded"
              >
                <Text className="text-white">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
