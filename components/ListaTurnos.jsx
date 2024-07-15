import { View, ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TurnoCard } from "./TurnoCard";
import { useEffect, useState } from "react";
import { TurnioLogo } from "./TurnioLogo";

export function ListaTurnos() {
  const [turnos, setTurnos] = useState([]);
  const insets = useSafeAreaInsets();

  const turnosEstaticos = [
    {turno_id: 1, nombre: "Mañana", hora_ini: "08:00", hora_fin: "14:00", color: "#32a852", abreviatura: "M", mins_descanso: 30, partido: false, hora_ini_partido: null, hora_fin_partido: null, ingresos_hora: null, ingresos_hora_extra: null},
    {turno_id: 2, nombre: "Tarde", hora_ini: "14:00", hora_fin: "20:00", color: "#f7b731", abreviatura: "T", mins_descanso: 30, partido: false, hora_ini_partido: null, hora_fin_partido: null, ingresos_hora: null, ingresos_hora_extra: null},
    {turno_id: 3, nombre: "Noche", hora_ini: "20:00", hora_fin: "02:00", color: "#e84118", abreviatura: "N", mins_descanso: 30, partido: false, hora_ini_partido: null, hora_fin_partido: null, ingresos_hora: null, ingresos_hora_extra: null},
  ]

  useEffect(() => {
    setTurnos(turnosEstaticos);
  }
  , []);

  return (
    <View style={{paddingTop: insets.top, paddingBottom: insets.bottom}}>
      <View style={{margin:10, alignItems: 'center'}}>
        <TurnioLogo/>
      </View>
        {turnos.length === 0 ? (
          <ActivityIndicator color={"red"} size={"large"}/>
        ) :  ( 
        <View>
          <Text style={styles.title}>Turnos</Text>
          <FlatList style={{
            padding: 10
          }} data={turnos}
            keyExtractor={turno => turno.turno_id}
            renderItem={({item, index}) => <TurnoCard turno={item}/>
          }/>
        </View>
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