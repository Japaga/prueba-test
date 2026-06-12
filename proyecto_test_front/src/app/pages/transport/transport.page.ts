import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonMenuButton, IonModal, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Transporte,BloqueHorario } from 'src/app/models/transport.model';
import { createAnimation } from '@ionic/angular';
import { Empleado } from 'src/app/models/employees.model';
import { Vehiculo } from 'src/app/models/vehicles.model';
import { TurnoKey } from 'src/app/models/transport.model';

@Component({
  selector: 'app-transport',
  templateUrl: './transport.page.html',
  styleUrls: ['./transport.page.scss'],
  standalone: true,
  imports: [IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonButton,
    IonIcon,
    IonGrid,
    IonDatetimeButton,
    IonRow,
    IonCol,
    IonModal,
    IonCard,
    IonCardContent,
    IonDatetime,
    IonItem,
    IonLabel,
    IonInput,
    IonMenuButton,
    IonSelect,
    IonSelectOption,
    IonCardHeader,
    IonCardTitle
  ]
})
export class TransportPage implements OnInit {

  turnos: { key: TurnoKey, label: string }[] = [
  { key: 'Manana', label: 'Mañana' },
  { key: 'MedioDia', label: 'Mediodía' },
  { key: 'Tarde', label: 'Tarde' },
  { key: 'Noche', label: 'Noche' },
  { key: 'Madrugada', label: 'Madrugada' }
];

  transportes: Transporte [] = [];
  empleados: Empleado[] = [];
  vehiculos: Vehiculo[] = [];
  transporte: Transporte = {
    id: null,
    nombre:'',    
    vehiculoAsignado:'',
    empleadoAsignado:'',
     turnos: {
      Manana: { inicio: '', fin: '' },
      MedioDia: { inicio: '', fin: '' },
      Tarde: { inicio: '', fin: '' },
      Noche: { inicio: '', fin: '' },
      Madrugada: { inicio: '', fin: '' }
  }
  };


  diasSemana: string[] = [];
  primerDiaSemana: number = 0;
  diasCalendario: (number | null)[] =[];
  semanasCalendario: (number | null)[][] = [];
  diaSeleccionado: BloqueHorario[] = [];
  diaSeleccionadoNumero:number | null = null;
  editarFormulario: boolean = false;
  fechaActualCalendario: Date = new Date();
  fechaSeleccionada: string | null = null;
  transporteEnEdicion: Transporte | null = null;
  editando: boolean = false;
  mesTexto ='';

  empleadosUrl = environment.api + '/empleados';
  vehiculosUrl = environment.api + '/vehiculos';
  apiUrl = environment.api + '/transportes';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.obtenerEmpleados();
    this.obtenerVehiculos();
    this.obtenerTransportes();
    this.crearCalendario();
    this.crearDiasSemana();
    this.mesTexto = this.obtenerMesActual();
    
  }

  obtenerEmpleados() {
    this.http.get<Empleado[]>(this.empleadosUrl).subscribe(data => {
      this.empleados = data;
    });
  }

  obtenerVehiculos() {
    this.http.get<Vehiculo[]>(this.vehiculosUrl).subscribe( data => {
      this.vehiculos = data;
    })
  }

  getEmpleadoNombre(dni: string): string {
  const empleado = this.empleados.find(e => e.dni === dni);
  return empleado
    ? `${empleado.nombre} ${empleado.apellidos} - Teléfono: ${empleado.telefono}`
    : 'Empleado no asignado';
}

  getVehiculoTexto(matricula: string): string {
  const vehiculo = this.vehiculos.find(v => v.matricula === matricula);
  return vehiculo
    ? `${vehiculo.marca} ${vehiculo.modelo} - Matricula: ${vehiculo.matricula}`
    : 'Vehículo no asignado';
}

  obtenerTransportes() {

  this.http.get<Transporte[]>(this.apiUrl).subscribe({
    next: (data) => {
      console.log('DATA API:', data);
    this.transportes = data.map(t => ({

    id: t.id,
    nombre: t.nombre,
    vehiculoAsignado: t.vehiculoAsignado,
    empleadoAsignado: t.empleadoAsignado,

    turnos: t.turnos ?? {
    Manana: { inicio: '', fin: '' },
    MedioDia: { inicio: '', fin: '' },
    Tarde: { inicio: '', fin: '' },
    Noche: { inicio: '', fin: '' },
    Madrugada: { inicio: '', fin: '' }
  }

}));

  },

  error: (err) => {

    console.error('Error obteniendo transportes', err);

  }

  });

}
  
  guardarTransportes(){
    if (this.editando) {
      this.http.put(`${this.apiUrl}/${this.transporte.id}`, this.mapToApi(this.transporte))
      .subscribe({ 
        next: () => {
        this.resetForm();
        this.obtenerTransportes();
        this.cerrarFormulario();

        console.log('Transporte actualizado');

      },
    
      error: (err) => {

        console.error('Error actualizando:', err);   

    }
  });

    } else {
      this.http.post(this.apiUrl, this.mapToApi(this.transporte))
      .subscribe({
        next: () => {
        this.resetForm();
        this.obtenerTransportes();
        this.cerrarFormulario();
        console.log('Transporte creado');
        },

        error: (err) => {

          console.error('Error creando:',err);

        }


    });
    }
  }

  private mapToApi(transporte:any){
    return {
      nombre: transporte.nombre,
      vehiculoAsignado:transporte.vehiculoAsignado,
      empleadoAsignado:transporte.empleadoAsignado,
      horarioInicioManana:transporte.turnos.Manana.inicio,
      horarioFinManana:transporte.turnos.Manana.fin,
      horarioInicioMedioDia:transporte.turnos.MedioDia.inicio,
      horarioFinMedioDia:transporte.turnos.MedioDia.fin,
      horarioInicioTarde:transporte.turnos.Tarde.inicio,
      horarioFinTarde:transporte.turnos.Tarde.fin,
      horarioInicioNoche:transporte.turnos.Noche.inicio,
      horarioFinNoche:transporte.turnos.Noche.fin,
      horarioInicioMadrugada:transporte.turnos.Madrugada.inicio,
      horarioFinMadrugada:transporte.turnos.Madrugada.fin,
    }
  }

  editar(transporte: Transporte) {

  this.transporte = {

    id: transporte.id,
    nombre: transporte.nombre,
    vehiculoAsignado: transporte.vehiculoAsignado,
    empleadoAsignado: transporte.empleadoAsignado,

    turnos: {

      Manana: {
        inicio: transporte.turnos.Manana.inicio,
        fin: transporte.turnos.Manana.fin
      },

      MedioDia: {
        inicio: transporte.turnos.MedioDia.inicio,
        fin: transporte.turnos.MedioDia.fin
      },

      Tarde: {
        inicio: transporte.turnos.Tarde.inicio,
        fin: transporte.turnos.Tarde.fin
      },

      Noche: {
        inicio: transporte.turnos.Noche.inicio,
        fin: transporte.turnos.Noche.fin
      },

      Madrugada: {
        inicio: transporte.turnos.Madrugada.inicio,
        fin: transporte.turnos.Madrugada.fin
      }

    }

  };

  this.editando = true;
  this.editarFormulario = true;
}

confirmarEliminacion(transporte: Transporte){
  console.log('DNI a eliminar: ', transporte.id)
  if (confirm('¿Seguro que quieres eliminar este transporte?')) {
    this.eliminar(transporte.id!);
  }
}

  eliminar(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({ 
      next: () => {

        this.obtenerTransportes();
        console.log('Eliminado');
      },

      error: (err) => {

        console.log(err);

      }
    });
  }

  resetForm() {
  this.transporte = {
    id:null,
    nombre:'',
    vehiculoAsignado:'',
    empleadoAsignado:'',
    turnos: {
      Manana: { inicio: '', fin: '' },
      MedioDia: { inicio: '', fin: '' },
      Tarde: { inicio: '', fin: '' },
      Noche: { inicio: '', fin: '' },
      Madrugada: { inicio: '', fin: '' }
    }
  };
}

  abrirFormulario(){
    this.resetForm();
    this.editando = false;
    this.editarFormulario = true;
  }

  
  cerrarFormulario(){
    this.editarFormulario = false;
    this.editando = false;
  }

  guardarVehiculo(){}


  getNombreDia(fechaStr: string) {

  return new Date(fechaStr).toLocaleDateString('es-ES', {
    weekday: 'long'
  });

}


  fechaAhora(){

    const ahora: Date = new Date('2026-05-11');
    return ahora.toLocaleString('es-ES', {weekday:'long'});

  }

  crearDiasSemana() {
    this.diasSemana = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sabado',
      'Domingo'
    ];
  }


  crearCalendario() {

  this.semanasCalendario = [];

  const año = this.fechaActualCalendario.getFullYear();
  const mes = this.fechaActualCalendario.getMonth();


  const primerDia = new Date(año, mes, 1);
  const ultimoDia = new Date(año, mes + 1, 0).getDate();

  const primerDiaSemana = (primerDia.getDay() + 6) % 7;

  let dias: (number | null)[] = [];

  for (let i = 0; i < primerDiaSemana; i++) {
    dias.push(null);
  }

  for (let dia = 1; dia <= ultimoDia; dia++) {
    dias.push(dia);
  }

  while (dias.length % 7 !== 0) {
    dias.push(null);
  }

  for (let i = 0; i < dias.length; i += 7) {
    this.semanasCalendario.push(dias.slice(i, i + 7) as (number | null)[]);
  }
}

crearBloquesDia(): string[] {
  const bloques: string[] = [];
  for(let hora = 0; hora < 24; hora++) {
    for(let min of [0,30]) {

      const h = hora.toString().padStart(2,'0');
      const m = min.toString().padStart(2,'0');

      bloques.push(`${h}:${m}`);

    }
  }

  return bloques;

}

crearDia(fecha: string): BloqueHorario[] {
  const horas = this.crearBloquesDia();

  return horas.map(h=> 
    ({hora: h, estado: 'libre'}));
}

seleccionarDia(dia: number){

   if (this.diaSeleccionadoNumero === dia) {

    this.diaSeleccionadoNumero = null;
    this.diaSeleccionado = [];

    return;
  }

  // Seleccionar nuevo día
  this.diaSeleccionadoNumero = dia;

  const año = this.fechaActualCalendario.getFullYear();
  const mes = this.fechaActualCalendario.getMonth();

  const fecha = new Date(año, mes, dia);

  this.fechaSeleccionada = fecha.toISOString();

  this.diaSeleccionado = this.crearDia(fecha.toISOString());
}

enterAnimation = (baseEl: any) => {
  const root = baseEl.shadowRoot;

  const backdropAnimation = createAnimation()
    .addElement(root.querySelector('ion-backdrop'))
    .fromTo('opacity', '0.01', '0.6');

  const wrapperAnimation = createAnimation()
    .addElement(root.querySelector('.modal-wrapper'))
    .keyframes([
      { offset: 0, opacity: '0', transform: 'scale(0.8) translateY(40px)' },
      { offset: 1, opacity: '1', transform: 'scale(1) translateY(0)' }
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(400)
    .addAnimation([backdropAnimation, wrapperAnimation]);

};

leaveAnimation = (baseEl: any) => {
  return this.enterAnimation(baseEl).direction('reverse');
};

mesAnterior() {
  const año = this.fechaActualCalendario.getFullYear();

  const mes = this.fechaActualCalendario.getMonth();

  this.fechaActualCalendario = new Date(año,mes-1,1);

  this.crearCalendario();

  this.mesTexto = this.obtenerMesActual();

}

mesSiguiente() {

  const año = this.fechaActualCalendario.getFullYear();

  const mes = this.fechaActualCalendario.getMonth();

  this.fechaActualCalendario = new Date(año,mes+1,1);

  this.crearCalendario();

  this.mesTexto = this.obtenerMesActual();
}

volverMesActual(){

  this.fechaActualCalendario = new Date();

  this.crearCalendario();

  this.mesTexto = this.obtenerMesActual();

}

obtenerMesActual(){

  return this.fechaActualCalendario.toLocaleDateString(
    'es-ES',
    {
      month:'long',
      year:'numeric'
    }
  );
}

formatearHora(valor: string) {
  if (!valor) return '';

  // Si ya viene en formato HH:mm
  if (valor.length === 5) return valor;

  // Si viene en ISO
  return valor.substring(11, 16);
}

calcularHoras(inicio: string, fin: string): string {
  if (!inicio || !fin) return '';

  const start = new Date(inicio);
  const end = new Date(fin);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return '';
  }

  let diff = end.getTime() - start.getTime();

  if (diff < 0) {
    diff += 24 * 60 * 60 * 1000;
  }

  const totalMinutos = Math.floor(diff / 60000);

  const horas = Math.floor(totalMinutos / 60);
  const minutos = totalMinutos % 60;

  return `${horas}h ${minutos}m`;
}

}
