import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

export function HomeScreen() {
  const { width } = Dimensions.get("window");

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const [activeDate, setActiveDate] = useState(new Date());
  const translateX = useRef(new Animated.Value(0)).current;

  const weekDays = ["L", "M", "X", "J", "V", "S", "D"];
  const nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  const generateMatrix = (date) => {
    const matrix = [];
    matrix[0] = weekDays.slice(1).concat(weekDays.slice(0, 1));

    const year = date.getFullYear();
    const month = date.getMonth();
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay + 6) % 7;

    let maxDays = nDays[month];
    if (month === 1) {
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        maxDays += 1;
      }
    }

    let counter = 1;
    for (let row = 1; row < 7; row++) {
      matrix[row] = [];
      for (let col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if (row === 1 && col >= firstDay) {
          matrix[row][col] = counter++;
        } else if (row > 1 && counter <= maxDays) {
          matrix[row][col] = counter++;
        }
      }
    }

    return matrix;
  };

  const updateMatrices = () => {
    const prevDate = new Date(activeDate);
    prevDate.setMonth(activeDate.getMonth() - 1);

    const nextDate = new Date(activeDate);
    nextDate.setMonth(activeDate.getMonth() + 1);

    return {
      prevMatrix: generateMatrix(prevDate),
      currentMatrix: generateMatrix(activeDate),
      nextMatrix: generateMatrix(nextDate),
    };
  };

  const [matrices, setMatrices] = useState(updateMatrices());

  useEffect(() => {
    setMatrices(updateMatrices());
  }, [activeDate]);

  const _onPress = (item) => {
    if (item !== -1) {
      const newDate = new Date(activeDate);
      newDate.setDate(item);
      setActiveDate(newDate);
    }
  };

  const changeMonth = (n) => {
    const newDate = new Date(activeDate);
    newDate.setMonth(activeDate.getMonth() + n);
    setActiveDate(newDate);
  };

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: false }
  );

  const handleGestureEnd = (event) => {
    const { translationX } = event.nativeEvent;
    const swipeThreshold = width * 0.25;

    if (translationX < -swipeThreshold) {
      Animated.timing(translateX, {
        toValue: -width,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        changeMonth(1);
        translateX.setValue(0);
      });
    } else if (translationX > swipeThreshold) {
      Animated.timing(translateX, {
        toValue: width,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        changeMonth(-1);
        translateX.setValue(0);
      });
    } else {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  };

  const renderMatrix = (matrix) =>
    matrix.map((row, rowIndex) => {
      const rowItems = row.map((item, colIndex) => (
        <Text
          key={`item-${rowIndex}-${colIndex}`}
          style={{
            flex: 1,
            height: 18,
            textAlign: "center",
            backgroundColor: rowIndex === 0 ? "#ddd" : "#fff",
            color: colIndex === 6 ? "#a00" : "#000",
            fontWeight: item === activeDate.getDate() ? "bold" : "normal",
          }}
          onPress={() => _onPress(item)}
        >
          {item !== -1 ? item : ""}
        </Text>
      ));

      return (
        <View
          key={`row-${rowIndex}`}
          style={{
            flex: 1,
            flexDirection: "row",
            padding: 15,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          {rowItems}
        </View>
      );
    });

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        onGestureEvent={handleGesture}
        onEnded={handleGestureEnd}
      >
        <Animated.View
          style={[
            styles.container,
            { flexDirection: "row", transform: [{ translateX }] },
          ]}
        >
          <View style={{ width }}>
            <Text style={styles.headerText}>
              {months[(activeDate.getMonth() - 1 + 12) % 12]} &nbsp;
              {new Date(
                activeDate.getFullYear(),
                activeDate.getMonth() - 1
              ).getFullYear()}
            </Text>
            {renderMatrix(matrices.prevMatrix)}
          </View>
          <View style={{ width }}>
            <Text style={styles.headerText}>
              {months[activeDate.getMonth()]} &nbsp;
              {activeDate.getFullYear()}
            </Text>
            {renderMatrix(matrices.currentMatrix)}
          </View>
          <View style={{ width }}>
            <Text style={styles.headerText}>
              {months[(activeDate.getMonth() + 1) % 12]} &nbsp;
              {new Date(
                activeDate.getFullYear(),
                activeDate.getMonth() + 1
              ).getFullYear()}
            </Text>
            {renderMatrix(matrices.nextMatrix)}
          </View>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
});
