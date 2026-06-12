export interface Vehiculo {

  matricula: string;
  marca: string;
  modelo: string;
  tipo_vehiculo: string;
  tipo_combustible: string;
  kilometros: number | null;
  fecha_ultima_revision: string;
  kilometros_ultima_revision: number | null;
  fecha_ultima_itv: string;
  fecha_ultima_tacografo: string;
  plazas_sentados: number | null;
  plazas_sillas: number | null;
  numero_bastidor: string;
  fecha_matriculacion: string;
  centro_asignado: string;
  
}