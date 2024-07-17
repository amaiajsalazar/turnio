import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { Suspense, useEffect, useState } from "react";
import { SQLiteProvider } from "expo-sqlite/next";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { TurnioLogo } from "./assets/TurnioLogo";
import { TurnosScreen } from "./screens/TurnosScreen";
import { NewTurnoForm } from "./screens/NewTurnoForm";

const Stack = createNativeStackNavigator();

const loadDatabase = async () => {
  const dbName = "turnio.db";
  const dbAsset = require("./assets/turnio.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "SQLite",
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
  return dbFilePath;
};

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!dbLoaded) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator color={"red"} size={"large"} />
        <Text>Cargando base de datos...</Text>
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Suspense
          fallback={
            <View style={{ flex: 1 }}>
              <ActivityIndicator color={"red"} size={"large"} />
              <Text>Cargando base de datos...</Text>
            </View>
          }
        >
          <SQLiteProvider databaseName="turnio.db" useSuspense>
            <Stack.Navigator>
              <Stack.Screen
                name="TurnosScreen"
                component={TurnosScreen}
                options={{
                  title: "Turnos",
                  headerLargeStyle: true,
                  headerRight: () => <TurnioLogo width={100} height={20} />,
                }}
              />
              <Stack.Screen
                name="NewTurnoForm"
                component={NewTurnoForm}
                options={{
                  title: "Añadir Turno",
                  headerLargeStyle: true,
                  headerRight: () => <TurnioLogo width={100} height={20} />,
                }}
              />
            </Stack.Navigator>
          </SQLiteProvider>
        </Suspense>
      </NavigationContainer>
    </>
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
