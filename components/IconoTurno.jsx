import { StyleSheet, View, Text } from "react-native";
export function IconoTurno({turno}){
    return (<View style={[styles.circle, {backgroundColor: turno.color}]}>
        <Text style={styles.letter}>{turno.abreviatura}</Text>
    </View>);
}

const styles = StyleSheet.create({
    circle: {
        width: 50,
        height: 50,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
    },
    letter: {
        color: "white",
        fontSize: 20,
    },
});