import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { DashboardAdminComponent } from './components/admin/dashboard-admin/dashboard-admin.component';
import { ClientListComponent } from './components/admin/client-list/client-list.component';
import { ClientFormComponent } from './components/admin/client-form/client-form.component';
import { DashboardClientComponent } from './components/client/dashboard-client/dashboard-client.component';
import { ProfileComponent } from './components/client/profile/profile.component';
import { clientGuard } from './guards/client.guard';
import { LoginAdminComponent } from './components/admin/login-admin/login-admin.component';
import { AboutComponent } from './components/shared/pages/about/about.component';
import { ServiceComponent } from './components/shared/pages/service/service.component';
import { ContactComponent } from './components/shared/pages/contact/contact.component';
import { HomeComponent } from './components/shared/pages/home/home.component';
import { CaracteristiquesComponent } from './components/admin/caracteristiques/caracteristiques.component';
import { BiensImmobiliersComponent } from './components/admin/biens-immobiliers/biens-immobiliers.component';
import { BienFormComponent } from './components/admin/bien-form/bien-form.component';

export const routes: Routes =
  [
    /*{ path: '', redirectTo: '/login', pathMatch: 'full' },*/
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'login/admin', component: LoginAdminComponent },
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'services', component: ServiceComponent },
    { path: 'contact', component: ContactComponent },

    // Routes Admin
    {
      path: 'admin/dashboard',
      component: DashboardAdminComponent,
      canActivate: [authGuard, adminGuard]
    },
    {
      path: 'admin/clients',
      component: ClientListComponent,
      canActivate: [authGuard, adminGuard]
    },
    {
      path: 'admin/clients/new',
      component: ClientFormComponent,
      canActivate: [authGuard, adminGuard]
    },
    {
      path: 'admin/clients/edit/:id',
      component: ClientFormComponent,
      canActivate: [authGuard, adminGuard]
    },
    {
      path: 'admin/caracteristiques',
      component: CaracteristiquesComponent,
      canActivate: [authGuard, adminGuard]
    },
    {
      path: 'admin/biens',
      component: BiensImmobiliersComponent,
      canActivate: [authGuard, adminGuard]
    },
    {
      path: 'admin/biens/new',
      component: BienFormComponent,
      canActivate: [authGuard, adminGuard]
    },
    {
      path: 'admin/biens/edit/:id',
      component: BienFormComponent,
      canActivate: [authGuard, adminGuard]
    },


    // Routes Client
    {
      path: 'client/dashboard',
      component: DashboardClientComponent,
      canActivate: [authGuard, clientGuard]
    },
    {
      path: 'client/profile',
      component: ProfileComponent,
      canActivate: [authGuard, clientGuard]
    },

    /* // Redirection par défaut { path: '**', redirectTo: '/login' }*/

  ];
