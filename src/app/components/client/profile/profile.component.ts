import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Client } from '../../../models/client.model';
import { ClientService } from '../../../services/client.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  profile: Client | null = null;
  profileForm!: FormGroup;
  isEditing = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.initForm();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      type_client: ['particulier'],
      raison_sociale: [''],
      siret: [''],
      adresse: [''],
      code_postal: [''],
      ville: [''],
      pays: ['France']
    });
  }

  loadProfile(): void {
    this.isLoading = true;
    this.clientService.getProfile().subscribe({
      next: (profile) => {
        this.profile = profile;
        this.populateForm(profile);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du profil';
        this.isLoading = false;
        console.error('Profile loading error:', error);
      }
    });
  }

  populateForm(profile: Client): void {
    this.profileForm.patchValue({
      nom: profile.id_utilisateur.nom,
      prenom: profile.id_utilisateur.prenom,
      email: profile.id_utilisateur.email,
      telephone: profile.id_utilisateur.telephone || '',
      type_client: profile.type_client,
      raison_sociale: profile.raison_sociale || '',
      siret: profile.siret || '',
      adresse: profile.adresse || '',
      code_postal: profile.code_postal || '',
      ville: profile.ville || '',
      pays: profile.pays || 'France'
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isEditing && this.profile) {
      this.populateForm(this.profile);
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.profile) {
      this.populateForm(this.profile);
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      this.clientService.updateProfile(this.profileForm.value).subscribe({
        next: (updatedProfile) => {
          this.profile = updatedProfile;
          this.isEditing = false;
          this.isLoading = false;
          this.successMessage = 'Profil mis à jour avec succès';

          // Mettre à jour l'utilisateur dans le service d'authentification
          //this.authService.currentUser$.next(updatedProfile.id_utilisateur);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de la mise à jour du profil';
          console.error('Profile update error:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.profileForm.controls).forEach(key => {
      const control = this.profileForm.get(key);
      control?.markAsTouched();
    });
  }

  getClientTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'particulier': 'Particulier',
      'societe': 'Société',
      'investisseur': 'Investisseur'
    };
    return types[type] || type;
  }

  getRoleLabel(role: string): string {
    const roles: { [key: string]: string } = {
      'admin': 'Administrateur',
      'agent': 'Agent Immobilier',
      'proprietaire': 'Propriétaire',
      'locataire': 'Locataire'
    };
    return roles[role] || role;
  }

}
