import { View, StyleSheet } from "react-native";
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
  }, [db]);

  async function getTurnos() {
    const result = await db.getAllAsync<Turno>("SELECT * FROM turnos");
    console.log(result);
    setTurnos(result);
  }

  async function deleteTurno(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM turnos WHERE turno_id = ?", [id]);
      await getTurnos();
    });
  }

  async function insertTurno(newTurno: Turno) {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        "INSERT INTO Turnos (nombre, hora_ini, hora_fin, color, abreviatura, mins_descanso, partido, hora_ini_partido, hora_fin_partido, ingresos_hora, ingresos_hora_extra) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);",
        [
          newTurno.nombre,
          newTurno.hora_ini,
          newTurno.hora_fin,
          newTurno.color,
          newTurno.abreviatura,
          newTurno.mins_descanso,
          newTurno.partido,
          newTurno.hora_ini_partido,
          newTurno.hora_fin_partido,
          newTurno.ingresos_hora,
          newTurno.ingresos_hora_extra,
        ]
      );
      // await db.runAsync("INSERT INTO Turnos (nombre, hora_ini, hora_fin, color, abreviatura, mins_descanso, partido, hora_ini_partido, hora_fin_partido, duracion_total, ingresos_hora, ingresos_hora_extra) VALUES (?,?,?,?,?,?,?,?,?,?,?,?);", ['Tarde', '14:00', '20:00', '#f7b731', 'T', 30, false, null, null, null, null, null]);
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
