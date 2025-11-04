import { Component } from '@angular/core';
import { RegisterRequest } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink,FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerData: RegisterRequest = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    mot_de_passe: '',
    type_utilisateur: 'locataire'
  };
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.registerData.mot_de_passe !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/client/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error.message || 'Erreur lors de l\'inscription';
      }
    });
  }

}
