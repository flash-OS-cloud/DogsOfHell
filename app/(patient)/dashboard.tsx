import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ImageGridOverlay, { ImagePiece } from "@/components/ImageOverlay";

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [pieces, setPieces] = useState<ImagePiece[]>([]);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const splitImage = async (uriToSplit: string) => {
    setIsProcessing(true);
    const size = 3;

    try {
      const img = await ImageManipulator.manipulateAsync(uriToSplit, [], {});

      const pieceWidth = img.width / size;
      const pieceHeight = img.height / size;

      let temp: ImagePiece[] = [];
      let counter = 1;

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const crop = {
            originX: col * pieceWidth,
            originY: row * pieceHeight,
            width: pieceWidth,
            height: pieceHeight,
          };

          const cropped = await ImageManipulator.manipulateAsync(
            uriToSplit,
            [{ crop }],
            {
              compress: 1,
              format: ImageManipulator.SaveFormat.PNG,
            }
          );

          temp.push({
            id: counter,
            uri: cropped.uri,
          });

          counter++;
        }
      }

      setPieces(temp);
      setShowOverlay(true);
    } catch (error) {
      alert("Failed to process image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
      setPieces([]);

      await splitImage(imageUri);
    } else {
      alert("No image selected");
    }
  };

  const steps = [
    { num: 1, title: "Upload Image", desc: "Take or select a photo from your library." },
    { num: 2, title: "Auto-Processing", desc: "Our system instantly cuts your photo." },
    { num: 3, title: "Grid Results", desc: "View your beautiful 3x3 interactive collage." },
  ];

  const featureCards = [
    { icon: "flash", label: "Fast Processing" },
    { icon: "wifi", label: "Works in Low Internet" },
    { icon: "albums", label: "Clean Layout" },
  ];

  return (
    <View className="flex-1 bg-zinc-950 px-4 pt-10">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-bold text-teal-400">Relay</Text>
          <View className="flex-row gap-2 items-center">
            <Pressable className="bg-zinc-800 p-2 rounded-full">
              <Ionicons name="notifications-outline" size={22} color="white" />
            </Pressable>
            <Image source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }} className="w-10 h-10 rounded-full" />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-white text-3xl font-bold">Hi, Rahul 👋</Text>
        </View>

        <View className="items-center mb-10 w-full h-56 bg-zinc-900/50 rounded-2xl border border-zinc-800 justify-center overflow-hidden">
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop" }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="mb-10 gap-6">
          {steps.map((step) => (
            <View key={step.num} className="flex-row items-start gap-4">
              <View className="w-10 h-10 bg-teal-900 rounded-full items-center justify-center border-2 border-teal-600">
                <Text className="text-teal-400 text-xl font-bold">{step.num}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold">{step.title}</Text>
                <Text className="text-zinc-500 text-base">{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <View className="w-full mb-10">
          <Pressable
            onPress={pickImageAsync}
            disabled={isProcessing}
            className={`py-4 rounded-2xl flex-row justify-center items-center gap-2 ${
              isProcessing ? "bg-teal-600/50" : "bg-teal-600"
            }`}
          >
            <Ionicons name="camera-outline" size={24} color="white" />
            <Text className="text-white font-bold text-lg">
              {isProcessing ? "Processing..." : "Upload Image"}
            </Text>
          </Pressable>
        </View>

        <View className="flex-row justify-center gap-3 mb-10">
          {featureCards.map((card, i) => (
            <View key={i} className="flex-1 items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800 justify-center h-28 gap-2">
              <Ionicons name={card.icon} size={28} color="#2dd4bf" />
              <Text className="text-white text-center text-sm font-medium">{card.label}</Text>
            </View>
          ))}
        </View>

        <View>
          <Text className="text-white text-xl font-bold mb-4">Recent Activity</Text>
          {selectedImage ? (
            <Pressable
              onPress={() => setShowOverlay(true)}
              className="w-full h-28 bg-zinc-900 rounded-xl border border-zinc-800 flex-row items-center p-3 gap-4"
            >
              <Image source={{ uri: selectedImage }} className="w-20 h-20 rounded-lg" resizeMode="cover" />
              <View className="flex-1 justify-center">
                <Text className="text-white font-bold text-lg mb-1">Image Processed</Text>
                <Text className="text-teal-400 font-medium text-sm">Tap here to view 3x3 grid</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#52525b" />
            </Pressable>
          ) : (
            <View className="w-full h-20 bg-zinc-900 rounded-xl border border-zinc-800 items-center justify-center">
              <Text className="text-zinc-500 font-medium text-base">No uploads yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <ImageGridOverlay
        visible={showOverlay}
        onClose={() => setShowOverlay(false)}
        pieces={pieces}
      />
    </View>
  );
}
