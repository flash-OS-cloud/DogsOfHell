import { Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import SignIn from "./(auth)/signin";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <SignIn />
    </SafeAreaView>
  )
  
}
