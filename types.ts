export interface RegistroTurno {
    registro_id: number;
    fecha: number;
    turno_id: number;
}
export interface Turno {
    turno_id: number;
    nombre: string;
    hora_ini: number; // use 'string' for time
    hora_fin: string; // use 'string' for time
    color: string;
    abreviatura: string;
    mins_descanso: number;
    partido: number;
    hora_ini_partido: string | null; // use 'string | null' for optional time
    hora_fin_partido: string | null; // use 'string | null' for optional time
    ingresos_hora: number | null;
    ingresos_hora_extra: number | null;
}
