import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonItem,
  IonInput,
  IonButton,
  IonList,
  IonLabel,
  IonButtons,
  IonMenuButton
} from '@ionic/angular/standalone';import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-clients',
  templateUrl: './clients.page.html',
  styleUrls: ['./clients.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonInput,
    IonButton,
    IonList,
    IonLabel,
    CommonModule,
    FormsModule,
    IonButtons,
    IonMenuButton
  ]})
export class ClientsPage implements OnInit {

  clientes: any[] = [];
  nombre: string = '';
  email: string = '';
  editando: boolean = false;
  clienteId: number | null = null;

  apiUrl = 'http://localhost:3000/clientes';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerClientes();
  }

  obtenerClientes() {
    this.http.get<any[]>(this.apiUrl).subscribe(data => {
      this.clientes = data;
    });
  }

  guardarCliente() {
    if (this.editando) {
      this.http.put(`${this.apiUrl}/${this.clienteId}`, {
        nombre: this.nombre,
        email: this.email
      }).subscribe(() => {
        this.resetForm();
        this.obtenerClientes();
      });
    } else {
      this.http.post(this.apiUrl, {
        nombre: this.nombre,
        email: this.email
      }).subscribe(() => {
        this.resetForm();
        this.obtenerClientes();
      });
    }
  }

  editar(cliente: any) {
    this.nombre = cliente.nombre;
    this.email = cliente.email;
    this.clienteId = cliente.id;
    this.editando = true;
  }

  eliminar(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.obtenerClientes();
    });
  }

  resetForm() {
    this.nombre = '';
    this.email = '';
    this.editando = false;
    this.clienteId = null;
  }
}
