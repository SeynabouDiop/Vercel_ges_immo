import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { NavbarAdminComponent } from './components/admin/navbar-admin/navbar-admin.component';
import { NavbarClientComponent } from './components/client/navbar-client/navbar-client.component';
import { NavbarComponent } from './components/shared/layouts/navbar/navbar.component';
import { FooterComponent } from './components/shared/layouts/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,NavbarAdminComponent,NavbarClientComponent,NavbarComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  constructor(public authService: AuthService) {}
}
