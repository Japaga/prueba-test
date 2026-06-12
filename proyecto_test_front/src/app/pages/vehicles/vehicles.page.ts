import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSelect, IonSelectOption, IonButton, createAnimation, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonMenuButton, IonRow, IonTitle, IonToolbar, IonModal, IonDatetime, IonList, IonSearchbar } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Vehiculo } from 'src/app/models/vehicles.model';
import { AlertController } from '@ionic/angular';
@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.page.html',
  styleUrls: ['./vehicles.page.scss'],
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
    IonRow,
    IonCol,
    IonItem,
    IonLabel,
    IonInput,
    IonMenuButton,
    IonModal,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonList,
    IonSearchbar
  ]
})
export class VehiclesPage implements OnInit {

  vehiculos: Vehiculo[] = [];
  vehiculo: Vehiculo = {
  matricula: '',
  marca: '',
  modelo: '',
  tipo_vehiculo: '',
  tipo_combustible: '',
  kilometros: null,
  fecha_ultima_revision: '',
  kilometros_ultima_revision: null,
  fecha_ultima_itv: '',
  fecha_ultima_tacografo: '',
  plazas_sentados: null,
  plazas_sillas: null,
  numero_bastidor: '',
  fecha_matriculacion: '',
  centro_asignado: '',  
  }   

  tiposVehiculos: string[]=[
    'Turismo',
    'Furgoneta',
    'Furgoneta Adaptada',
    'Microbús',
    'Microbús Adaptado',
    'Autobús',
    'Autobús Adaptado',
    'Camión'
  ];

  tiposCombustible: string[]=[
    'Gasolina',
    'Diesel',
    'GPL',
    'Eléctrico'
  ];

  matriculaOriginal: string = '';
  editando: boolean = false; 
  mostrarFormulario: boolean = false; 
  textoBusqueda: string = '';
  vehiculosFiltrados: Vehiculo[] = []; 

  apiUrl = environment.api + '/vehiculos';

  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.obtenerVehiculos();
  }

  obtenerVehiculos() {
    this.http.get<Vehiculo[]>(this.apiUrl).subscribe(data => { 
      this.vehiculos = data;
      this.vehiculosFiltrados = data;
    });
  }

  filtrarVehiculos() {
  const texto = this.textoBusqueda.toLowerCase().trim();

  if (!texto) {
    this.vehiculosFiltrados = this.vehiculos;
    return;
  }

  this.vehiculosFiltrados = this.vehiculos.filter(v =>
    v.matricula?.toLowerCase().includes(texto) ||
    v.marca?.toLowerCase().includes(texto) ||
    v.modelo?.toLowerCase().includes(texto)
  );
}

  resetForm() {
  this.vehiculo = {
  matricula: '',
  marca: '',
  modelo: '',
  tipo_vehiculo: '',
  tipo_combustible: '',
  kilometros: null,
  fecha_ultima_revision: '',
  kilometros_ultima_revision: null,
  fecha_ultima_itv: '',
  fecha_ultima_tacografo: '',
  plazas_sentados: null,
  plazas_sillas: null,
  numero_bastidor: '',
  fecha_matriculacion: '',
  centro_asignado: '',
    };
  }

  abrirFormulario(){
    this.resetForm();
    this.editando = false;
    this.mostrarFormulario = true;
  
  }

  cerrarFormulario(){
    this.mostrarFormulario = false;
    this.editando = false;
  }

  guardarVehiculo(){

    if (this.editando && !this.matriculaOriginal) {
      console.error('Falta matrícula original');
      return;
    }

    const request = this.editando
    ? this.http.put(`${this.apiUrl}/${this.matriculaOriginal}`, this.vehiculo)
    : this.http.post(this.apiUrl, this.vehiculo);

      request.subscribe({ 
        next: () => {
        this.obtenerVehiculos();
        this.cerrarFormulario();
      },
      error: (err) => {
        console.error(err);
  }});
  }

  editarFormulario(v: Vehiculo) {
  this.vehiculo = {...v};
  this.matriculaOriginal = v.matricula;
  this.editando = true;
  this.mostrarFormulario = true;
  
}

  async confirmarEliminacion(v: Vehiculo){

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Seguro que quieres eliminar el vehículo ${v.matricula}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },{
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminar(v.matricula);
          }
        }
      ]
    });

    await alert.present();
}

eliminar(matricula:string){
  this.http.delete(`${this.apiUrl}/${matricula}`).subscribe({
  next: () => {
    this.obtenerVehiculos();
    alert('Vehículo eliminado correctamente')},
    
  error: () => alert('Error al eliminar vehículo')
});

}

  

  onDateChange(ev: any, tipo: string) {
  const value = ev.detail.value;
  if (!value) return;
  const fechaCorregida = value.split("T")[0];
  switch (tipo) {
    case 'mantenimiento':
    this.vehiculo.fecha_ultima_revision = fechaCorregida;
    break;
    case 'tacografo': 
    this.vehiculo.fecha_ultima_tacografo = fechaCorregida;
    break;
    case 'fechaMatriculacion':
    this.vehiculo.fecha_matriculacion = fechaCorregida;
    break;
    case 'fechaItv':
    this.vehiculo.fecha_ultima_itv = fechaCorregida;
    break;
  }

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
