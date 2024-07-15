import { StatusBar } from "expo-status-bar";
import { View, StyleSheet, Pressable, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ListaTurnos } from "./components/ListaTurnos";

export default function App() {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ListaTurnos />
      </View>
      <View style={styles.addBtnView}>
        <Pressable
          style={styles.addBtn}
          onPress={() => {
            /* Your onPress action here */
          }}
        >
          <Text style={styles.addBtnText}>+</Text>
        </Pressable>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
  },
  addBtn: {
    backgroundColor: "#63aac0",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15, // Makes it circular
    elevation: 5, // Adds shadow for Android (optional)
  },
  addBtnView: { position: "absolute", right: 30, bottom: 30 },
  addBtnText: {
    color: "white",
    textAlign: "center",
    fontSize: 32,
  },
});
