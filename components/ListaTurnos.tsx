import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Turno } from "../types";
import { IconoTurno } from "./IconoTurno";

export function ListaTurnos({
  turnos,
  deleteTurno,
}: {
  turnos: Turno[];
  deleteTurno: (id: number) => Promise<void>;
}) {
  return (
    <View style={{ marginTop: 10 }}>
      {turnos.map((turno) => {
        return (
          <TouchableOpacity
            key={turno.turno_id}
            style={styles.turno}
            onLongPress={() => deleteTurno(turno.turno_id)}
          >
            <IconoTurno turno={turno} />
            <View style={{ paddingLeft: 10 }}>
              <Text style={styles.nombre}>{turno.nombre}</Text>
              <Text>
                ({turno.hora_ini} - {turno.hora_fin})
                {turno.partido !== 0 && (
                  <Text>
                    ({turno.hora_ini_partido} - {turno.hora_fin_partido})
                  </Text>
                )}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  turno: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    backgroundColor: "#dadde3",
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 4,
  },

  nombre: {
    fontSize: 20,
    fontWeight: "bold",
  },

  desc: {
    fontSize: 16,
  },

  turno_info: {
    marginLeft: 10,
  },
});
