import React, { createContext, useContext, useState, useEffect } from "react";
import { useSQLiteContext } from "expo-sqlite";

const TurnoContext = createContext();

export const TurnoProvider = ({ children }) => {
  const [turnos, setTurnos] = useState([]);
  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getTurnos();
    });
  }, [db]);

  const getTurnos = async () => {
    const result = await db.getAllAsync("SELECT * FROM turnos order by orden");
    setTurnos(result);
    // console.log(result);
  };

  const getMaxOrden = async () => {
    const result = await db.getAsync("SELECT MAX(orden) AS maxOrden FROM turnos");
    const maxOrden = result.maxOrden || 0;
    return maxOrden + 1;
  };

  const insertTurno = async (newTurno) => {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        "INSERT INTO Turnos (nombre, hora_ini, hora_fin, color, abreviatura, descanso, partido, hora_ini_partido, hora_fin_partido, ingresos_hora, ingresos_hora_extra) VALUES (?,?,?,?,?,?,?,?,?,?,?);",
        [
          newTurno.nombre,
          newTurno.hora_ini,
          newTurno.hora_fin,
          newTurno.color,
          newTurno.abreviatura,
          newTurno.descanso,
          newTurno.partido,
          newTurno.hora_ini_partido,
          newTurno.hora_fin_partido,
          newTurno.ingresos_hora,
          newTurno.ingresos_hora_extra,
        ]
      );
      await getTurnos();
    });
  };

  const updateTurno = async (updatedTurno) => {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        "UPDATE turnos SET nombre = ?, hora_ini = ?, hora_fin = ?, color = ?, abreviatura = ?, descanso = ?, partido = ?, hora_ini_partido = ?, hora_fin_partido = ?, ingresos_hora = ?, ingresos_hora_extra = ? WHERE turno_id = ?",
        [
          updatedTurno.nombre,
          updatedTurno.hora_ini,
          updatedTurno.hora_fin,
          updatedTurno.color,
          updatedTurno.abreviatura,
          updatedTurno.descanso,
          updatedTurno.partido,
          updatedTurno.hora_ini_partido,
          updatedTurno.hora_fin_partido,
          updatedTurno.ingresos_hora,
          updatedTurno.ingresos_hora_extra,
          updatedTurno.turno_id,
        ]
      );
      await getTurnos();
    });
  };

  const deleteTurno = async (id) => {
    await db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM turnos WHERE turno_id = ?", [id]);
      await getTurnos();
    });
  };

  const updateTurnoOrden = async (turnoId, newOrden) => {
    await db.withTransactionAsync(async () => {
      await db.runAsync("UPDATE turnos set orden = ? where turno_id = ?", [newOrden, turnoId]);
      await getTurnos();
      console.log("turno: " + turnoId + " new orden:" + newOrden);
    });

  };

  return (
    <TurnoContext.Provider
      value={{ turnos, insertTurno, deleteTurno, updateTurno, getMaxOrden, updateTurnoOrden }}
    >
      {children}
    </TurnoContext.Provider>
  );
};

export const useTurno = () => useContext(TurnoContext);
