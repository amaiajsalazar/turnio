import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableHighlight,
  Pressable,
} from "react-native";

// const icon = require("./assets/icon.png");
import icon from "./assets/icon.png";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={{ color: "black" }}>Hola</Text>
      <Image
        source={icon}
        style={{
          width: 200,
          height: 100,
          resizeMode: "center",
        }}
      />
      {/* 100 numero de pixeles efectivos/visuales de la pantalla del dispositivo */}
      <Image
        source={{
          uri: "https://hips.hearstapps.com/hmg-prod/images/one-direction-1666782312.jpg?crop=1xw:0.8391347588264545xh;center,top&resize=1200:*",
        }}
        style={{ width: 200, height: 100 }}
      />
      {/* a las uri remotas hay que ponerles width y height siempre */}
      {/* light/dark/auto */}
      <Button title="Pulsa" onPress={() => alert("Hola")} color="red" />
      <TouchableHighlight
        underlayColor={"#09f"}
        onPress={() => alert("Hola")}
        style={{
          backgroundColor: "purple",
          padding: 10,
          borderRadius: 10,
          marginTop: 10,
          height: 50,
          width: 100,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Touchable</Text>
      </TouchableHighlight>
      <Pressable
        onPress={() => {}}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "red" : "blue",

            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            height: 50,
            width: 100,
            justifyContent: "center",
            alignContent: "center",
          },
        ]}
      >
        {({ pressed }) => (
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontSize: pressed ? 20 : 16,
            }}
          >
            {pressed ? "Presionado" : "Press me"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
