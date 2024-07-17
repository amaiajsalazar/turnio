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
import { TimerPickerModal } from "react-native-timer-picker";

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
    hora_ini: "",
    hora_fin: "",
    color: "",
    abreviatura: "",
    descanso: 0,
    partido: 0,
    hora_ini_partido: null,
    hora_fin_partido: null,
    ingresos_hora: null,
    ingresos_hora_extra: null,
  });

  const [showPicker, setShowPicker] = useState(false);



  const [alarmString, setAlarmString] = useState<string | null>(null);

  const formatTime = ({
    hours,
    minutes,
  }: {
    hours?: number;
    minutes?: number;
  }) => {
    const timeParts = [];

    if (hours !== undefined) {
      timeParts.push(hours.toString().padStart(2, "0"));
    }
    if (minutes !== undefined) {
      timeParts.push(minutes.toString().padStart(2, "0"));
    }

    return timeParts.join(":");
  };


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
        hora_ini: "",
        hora_fin: "",
        color: "",
        abreviatura: "",
        descanso: 0,
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
      <View style={styles.inputBox}>
        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={[styles.inputText, { width: '80%' }]}
          placeholder="Nombre del turno"
          value={newTurno.nombre}
          onChangeText={(value) => handleInputChange("nombre", value)}
        />
      </View>
      <View style={styles.inputBox}>
        <Text style={styles.label}>Hora inicio:</Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowPicker(true)}
          style={[styles.inputText, { width: '25%', marginRight: 10 }]}
        >
          <Text style={{ textAlign: "center", paddingVertical: 7 }}>
            {alarmString || "00:00"}
          </Text>
        </TouchableOpacity>
      </View>
      <TimerPickerModal
        visible={showPicker}
        setIsVisible={setShowPicker}
        onConfirm={(pickedDuration) => {
          setAlarmString(formatTime(pickedDuration));
          setShowPicker(false);
        }}
        modalTitle="Hora de inicio"
        onCancel={() => setShowPicker(false)}
        closeOnOverlayPress
        styles={{
          theme: "dark",
        }}
        confirmButtonText="Confirmar"
        cancelButtonText="Cancelar"
        hideSeconds
        modalProps={{
          overlayOpacity: 0.2,
        }}
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
        value={newTurno.descanso.toString()}
        onChangeText={(value) =>
          handleInputChange("descanso", parseInt(value))
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
    marginRight: 10,
  },
  inputBox: { flexDirection: "row", alignItems: "center", paddingVertical: 10 }
});
