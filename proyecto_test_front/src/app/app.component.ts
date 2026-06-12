import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonSplitPane,
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonNote,
  IonMenuToggle,
  IonItem,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRouterLink
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  people,
  car,
  send,
  clipboard
} from 'ionicons/icons';

import { AuthService } from './services/user.service';

interface AppPage {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterLink,
    IonRouterOutlet
  ],
})
export class AppComponent {

  public appPages: AppPage[] = [];

  constructor(public authService: AuthService) {

    addIcons({
      people,
      car,
      send,
      clipboard
    });

    this.loadMenu();
  }

  private loadMenu(): void {

    if (!this.authService.isAuthenticated()) {
      this.appPages = [
        { title: 'Empleados', url: '/employees', icon: 'people' },
        { title: 'Vehículos', url: '/vehicles', icon: 'car' },
        { title: 'Transportes', url: '/transport', icon: 'send' },
        { title: 'Clientes', url: '/clients', icon: 'clipboard' }
      ];
      return;
    }

    if (this.authService.isAdmin()) {

      this.appPages = [
        { title: 'Empleados', url: '/employees', icon: 'people' },
        { title: 'Vehículos', url: '/vehicles', icon: 'car' },
        { title: 'Transportes', url: '/transport', icon: 'send' },
        { title: 'Clientes', url: '/clients', icon: 'clipboard' }
      ];

    } else if (this.authService.isEmployee()) {

      this.appPages = [
        { title: 'Vehículos', url: '/vehicles', icon: 'car' },
        { title: 'Transportes', url: '/transport', icon: 'send' }
      ];

    }
  }
}