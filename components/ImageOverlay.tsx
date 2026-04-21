import React, { useState } from "react";
import { View, Text, Image, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type ImagePiece = {
  id: number;
  uri: string;
};

type ImageGridOverlayProps = {
  visible: boolean;
  onClose: () => void;
  pieces: ImagePiece[];
};

const ImageGridOverlay: React.FC<ImageGridOverlayProps> = ({ visible, onClose, pieces }) => {
  const [selectedSinglePiece, setSelectedSinglePiece] = useState<ImagePiece | null>(null);

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View className="flex-1 bg-zinc-950 px-4 pt-12">
        <View className="flex-row items-center mb-8 gap-3">
          <Pressable onPress={onClose} className="bg-zinc-800 p-2 rounded-full">
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-3xl font-bold">Photo Grid (3x3)</Text>
        </View>

        {pieces.length > 0 && (
          <View className="flex-1 items-center justify-center">
            <Text className="text-zinc-500 mb-6 text-base px-6 text-center">
              Pieces are numbered 1-9 for exact reassembly. Tap any piece for a full view.
            </Text>
            <View className="flex-row flex-wrap justify-center w-80">
              {pieces.map((piece) => (
                <Pressable
                  key={piece.id}
                  onPress={() => setSelectedSinglePiece(piece)}
                  className="w-24 h-24 border border-zinc-800 relative"
                >
                  <Image source={{ uri: piece.uri }} className="w-full h-full" />
                  
                  <View className="absolute top-1 left-1 bg-black/70 rounded px-1.5 py-0.5">
                    <Text className="text-white text-xs font-bold">{piece.id}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>

      <Modal visible={!!selectedSinglePiece} transparent={true} animationType="fade">
        <View className="flex-1 bg-black/95 items-center justify-center p-4">
          {selectedSinglePiece && (
            <>
              <Text className="text-zinc-400 font-bold text-xl mb-4">
                Piece #{selectedSinglePiece.id}
              </Text>
              <Image
                source={{ uri: selectedSinglePiece.uri }}
                className="w-full h-96 rounded-xl border border-zinc-800"
                resizeMode="contain"
              />
            </>
          )}
          <Pressable
            onPress={() => setSelectedSinglePiece(null)}
            className="mt-8 bg-zinc-800 px-8 py-3 rounded-xl border border-zinc-600"
          >
            <Text className="text-white font-semibold text-lg">Close View</Text>
          </Pressable>
        </View>
      </Modal>
    </Modal>
  );
};

export default ImageGridOverlay;
