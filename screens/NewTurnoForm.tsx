import {
  View,
  TouchableHighlight,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { Turno } from "../types";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation, NavigationProp } from "@react-navigation/native";

export function NewTurnoForm({
  insertTurno,
}: {
  insertTurno(turno: Turno): Promise<void>;
}) {
  const insets = useSafeAreaInsets();

  const [isAddingTurno, setIsAddingTurno] = useState<boolean>(false);
  const [partidoSelected, setPartidoSelected] = useState<number>(0);
  const [newTurno, setNewTurno] = useState<Turno>({
    turno_id: 0,
    nombre: "",
    hora_ini: 0,
    hora_fin: "",
    color: "",
    abreviatura: "",
    mins_descanso: 0,
    partido: 0,
    hora_ini_partido: null,
    hora_fin_partido: null,
    ingresos_hora: null,
    ingresos_hora_extra: null,
  });

  const db = useSQLiteContext();

  function handleInputChange(key: keyof Turno, value: string | number): void {
    setNewTurno((prevTurno) => ({
      ...prevTurno,
      [key]: value,
    }));
  }

  async function handleSave() {
    {
      console.log(newTurno);
      await insertTurno(newTurno);
      setNewTurno({
        turno_id: 0,
        nombre: "",
        hora_ini: 0,
        hora_fin: "",
        color: "",
        abreviatura: "",
        mins_descanso: 0,
        partido: 0,
        hora_ini_partido: null,
        hora_fin_partido: null,
        ingresos_hora: null,
        ingresos_hora_extra: null,
      });
      setIsAddingTurno(false);
    }
  }

  function handlePress() {
    setPartidoSelected((prevPartidoSelected) =>
      prevPartidoSelected === 0 ? 1 : 0
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={styles.label}>Nombre:</Text>
      <TextInput
        style={styles.inputText}
        placeholder="Nombre del turno"
        value={newTurno.nombre}
        onChangeText={(value) => handleInputChange("nombre", value)}
      />
      <Text style={styles.label}>Hora inicio:</Text>
      <TextInput
        placeholder="Hora Inicio"
        value={newTurno.hora_ini.toString()}
        onChangeText={(value) => handleInputChange("hora_ini", parseInt(value))}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Hora fin:</Text>
      <TextInput
        placeholder="Hora Fin"
        value={newTurno.hora_fin}
        onChangeText={(value) => handleInputChange("hora_fin", value)}
      />
      <Text style={styles.label}>Color:</Text>
      <TextInput
        placeholder="Color"
        value={newTurno.color}
        onChangeText={(value) => handleInputChange("color", value)}
      />
      <Text style={styles.label}>Abreviatura:</Text>
      <TextInput
        placeholder="Abreviatura"
        style={styles.inputText}
        value={newTurno.abreviatura}
        onChangeText={(value) => handleInputChange("abreviatura", value)}
      />
      <Text style={styles.label}>Minutos de descanso:</Text>
      <TextInput
        placeholder="Minutos Descanso"
        value={newTurno.mins_descanso.toString()}
        onChangeText={(value) =>
          handleInputChange("mins_descanso", parseInt(value))
        }
        keyboardType="numeric"
      />
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.label}>Turno Partido? </Text>
        <TouchableOpacity style={styles.container} onPress={handlePress}>
          <View style={[styles.checkbox, partidoSelected && styles.checked]}>
            {partidoSelected ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          {partidoSelected ? <Text style={styles.label}></Text> : null}
        </TouchableOpacity>
      </View>
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

export function TurnoAddBtn() {
  const navigation = useNavigation<NavigationProp<any>>();

  return (
    <View style={styles.addBtnView}>
      <TouchableHighlight
        underlayColor="#044b7f"
        style={styles.addBtn}
        onPress={() => {
          navigation.navigate("NewTurnoForm");
        }}
      >
        <Text style={styles.addBtnText}>+</Text>
      </TouchableHighlight>
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
  inputText: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    fontSize: 16,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 8,
  },
  checked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  checkmark: {
    color: "white",
  },
  label: {
    fontSize: 16,
  },
});
