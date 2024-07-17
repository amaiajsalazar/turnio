import {
  View,
  TouchableHighlight,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import { Turno } from "../types";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { TimerPickerModal } from "react-native-timer-picker";
import { ScrollView } from 'react-native-gesture-handler';
import React from "react";
import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';


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

  const [showPicker, setShowPicker] = useState<boolean[]>([false, false, false, false, false]);
  const [alarmStrings, setAlarmStrings] = useState<(string | null)[]>([null, null, null, null, null]);
  const [turnoColor, setTurnoColor] = useState<string>("#bbbbbb");
  const [showModal, setShowModal] = useState(false);

  const onSelectColor = ({ hex }) => {
    // do something with the selected color.
    setTurnoColor(hex);
  };
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

  // Helper functions for picker state management
  const showPickerAtIndex = (index: number) => {
    setShowPicker((prevShowPicker) =>
      prevShowPicker.map((item, i) => (i === index ? true : item))
    );
  };

  const handlePickerConfirm = (index: number, pickedDuration: { hours?: number; minutes?: number }) => {
    setAlarmStrings((prevAlarmStrings) =>
      prevAlarmStrings.map((item, i) =>
        i === index ? formatTime(pickedDuration) : item
      )
    );
    setShowPicker((prevShowPicker) =>
      prevShowPicker.map((item, i) => (i === index ? false : item))
    );
  };

  const handlePickerCancel = (index: number) => {
    setShowPicker((prevShowPicker) =>
      prevShowPicker.map((item, i) => (i === index ? false : item))
    );
  };

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
      <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "space-around", marginVertical: 10 }}>
        <View style={{ width: "50%" }}>
          <Text style={[styles.label, { marginBottom: 6 }]}>Hora inicio:</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => showPickerAtIndex(0)}
            style={[styles.inputText, { marginRight: 10 }]}
          >
            <Text style={styles.timePickerInput}>{alarmStrings[0] || "00:00"}</Text>
          </TouchableOpacity>
        </View>
        <TimerPickerModal
          visible={showPicker[0]}
          setIsVisible={(value) => handlePickerCancel(0)}
          onConfirm={(pickedDuration) => handlePickerConfirm(0, pickedDuration)}
          modalTitle="Hora de inicio"
          onCancel={() => handlePickerCancel(0)}
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
        <View style={{ width: "50%" }}>
          <Text style={[styles.label, { marginBottom: 6 }]}>Hora fin:</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => showPickerAtIndex(1)}
            style={[styles.inputText, { marginRight: 10 }]}>
            <Text style={styles.timePickerInput}>{alarmStrings[1] || "00:00"}</Text>
          </TouchableOpacity>
        </View>
        <TimerPickerModal
          visible={showPicker[1]}
          setIsVisible={(value) => handlePickerCancel(1)}
          onConfirm={(pickedDuration) => handlePickerConfirm(1, pickedDuration)}
          modalTitle="Hora de inicio"
          onCancel={() => handlePickerCancel(1)}
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
      </View>
      <View>
        <View style={{ width: "50%" }}>
          <Text style={[styles.label, { marginBottom: 6 }]}>Descanso:</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => showPickerAtIndex(4)}
            style={[styles.inputText, { marginRight: 10 }]}>
            <Text style={styles.timePickerInput}>{alarmStrings[4] || "00:00"}</Text>
          </TouchableOpacity>
        </View>
        <TimerPickerModal
          visible={showPicker[4]}
          setIsVisible={(value) => handlePickerCancel(4)}
          onConfirm={(pickedDuration) => handlePickerConfirm(4, pickedDuration)}
          modalTitle="Hora de inicio"
          onCancel={() => handlePickerCancel(4)}
          closeOnOverlayPress
          styles={{
            theme: "dark",
          }}
          confirmButtonText="Confirmar"
          cancelButtonText="Cancelar"
          hideSeconds
          modalProps={{
            overlayOpacity: 0.2,
          }} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, marginBottom: 10 }}>
        <Text style={styles.label}>Turno partido? </Text>
        <TouchableOpacity style={styles.container} onPress={handlePress}>
          <View style={[styles.checkbox, partidoSelected && styles.checked]}>
            {partidoSelected ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          {partidoSelected ? <Text style={styles.label}></Text> : null}
        </TouchableOpacity>
      </View>
      {partidoSelected ? (
        <View style={{ flexDirection: "row", alignContent: "center", justifyContent: "space-around", marginVertical: 10 }}>
          <View style={{ width: "50%" }}>
            <Text style={[styles.label, { marginBottom: 6 }]}>Hora inicio:</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => showPickerAtIndex(2)}
              style={[styles.inputText, { marginRight: 10 }]}
            >
              <Text style={styles.timePickerInput}>{alarmStrings[2] || "00:00"}</Text>
            </TouchableOpacity>
          </View>
          <TimerPickerModal
            visible={showPicker[2]}
            setIsVisible={(value) => handlePickerCancel(2)}
            onConfirm={(pickedDuration) => handlePickerConfirm(2, pickedDuration)}
            modalTitle="Hora de inicio"
            onCancel={() => handlePickerCancel(2)}
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
          <View style={{ width: "50%" }}>
            <Text style={[styles.label, { marginBottom: 6 }]}>Hora fin:</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => showPickerAtIndex(3)}
              style={[styles.inputText, { marginRight: 10 }]}>
              <Text style={styles.timePickerInput}>{alarmStrings[3] || "00:00"}</Text>
            </TouchableOpacity>
          </View>
          <TimerPickerModal
            visible={showPicker[3]}
            setIsVisible={(value) => handlePickerCancel(3)}
            onConfirm={(pickedDuration) => handlePickerConfirm(3, pickedDuration)}
            modalTitle="Hora de inicio"
            onCancel={() => handlePickerCancel(3)}
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
        </View>
      ) : null
      }
      <View style={{ flexDirection: "row", marginVertical: 10, alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
          <Text style={styles.label}>Abreviatura:</Text>
          <TextInput
            style={styles.inputText}
            value={newTurno.abreviatura}
            onChangeText={(value) => handleInputChange("abreviatura", value)}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.label}>Color:</Text>
          <TouchableOpacity
            onPress={() => setShowModal(true)}>
            <View
              style={{
                width: 45,
                height: 45,
                backgroundColor: turnoColor,
                borderRadius: 25,
                elevation: 2,
              }}
            ></View>
          </TouchableOpacity>
        </View>
      </View>
      <Modal visible={showModal} animationType='slide' transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ColorPicker style={{ justifyContent: "center" }} value='red' onComplete={onSelectColor}>
              {/* Pass onSelectColor to Swatches to handle color selection */}
              <Swatches onSelect={(color) => {
                onSelectColor(color); // Handle color selection
                setShowModal(false); // Close the modal
              }} />
            </ColorPicker>
            {/* Removed the Ok button since it's no longer needed */}
          </View>
        </View>
      </Modal>

      <Button title="Save" onPress={handleSave} />
    </View >
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
  inputBox: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  timePickerInput: { textAlign: "center", paddingVertical: 5 },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Adjust width as needed
  },
});
