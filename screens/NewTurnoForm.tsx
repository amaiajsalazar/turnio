import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { Turno } from "../types";
import {
  useNavigation,
  NavigationProp,
  useRoute,
} from "@react-navigation/native";
import { TimerPickerModal } from "react-native-timer-picker";
import ColorPicker, { Panel5 } from "reanimated-color-picker";
import { useTurno } from "../contexts/TurnoContext";
import { TouchableHighlight } from "react-native-gesture-handler";
import React from "react";

export function NewTurnoForm() {
  const route = useRoute();
  const { turno } = (route.params as { turno?: Turno }) || null;

  const navigation = useNavigation<NavigationProp<any>>();

  const { insertTurno, updateTurno, getMaxOrden, deleteTurno } = useTurno();

  const [partidoSelected, setPartidoSelected] = useState<number>(
    turno && turno.partido ? turno.partido : 0
  );

  const [turnoForm, setTurnoForm] = useState<Turno>({
    turno_id: turno && turno.turno_id ? turno.turno_id : 0,
    nombre: turno && turno.nombre ? turno.nombre : "",
    hora_ini: turno && turno.hora_ini ? turno.hora_ini : "",
    hora_fin: turno && turno.hora_fin ? turno.hora_fin : "",
    color: turno && turno.color ? turno.color : "#bbbbbb",
    abreviatura: turno && turno.abreviatura ? turno.abreviatura : "",
    descanso: turno && turno.descanso ? turno.descanso : "",
    partido: turno && turno.partido ? turno.partido : 0,
    hora_ini_partido:
      turno && turno.hora_ini_partido ? turno.hora_ini_partido : null,
    hora_fin_partido:
      turno && turno.hora_fin_partido ? turno.hora_fin_partido : null,
    ingresos_hora: turno && turno.ingresos_hora ? turno.ingresos_hora : null,
    ingresos_hora_extra:
      turno && turno.ingresos_hora_extra ? turno.ingresos_hora_extra : null,
    orden: turno && turno.orden ? turno.orden : getMaxOrden(),
  });

  //hora_ini, hora_fin, hora_ini_partido, hora_fin_partido, descanso
  const [showPicker, setShowPicker] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
  ]);
  const [alarmStrings, setAlarmStrings] = useState<(string | null)[]>([
    turno ? turno.hora_ini : "00:00",
    turno ? turno.hora_fin : "00:00",
    turno ? turno.hora_ini_partido : null,
    turno ? turno.hora_fin_partido : null,
    turno ? turno.descanso : "00:00",
  ]);

  const [turnoColor, setTurnoColor] = useState<string>(
    turno ? turno.color ?? "#bbbbbb" : "#bbbbbb"
  );
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

  function handleInputChange(key: keyof Turno, value: string | number): void {
    setTurnoForm((prevTurno) => ({
      ...prevTurno,
      [key]: value,
    }));
  }

  async function handleSave() {
    {
      turnoForm.hora_ini = alarmStrings[0] || "00:00";
      turnoForm.hora_fin = alarmStrings[1] || "00:00";
      turnoForm.hora_ini_partido = alarmStrings[2] || null;
      turnoForm.hora_fin_partido = alarmStrings[3] || null;
      turnoForm.partido = partidoSelected;
      turnoForm.descanso = alarmStrings[4] || "0:00";
      turnoForm.color = turnoColor;

      if (turnoForm.turno_id !== 0) {
        await updateTurno(turnoForm);
      } else {
        await insertTurno(turnoForm);
      }
      setTurnoForm({
        turno_id: 0,
        nombre: "",
        hora_ini: "00:00",
        hora_fin: "00:00",
        color: "#bbbbbb",
        abreviatura: "00:00",
        descanso: "00:00",
        partido: 0,
        hora_ini_partido: null,
        hora_fin_partido: null,
        ingresos_hora: null,
        ingresos_hora_extra: null,
        orden: getMaxOrden(),
      });
      navigation.navigate("Turnos");
    }
  }

  function handlePress() {
    setPartidoSelected((prevPartidoSelected) =>
      prevPartidoSelected === 0 ? 1 : 0
    );
  }

  function confirmDelete() {
    Alert.alert(
      "Confirmar Eliminación",
      "¿Estás seguro de que deseas eliminar este turno?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            if (turnoForm.turno_id !== 0) {
              await deleteTurno(turnoForm.turno_id);
              navigation.navigate("Turnos");
            }
          },
        },
      ]
    );
  }

  // Helper functions for picker state management
  const showPickerAtIndex = (index: number) => {
    setShowPicker((prevShowPicker) =>
      prevShowPicker.map((item, i) => (i === index ? true : item))
    );
  };

  const handlePickerConfirm = (
    index: number,
    pickedDuration: { hours?: number; minutes?: number }
  ) => {
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
          style={[styles.inputText, { width: "80%" }]}
          placeholder="Nombre del turno"
          value={turnoForm.nombre}
          onChangeText={(value) => handleInputChange("nombre", value)}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-around",
          marginVertical: 10,
        }}
      >
        <View style={{ width: "50%" }}>
          <Text style={[styles.label, { marginBottom: 6 }]}>Hora inicio:</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => showPickerAtIndex(0)}
            style={[styles.inputText, { marginRight: 10 }]}
          >
            <Text style={styles.timePickerInput}>
              {alarmStrings[0] || "00:00"}
            </Text>
          </TouchableOpacity>
        </View>
        <TimerPickerModal
          visible={showPicker[0]}
          setIsVisible={(value) => handlePickerCancel(0)}
          onConfirm={(pickedDuration) => handlePickerConfirm(0, pickedDuration)}
          modalTitle="Inicio turno"
          onCancel={() => handlePickerCancel(0)}
          closeOnOverlayPress
          styles={{
            theme: "dark",
          }}
          initialValue={{
            hours: parseInt((alarmStrings[0] || "00:00").split(":")[0]),
            minutes: parseInt((alarmStrings[0] || "00:00").split(":")[1]),
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
            style={[styles.inputText, { marginRight: 10 }]}
          >
            <Text style={styles.timePickerInput}>
              {alarmStrings[1] || "00:00"}
            </Text>
          </TouchableOpacity>
        </View>
        <TimerPickerModal
          visible={showPicker[1]}
          setIsVisible={(value) => handlePickerCancel(1)}
          onConfirm={(pickedDuration) => handlePickerConfirm(1, pickedDuration)}
          modalTitle="Fin turno"
          onCancel={() => handlePickerCancel(1)}
          closeOnOverlayPress
          styles={{
            theme: "dark",
          }}
          initialValue={{
            hours: parseInt((alarmStrings[1] || "00:00").split(":")[0]),
            minutes: parseInt((alarmStrings[1] || "00:00").split(":")[1]),
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
            style={[styles.inputText, { marginRight: 10 }]}
          >
            <Text style={styles.timePickerInput}>
              {alarmStrings[4] || "00:00"}
            </Text>
          </TouchableOpacity>
        </View>
        <TimerPickerModal
          visible={showPicker[4]}
          setIsVisible={(value) => handlePickerCancel(4)}
          onConfirm={(pickedDuration) => handlePickerConfirm(4, pickedDuration)}
          modalTitle="Descanso"
          onCancel={() => handlePickerCancel(4)}
          closeOnOverlayPress
          styles={{
            theme: "dark",
          }}
          initialValue={{
            hours: parseInt((alarmStrings[4] || "00:00").split(":")[0]),
            minutes: parseInt((alarmStrings[4] || "00:00").split(":")[1]),
          }}
          confirmButtonText="Confirmar"
          cancelButtonText="Cancelar"
          hideSeconds
          modalProps={{
            overlayOpacity: 0.2,
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        <Text style={styles.label}>Turno partido? </Text>
        <TouchableOpacity style={styles.container} onPress={handlePress}>
          <View style={[styles.checkbox, partidoSelected && styles.checked]}>
            {partidoSelected ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          {partidoSelected ? <Text style={styles.label}></Text> : null}
        </TouchableOpacity>
      </View>
      {partidoSelected ? (
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "space-around",
            marginVertical: 10,
          }}
        >
          <View style={{ width: "50%" }}>
            <Text style={[styles.label, { marginBottom: 6 }]}>
              Hora inicio:
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => showPickerAtIndex(2)}
              style={[styles.inputText, { marginRight: 10 }]}
            >
              <Text style={styles.timePickerInput}>
                {alarmStrings[2] || "00:00"}
              </Text>
            </TouchableOpacity>
          </View>
          <TimerPickerModal
            visible={showPicker[2]}
            setIsVisible={(value) => handlePickerCancel(2)}
            onConfirm={(pickedDuration) =>
              handlePickerConfirm(2, pickedDuration)
            }
            modalTitle="Inicio partido"
            onCancel={() => handlePickerCancel(2)}
            closeOnOverlayPress
            styles={{
              theme: "dark",
            }}
            initialValue={{
              hours: parseInt((alarmStrings[2] || "00:00").split(":")[0]),
              minutes: parseInt((alarmStrings[2] || "00:00").split(":")[1]),
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
              style={[styles.inputText, { marginRight: 10 }]}
            >
              <Text style={styles.timePickerInput}>
                {alarmStrings[3] || "00:00"}
              </Text>
            </TouchableOpacity>
          </View>
          <TimerPickerModal
            visible={showPicker[3]}
            setIsVisible={(value) => handlePickerCancel(3)}
            onConfirm={(pickedDuration) =>
              handlePickerConfirm(3, pickedDuration)
            }
            modalTitle="Fin partido"
            onCancel={() => handlePickerCancel(3)}
            closeOnOverlayPress
            styles={{
              theme: "dark",
            }}
            initialValue={{
              hours: parseInt((alarmStrings[3] || "00:00").split(":")[0]),
              minutes: parseInt((alarmStrings[3] || "00:00").split(":")[1]),
            }}
            confirmButtonText="Confirmar"
            cancelButtonText="Cancelar"
            hideSeconds
            modalProps={{
              overlayOpacity: 0.2,
            }}
          />
        </View>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Text style={styles.label}>Abreviatura:</Text>
          <TextInput
            style={[styles.inputText, { textAlign: "center" }]}
            value={turnoForm.abreviatura}
            onChangeText={(value) => handleInputChange("abreviatura", value)}
            maxLength={1}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.label}>Color:</Text>
          <TouchableOpacity onPress={() => setShowModal(true)}>
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
      <Modal visible={showModal} animationType="fade" transparent={true}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ColorPicker
              style={{ justifyContent: "center" }}
              value="red"
              onComplete={onSelectColor}
            >
              <Panel5 />
            </ColorPicker>
            <Button title="Ok" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity
          style={{ paddingVertical: 10, width: "40%" }}
          onPress={() => navigation.navigate("Turnos")} // Step 3
        >
          <View
            style={{
              backgroundColor: "#62aac0",
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              CANCELAR
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ paddingVertical: 10, width: "40%" }}
          onPress={handleSave}
        >
          <View
            style={{
              backgroundColor: "#054b7f",
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
              }}
            >
              GUARDAR
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.delContainer}>
        <TouchableHighlight
          style={styles.delBtn}
          underlayColor="#DDDDDD"
          onPress={deleteTurno(turnoForm.turno_id)}
        >
          <Text style={{ color: "red", fontWeight: "800" }}>🗑️ Borrar</Text>
        </TouchableHighlight>
      </View> */}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%", // Adjust width as needed
  },
  delBtn: {
    textAlign: "center",
    marginVertical: 20,
    backgroundColor: "#f1a2a8",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  delContainer: {
    justifyContent: "center", // Align children vertically in the center
    alignItems: "center", // Align children horizontally in the center
  },
});
