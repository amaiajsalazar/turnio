import { View, ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { Turno } from "../types";
import { useSQLiteContext } from "expo-sqlite";
import { ListaTurnos } from "../components/ListaTurnos";


export function TurnosScreen() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const insets = useSafeAreaInsets();

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getTurnos();
    });
  });

  async function getTurnos() {
    const result = await db.getAllAsync<Turno>("SELECT * FROM turnos");
    setTurnos(result);
  }

  async function deleteTurno(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM turnos WHERE turno_id = ?", [id]);
      await getTurnos();
    });
  }

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <ListaTurnos turnos={turnos} deleteTurno={deleteTurno} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 15,
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
});