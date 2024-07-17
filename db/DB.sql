CREATE TABLE if not exists Turnos (
    turno_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(255) NOT NULL,
    hora_ini time NOT NULL,
    hora_fin time NOT NULL,
    color VARCHAR(50),
    abreviatura VARCHAR(50),
    descanso time,
    partido BOOLEAN,
    hora_ini_partido time,
    hora_fin_partido time,
    ingresos_hora DECIMAL(10, 2),
    ingresos_hora_extra DECIMAL(10, 2)
);

CREATE TABLE if not exists RegistroTurnos (
    registro_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE NOT NULL,
    turno_id INTEGER NOT NULL,
    FOREIGN KEY (turno_id) REFERENCES Turnos(turno_id)
);

INSERT INTO Turnos (nombre, hora_ini, hora_fin, color, abreviatura, descanso, partido, hora_ini_partido, hora_fin_partido, ingresos_hora, ingresos_hora_extra) VALUES ('Mañana', '08:00', '14:00', '#32a852', 'M', '00:30', false, NULL, NULL, NULL, NULL);
INSERT INTO Turnos (nombre, hora_ini, hora_fin, color, abreviatura, descanso, partido, hora_ini_partido, hora_fin_partido, ingresos_hora, ingresos_hora_extra) VALUES ('Tarde', '14:00', '20:00', '#f7b731', 'T', '00:30', false, NULL, NULL, NULL, NULL);
INSERT INTO Turnos (nombre, hora_ini, hora_fin, color, abreviatura, descanso, partido, hora_ini_partido, hora_fin_partido, ingresos_hora, ingresos_hora_extra) VALUES ('Noche', '21:00', '07:00', '#FF0000', 'N', '00:30', false, NULL, NULL, NULL, NULL);
