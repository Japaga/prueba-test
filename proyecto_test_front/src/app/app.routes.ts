import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/inbox',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
    
  },
  {
    path: 'hola',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },
  {
    path: 'clients',
    loadComponent: () => import('./pages/clients/clients.page').then( m => m.ClientsPage)
  },
  {
    path: 'employees',
    loadComponent: () => import('./pages/employees/employees.page').then( m => m.EmployeesPage)
  },
  {
    path: 'vehicles',
    loadComponent: () => import('./pages/vehicles/vehicles.page').then( m => m.VehiclesPage)
  },
  {
    path: 'transport',
    loadComponent: () => import('./pages/transport/transport.page').then( m => m.TransportPage)
  },
];
