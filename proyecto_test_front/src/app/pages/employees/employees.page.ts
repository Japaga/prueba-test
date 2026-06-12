import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonGrid, IonRow, IonCol, IonContent, IonDatetime, IonHeader, IonTitle, IonToolbar, IonDatetimeButton, IonModal, IonText, IonIcon, IonMenu, IonButtons, createAnimation, IonMenuButton, IonSearchbar } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IonItem, IonInput, IonButton, IonList, IonLabel} from '@ionic/angular/standalone';
import { Empleado } from 'src/app/models/employees.model';
import { MenuController } from '@ionic/angular/standalone';
import { NgxMaskDirective } from 'ngx-mask';
@Component({
  selector: 'app-employees',
  templateUrl: './employees.page.html',
  styleUrls: ['./employees.page.scss'],
  standalone: true,
  imports: [
  NgxMaskDirective,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonList,
  IonMenu,
  IonInput,
  IonButton,
  IonButtons,
  IonLabel,
  IonDatetime,
  IonModal,
  IonText,
  IonDatetimeButton,
  CommonModule,
  IonMenuButton, 
  FormsModule,
  IonSearchbar
]
})
export class EmployeesPage implements OnInit {
  
  empleados: Empleado[] = [];
  empleado: Empleado = {
    dni: '',
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    edad: null,
    direccion: '',
    telefono: '',
    email: '',
    horas_diarias: null,
  
  
  };
  dniOriginal: string = '';
  editando: boolean = false;
  mostrarFormulario: boolean = false;
  filtroBusqueda: string = '';
  empleadosFiltrados: Empleado[] = [];
  
  apiUrl = environment.api + '/empleados';

  constructor(private http: HttpClient, private menuCtrl: MenuController) {}

  ngOnInit() {
    this.obtenerEmpleados();
    
  }

  abrirFormulario() {  
  this.resetForm();
  this.editando = false ;
  this.mostrarFormulario = true;

}

  editarFormulario() {
  this.mostrarFormulario = !this.mostrarFormulario;
  this.editando = true;
  
}

  cerrarFormulario() {
  this.mostrarFormulario = false;
  this.editando = false;
}

  obtenerEmpleados(){
    this.http.get<Empleado[]>(this.apiUrl).subscribe(data => {
      this.empleados = data;
      this.empleadosFiltrados = data;
    })
  }

 onDateChange(ev: CustomEvent) {
  const fecha = new Date(ev.detail.value);
  const hoy = new Date();

  let edad = hoy.getFullYear() - fecha.getFullYear();
  const m = hoy.getMonth() - fecha.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
    edad--;
  }

  this.empleado.fecha_nacimiento = ev.detail.value;
  this.empleado.edad = edad;

  //modal.dismiss();
}

formatearFecha(fecha: string): string {
  if (!fecha) return '';

  const f = new Date(fecha);

  const dia = String(f.getDate()).padStart(2, '0');
  const mes = String(f.getMonth() + 1).padStart(2, '0');
  const anio = f.getFullYear();

  return `${dia}/${mes}/${anio}`;
}

    saveEmpleado(data: Empleado) {
  const url = this.editando
    ? `${this.apiUrl}/${this.dniOriginal}`
    : this.apiUrl;

  return this.editando
    ? this.http.put(url, data)
    : this.http.post(url, data);
}

validarDNI(dni: string): boolean {
  const regex = /^\d{8}[A-Z]$/;

  if (!regex.test(dni)) return false;

  const numero = parseInt(dni.substring(0, 8), 10);
  const letra = dni.charAt(8);

  const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
  const letraCorrecta = letras[numero % 23];

  return letra === letraCorrecta;
}

  guardarEmpleado() {

  const data = {...this.empleado};

  if (!this.validarDNI(this.empleado.dni)) {
    alert('DNI inválido');
    return;
  }
  if (!this.empleado.nombre || !this.empleado.dni) {
    alert('Nombre y DNI son obligatorios');
    return;
  }

  this.saveEmpleado(data).subscribe({
    next: () => {
      alert(this.editando ? 'Empleado actualizado' : 'Empleado creado');
      this.resetForm();
      this.obtenerEmpleados();
      this.mostrarFormulario = false;
    },

    error: (err) => {console.log(err);
      if (err.status === 409) {
        alert('El DNI ya está registrado');
      } else {
    alert('Error en la operación')
    }
   }
  });
  
}

resetForm() {
  this.empleado = {
    dni: '',
    nombre: '',
    apellidos: '',
    fecha_nacimiento: '',
    edad: null,
    direccion: '',
    telefono: '',
    email: '',
    horas_diarias: null,
  };

  this.editando = false;
  
}

editar(empleado: Empleado) {
  this.dniOriginal = empleado.dni;

  const fecha = empleado.fecha_nacimiento
    ? new Date(empleado.fecha_nacimiento)
    : null;

  let edad = 0;

  if (fecha) {
    const hoy = new Date();

    edad = hoy.getFullYear() - fecha.getFullYear();

    const m = hoy.getMonth() - fecha.getMonth();

    if (m < 0 || (m === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
  }

  this.empleado = {
    ...empleado,
    edad: edad,
    fecha_nacimiento: empleado.fecha_nacimiento
      ? new Date(empleado.fecha_nacimiento).toISOString().split('T')[0]
      : ''
  };

  this.editando = true;
  this.mostrarFormulario = true;
}

confirmarEliminacion(empleado: Empleado){
  console.log('DNI a eliminar: ', empleado.dni)
  if (confirm('¿Seguro que quieres eliminar este empleado?')) {
    this.eliminar(empleado.dni);
  }
}

eliminar(dni:string){
  this.http.delete(`${this.apiUrl}/${dni}`).subscribe({
  next: () => {
    alert('Empleado eliminado correctamente')
    this.obtenerEmpleados()},
  error: () => alert('Error al eliminar empleado')
});

}

filtrarEmpleados() {
  const valor = this.filtroBusqueda.toLowerCase();

  this.empleadosFiltrados = this.empleados.filter(emp =>
    emp.nombre.toLowerCase().includes(valor) ||
    emp.apellidos.toLowerCase().includes(valor) ||
    emp.dni.toLowerCase().includes(valor)
  );
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



}


