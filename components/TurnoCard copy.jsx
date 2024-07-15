import { Pressable, StyleSheet, Text, View} from "react-native";
import { IconoTurno } from "./IconoTurno";


export function TurnoCard({turno}) {

  return (
      <View key={turno.turno_id} style={styles.turno}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconoTurno turno={turno} />
          <Pressable style={styles.turno_info} onPress={() => {
          }}>
            <Text style={styles.nombre}>{turno.nombre}</Text>
            <Text style={styles.desc}>
              ({turno.hora_ini} - {turno.hora_fin})
              {turno.partido && `- (${turno.hora_ini_partido} - ${turno.hora_fin_partido})`}
            </Text>
          </Pressable>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  turno: {
    flex:1,
    marginBottom: 15,
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: "#e7e6ed",
    padding: 10,
    borderRadius: 20,
    elevation: 3,
  },

  nombre: {
    fontSize: 20,
    fontWeight: "bold",
  },

  desc: {
    fontSize: 16,
  },

  turno_info:{ 
    marginLeft: 10,
  }
});
