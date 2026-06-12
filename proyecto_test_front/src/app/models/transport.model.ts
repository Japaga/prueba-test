export interface Transporte {
    id: number | null;
    nombre: string;    
    vehiculoAsignado: string;
    empleadoAsignado: string;

    turnos: {
    Manana: Turno;
    MedioDia: Turno;
    Tarde: Turno;
    Noche: Turno;
    Madrugada: Turno;

  };
}

export type TurnoKey =
  | 'Manana'
  | 'MedioDia'
  | 'Tarde'
  | 'Noche'
  | 'Madrugada'

export interface Turno {

  inicio: string;
  fin: string;

}

export interface BloqueHorario {
    hora:string;
    estado: 'libre' | 'ocupado';
    vehiculo?: string;
    empleado?: string;
}