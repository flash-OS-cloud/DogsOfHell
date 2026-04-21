import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { View, Text, Image, Pressable, Modal } from "react-native";

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [pieces, setPieces] = useState<string[]>([]);
  const [previewPiece, setPreviewPiece] = useState<string | null>(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setPieces([]);
    } else {
      alert("No image selected");
    }
  };

  const splitImage = async () => {
    if (!selectedImage) return;

    const size = 3;

    const img = await ImageManipulator.manipulateAsync(selectedImage, [], {});

    const pieceWidth = img.width / size;
    const pieceHeight = img.height / size;

    let temp: string[] = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const crop = {
          originX: col * pieceWidth,
          originY: row * pieceHeight,
          width: pieceWidth,
          height: pieceHeight,
        };

        const cropped = await ImageManipulator.manipulateAsync(
          selectedImage,
          [{ crop }],
          {
            compress: 1,
            format: ImageManipulator.SaveFormat.PNG,
          },
        );

        temp.push(cropped.uri);
      }
    }

    setPieces(temp);
  };

  return (
    <View className="flex-1 bg-zinc-900 items-center justify-center px-4 pt-10">
      {/* Image Preview */}
      <View className="flex-1 items-center justify-center w-full">
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            className="w-72 h-72 rounded-xl border-2 border-zinc-700"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-zinc-400">No Image Selected</Text>
        )}
      </View>

      <View className="w-full gap-3 mb-6">
        <Pressable
          onPress={pickImageAsync}
          className="bg-blue-500 py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-lg">
            Choose a Photo
          </Text>
        </Pressable>

        <Pressable
          onPress={splitImage}
          className="bg-green-500 py-3 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-lg">
            Split into 3x3
          </Text>
        </Pressable>
      </View>

      {pieces.length > 0 && (
        <View className="mb-10 items-center">
          <Text className="text-white mb-2 font-semibold">
            Cropped Pieces (Click to view)
          </Text>
          <View className="flex-row flex-wrap justify-center w-72">
            {pieces.map((uri, i) => (
              <Pressable
                key={i}
                onPress={() => setPreviewPiece(uri)}
                className="w-24 h-24 border border-zinc-800"
              >
                <Image source={{ uri }} className="w-full h-full" />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <Modal visible={!!previewPiece} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/95 items-center justify-center p-4">
          {previewPiece && (
            <Image
              source={{ uri: previewPiece }}
              className="w-full h-96 rounded-xl"
              resizeMode="contain"
            />
          )}
          <Pressable
            onPress={() => setPreviewPiece(null)}
            className="mt-8 bg-zinc-800 px-8 py-3 rounded-xl border border-zinc-600"
          >
            <Text className="text-white font-semibold text-lg">Close View</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
