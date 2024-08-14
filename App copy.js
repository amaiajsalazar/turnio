import React, { useEffect, useState, Suspense } from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SQLiteProvider } from 'expo-sqlite/next';
import { TurnoProvider } from './contexts/TurnoContext';
import { TurnosScreen } from './screens/TurnosScreen';
import { NewTurnoForm } from './screens/NewTurnoForm';
import { HomeScreen } from './screens/HomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppRegistry } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();



// load database normal
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

function TurnosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Turnos"
        component={TurnosScreen}
      />
      <Stack.Screen
        name="NewTurnoForm"
        component={NewTurnoForm}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [dbLoaded, setDbLoaded] = useState(false);

  useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((error) => {
        console.log('Error loading database:', error);
      });
  }, []);

  if (!dbLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator color={'red'} size={'large'} />
        <Text>Cargando base de datos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <Suspense
          fallback={
            <SafeAreaView style={styles.loadingContainer}>
              <ActivityIndicator color={'red'} size={'large'} />
              <Text>Cargando base de datos...</Text>
            </SafeAreaView>
          }
        >
          <SQLiteProvider databaseName="turnio.db" useSuspense>
            <TurnoProvider>
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                      iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'TurnosStack') {
                      iconName = focused ? 'briefcase' : 'briefcase-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                  },
                  tabBarActiveTintColor: '#63aac0',
                  tabBarInactiveTintColor: 'gray',
                  tabBarLabelStyle: { marginBottom: 5, fontSize: 10 }, // Add margin to the bottom of the tab labels
                  tabBarStyle: { height: 55 }, // Increase height of the bottom tab bar
                })}
              >
                <Tab.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ title: 'Home' }}
                />
                <Tab.Screen
                  name="TurnosStack"
                  component={TurnosStack}
                  options={{ title: 'Turnos' }}
                />
              </Tab.Navigator>
            </TurnoProvider>
          </SQLiteProvider>
        </Suspense>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
