import { View, StyleSheet, TouchableHighlight, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ListaTurnos } from "../components/ListaTurnos";
import React, { useEffect, useState } from "react";
import { useTurno } from "../contexts/TurnoContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";

export function TurnosScreen() {
  const insets = useSafeAreaInsets();
  const { turnos, deleteTurno } = useTurno();
  const [sortedTurnos, setSortedTurnos] = useState(turnos);

  useEffect(() => {
    setSortedTurnos(turnos);
  }, [turnos]);

  return (
    <>
      <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <ListaTurnos turnos={sortedTurnos} deleteTurno={deleteTurno} />
      </View>
      <TurnoAddBtn />
    </>
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
          navigation.navigate("NewTurnoForm", { turno: null });
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
});
