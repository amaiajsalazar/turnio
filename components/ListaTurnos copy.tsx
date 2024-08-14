import { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { Turno } from "../types";
import { IconoTurno } from "./IconoTurno";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useTurno } from "../contexts/TurnoContext";
import { Swipeable } from "react-native-gesture-handler";
import React = require("react");

export function ListaTurnos({
  turnos,
}: {
  turnos: Turno[];
  deleteTurno: (id: number) => Promise<void>;
}) {
  const [data, setData] = useState(turnos);
  const navigation = useNavigation<NavigationProp<any>>();
  const { updateTurnoOrden } = useTurno();

  const renderRightActions = (turnoId) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => deleteTurno(turnoId)}
    >
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  // Synchronize the local state with the turnos prop when it changes
  useEffect(() => {
    setData(turnos);
  }, [turnos]);

  const onDragEnd = async ({ data }) => {
    setData(data);
    for (let index = 0; index < data.length; index++) {
      const turno = data[index];
      await updateTurnoOrden(turno.turno_id, index);
    }
  };

  const renderItem = ({ item, drag, isActive }) => {
    return (
      <View
        style={[
          styles.turno,
          { backgroundColor: isActive ? "#f0f0f0" : "#dadde3" },
        ]}
      >
        <TouchableOpacity
          style={styles.content}
          onPress={() => navigation.navigate("NewTurnoForm", { turno: item })}
        >
          <IconoTurno turno={item} />
          <View style={{ paddingLeft: 10 }}>
            <Text style={styles.nombre}>{item.nombre}</Text>
            <Text>
              ({item.hora_ini} - {item.hora_fin})
              {item.partido !== 0 && (
                <Text>
                  ({item.hora_ini_partido} - {item.hora_fin_partido})
                </Text>
              )}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onLongPress={drag} style={styles.dragHandle}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ marginTop: 10 }}>
      <DraggableFlatList
        data={data} // The array of items to render and sort
        onDragEnd={onDragEnd} // Update state with new order
        keyExtractor={(item) => item.turno_id.toString()} // Unique key for each item
        renderItem={renderItem} // Function to render each item
      />
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
  content: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
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
  dragHandle: {
    padding: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
function deleteTurno(turnoId: any): void {
  throw new Error("Function not implemented.");
}
