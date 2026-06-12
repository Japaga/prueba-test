export interface Empleado {
    dni: string;
    nombre: string;
    apellidos: string;
    fecha_nacimiento: string;
    edad: number | null;
    email: string;
    direccion: string;
    telefono: string;
    horas_diarias: number | null;
}