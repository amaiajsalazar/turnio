import { View, ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TurnoCard } from "./TurnoCard";
import { useEffect, useState } from "react";
import { Turno } from "../types";
import { useSQLiteContext } from "expo-sqlite";


export function ListaTurnos() {
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
    console.log(result)
  }


  // const turnosEstaticos = [
  //   { turno_id: 1, nombre: "Mañana", hora_ini: "08:00", hora_fin: "14:00", color: "#32a852", abreviatura: "M", descanso: 30, partido: false, hora_ini_partido: null, hora_fin_partido: null, ingresos_hora: null, ingresos_hora_extra: null },
  //   { turno_id: 2, nombre: "Tarde", hora_ini: "14:00", hora_fin: "20:00", color: "#f7b731", abreviatura: "T", descanso: 30, partido: false, hora_ini_partido: null, hora_fin_partido: null, ingresos_hora: null, ingresos_hora_extra: null },
  //   { turno_id: 3, nombre: "Noche", hora_ini: "20:00", hora_fin: "02:00", color: "#e84118", abreviatura: "N", descanso: 30, partido: false, hora_ini_partido: null, hora_fin_partido: null, ingresos_hora: null, ingresos_hora_extra: null },
  // ]

  // useEffect(() => {
  //   setTurnos(turnosEstaticos);
  // }
  //   , []);

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>

      {turnos.length === 0 ? (
        <ActivityIndicator color={"red"} size={"large"} />
      ) : (
        <FlatList style={{
          padding: 10
        }} data={turnos}
          keyExtractor={turno => turno.turno_id}
          renderItem={({ item, index }) => <TurnoCard turno={item} />
          } />
      )}
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