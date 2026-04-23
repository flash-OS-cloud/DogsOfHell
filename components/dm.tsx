import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const mockChatDatabase: Record<string, Message[]> = {
  "1": [
    { id: "1", text: "Hello Doctor, I've been experiencing a mild fever since yesterday.", sender: "patient", time: "10:00 AM" },
    { id: "2", text: "Hi Rahul. Are you experiencing any other symptoms like a cough or body ache?", sender: "doctor", time: "10:05 AM" },
  ],
};

interface DirectMessageProps {
  user: { id: string; patientName: string; avatar: string } | null;
  onClose: () => void;
  currentUserRole: "doctor" | "patient"
}
interface Message {
  id: string;
  text: string;
  sender: "doctor" | "patient";
  time: string
}

export default function DirectMessage({ user, onClose, currentUserRole }: DirectMessageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  // --- 1. THE FIX: Auto-scroll ONLY when messages change, not on keyboard open ---
  useEffect(() => {
    // A tiny timeout ensures the layout paints the new message before scrolling
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length]); // Only runs when the number of messages changes

  // Load chat history
  useEffect(() => {
    if (user) {
      setMessages(mockChatDatabase[user.id] || []);
    }
  }, [user]);

  const handleSend = () => {
    if (!inputText.trim() || !user) return;

    const newMessage : Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: currentUserRole,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
  };

  if (!user) return null;

  return (
    // --- 2. THE FIX: Better Keyboard Handling for Modals ---
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#70A7F5' }} // #09090b is zinc-950
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 bg-zinc-900 border-b border-zinc-800">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={onClose} className="p-1 active:bg-zinc-800 rounded-full">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Image source={{ uri: user.avatar }} className="w-10 h-10 rounded-full border border-zinc-700" />
          <View>
            <Text className="text-white font-bold text-lg">{user.patientName}</Text>
            <Text className="text-teal-400 text-xs font-medium">Active now</Text>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        // Removed the dangerous onContentSizeChange from here!
      >
        {messages.map((msg) => {
          const isDoctor = msg.sender === "doctor";
          return (
            <View key={msg.id} className={`mb-4 max-w-[80%] ${isDoctor ? "self-end" : "self-start"}`}>
              <View className={`p-3 rounded-2xl ${isDoctor ? "bg-teal-600 rounded-tr-sm" : "bg-zinc-800 rounded-tl-sm border border-zinc-700"}`}>
                <Text className="text-white text-base leading-6">{msg.text}</Text>
              </View>
              <Text className={`text-zinc-500 text-xs mt-1 ${isDoctor ? "text-right mr-1" : "text-left ml-1"}`}>{msg.time}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Area */}
      <View className="px-4 py-3 bg-zinc-900 border-t border-zinc-800 flex-row items-end gap-3">
        <Pressable className="p-2 mb-1 bg-zinc-800 rounded-full border border-zinc-700 items-center justify-center h-10 w-10">
          <Ionicons name="add" size={22} color="#2dd4bf" />
        </Pressable>
        
        <View className="flex-1 flex-row items-center bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2 min-h-[44px]">
          {/* --- 3. THE FIX: Safer TextInput styles --- */}
          <TextInput
            className="flex-1 text-white text-base"
            placeholder="Type a message..."
            placeholderTextColor="#71717a"
            multiline
            value={inputText}
            onChangeText={setInputText}
            style={{ maxHeight: 100, textAlignVertical: 'center' }} 
          />
        </View>

        {inputText.trim().length > 0 ? (
          <Pressable onPress={handleSend} className="h-10 w-10 bg-teal-600 rounded-full items-center justify-center mb-1 shadow-sm shadow-teal-900">
            <Ionicons name="send" size={18} color="white" className="ml-1" />
          </Pressable>
        ) : (
          <Pressable className="h-10 w-10 bg-zinc-800 rounded-full border border-zinc-700 items-center justify-center mb-1">
            <Ionicons name="mic-outline" size={20} color="white" />
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}