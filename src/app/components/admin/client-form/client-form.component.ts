import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClientService } from '../../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, ClientCreateRequest, ClientUpdateRequest } from '../../../models/client.model';

@Component({
  selector: 'app-client-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css'
})
export class ClientFormComponent implements OnInit, OnDestroy {
  clientForm: FormGroup;
  isEditMode = false;
  clientId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Propriétés pour afficher/masquer les mots de passe
  showPassword = false;
  showConfirmPassword = false;

  private routeSub?: Subscription;

  // Options pour les selects
  userTypes = [
    { value: 'locataire', label: 'Locataire', icon: 'fa-user' },
    { value: 'proprietaire', label: 'Propriétaire', icon: 'fa-user-tie' },
    { value: 'agent', label: 'Agent Immobilier', icon: 'fa-briefcase' }
  ];

  clientTypes = [
    { value: 'particulier', label: 'Particulier' },
    { value: 'societe', label: 'Société' },
    { value: 'investisseur', label: 'Investisseur' }
  ];

  countries = [
    { value: 'France', label: 'France' },
    { value: 'Belgique', label: 'Belgique' },
    { value: 'Suisse', label: 'Suisse' },
    { value: 'Luxembourg', label: 'Luxembourg' },
    { value: 'autre', label: 'Autre' }
  ];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clientForm = this.createForm();
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.clientId = params['id'];
      this.isEditMode = !!this.clientId;

      if (this.isEditMode) {
        this.loadClient();
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Informations personnelles
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],

      // Type d'utilisateur
      type_utilisateur: ['locataire', [Validators.required]],
      type_client: ['particulier', [Validators.required]],

      // Informations société (conditionnelles)
      raison_sociale: [''],
      siret: [''],

      // Adresse
      adresse: [''],
      code_postal: [''],
      ville: [''],
      pays: ['France'],

      // Mot de passe (seulement en création)
      mot_de_passe: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('mot_de_passe');
    const confirmPassword = form.get('confirm_password');

    if (!password || !confirmPassword) return null;

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }

    return null;
  }

  loadClient(): void {
    if (!this.clientId) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getClientById(this.clientId).subscribe({
      next: (client) => {
        this.populateForm(client);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du client';
        this.isLoading = false;
        console.error('Error loading client:', error);
      }
    });
  }

  populateForm(client: Client): void {
    this.clientForm.patchValue({
      nom: client.id_utilisateur.nom,
      prenom: client.id_utilisateur.prenom,
      email: client.id_utilisateur.email,
      telephone: client.id_utilisateur.telephone || '',
      type_utilisateur: client.id_utilisateur.type_utilisateur,
      type_client: client.type_client,
      raison_sociale: client.raison_sociale || '',
      siret: client.siret || '',
      adresse: client.adresse || '',
      code_postal: client.code_postal || '',
      ville: client.ville || '',
      pays: client.pays || 'France',
      mot_de_passe: '', // Ne pas pré-remplir le mot de passe
      confirm_password: ''
    });

    // En mode édition, rendre le mot de passe optionnel
    this.clientForm.get('mot_de_passe')?.clearValidators();
    this.clientForm.get('mot_de_passe')?.updateValueAndValidity();

    // Désactiver le champ email en mode édition
    this.clientForm.get('email')?.disable();
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.clientForm.getRawValue();

    if (this.isEditMode && this.clientId) {
      // Mode ÉDITION - Utiliser ClientUpdateRequest
      const updateData: ClientUpdateRequest = {
        nom: formValue.nom,
        prenom: formValue.prenom,
        telephone: formValue.telephone,
        type_utilisateur: formValue.type_utilisateur,
        type_client: formValue.type_client,
        adresse: formValue.adresse,
        code_postal: formValue.code_postal,
        ville: formValue.ville,
        pays: formValue.pays
      };

      // Ajouter les champs conditionnels pour société
      if (formValue.type_client === 'societe') {
        updateData.raison_sociale = formValue.raison_sociale;
        updateData.siret = formValue.siret;
      }

      // Si un nouveau mot de passe est fourni, l'ajouter
      if (formValue.mot_de_passe) {
        (updateData as any).mot_de_passe = formValue.mot_de_passe;
      }

      this.updateClient(updateData);
    } else {
      // Mode CRÉATION - Utiliser ClientCreateRequest
      const createData: ClientCreateRequest = {
        nom: formValue.nom,
        prenom: formValue.prenom,
        email: formValue.email,
        telephone: formValue.telephone,
        mot_de_passe: formValue.mot_de_passe, // OBLIGATOIRE en création
        type_utilisateur: formValue.type_utilisateur,
        type_client: formValue.type_client,
        adresse: formValue.adresse,
        code_postal: formValue.code_postal,
        ville: formValue.ville,
        pays: formValue.pays
      };

      // Ajouter les champs conditionnels pour société
      if (formValue.type_client === 'societe') {
        createData.raison_sociale = formValue.raison_sociale;
        createData.siret = formValue.siret;
      }

      this.createClient(createData);
    }
  }

  createClient(clientData: ClientCreateRequest): void {
    this.clientService.createClient(clientData).subscribe({
      next: (client) => {
        this.isSubmitting = false;
        this.successMessage = 'Client créé avec succès';

        setTimeout(() => {
          this.router.navigate(['/admin/clients']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la création du client';
        console.error('Error creating client:', error);
      }
    });
  }

  updateClient(clientData: ClientUpdateRequest): void {
    if (!this.clientId) return;

    this.clientService.updateClient(this.clientId, clientData).subscribe({
      next: (client) => {
        this.isSubmitting = false;
        this.successMessage = 'Client modifié avec succès';

        setTimeout(() => {
          this.router.navigate(['/admin/clients']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la modification du client';
        console.error('Error updating client:', error);
      }
    });
  }

  onCancel(): void {
    if (this.clientForm.dirty) {
      if (confirm('Les modifications non enregistrées seront perdues. Continuer ?')) {
        this.router.navigate(['/admin/clients']);
      }
    } else {
      this.router.navigate(['/admin/clients']);
    }
  }

  generatePassword(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    this.clientForm.patchValue({
      mot_de_passe: password,
      confirm_password: password
    });
  }

  getPasswordStrength(): string {
    const password = this.mot_de_passe?.value;
    if (!password) return '';

    let strength = 0;

    // Longueur
    if (password.length >= 8) strength++;
    // Majuscules
    if (/[A-Z]/.test(password)) strength++;
    // Minuscules
    if (/[a-z]/.test(password)) strength++;
    // Chiffres
    if (/[0-9]/.test(password)) strength++;
    // Caractères spéciaux
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength === 3) return 'fair';
    if (strength === 4) return 'good';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    // CORRECTION : Ajouter une signature d'index pour TypeScript
    const texts: { [key: string]: string } = {
      'weak': 'Faible',
      'fair': 'Moyen',
      'good': 'Bon',
      'strong': 'Fort'
    };
    return texts[strength] || 'Inconnu';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.clientForm.controls).forEach(key => {
      const control = this.clientForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters pour accéder facilement aux contrôles du formulaire
  get nom() { return this.clientForm.get('nom'); }
  get prenom() { return this.clientForm.get('prenom'); }
  get email() { return this.clientForm.get('email'); }
  get telephone() { return this.clientForm.get('telephone'); }
  get type_utilisateur() { return this.clientForm.get('type_utilisateur'); }
  get type_client() { return this.clientForm.get('type_client'); }
  get raison_sociale() { return this.clientForm.get('raison_sociale'); }
  get siret() { return this.clientForm.get('siret'); }
  get adresse() { return this.clientForm.get('adresse'); }
  get code_postal() { return this.clientForm.get('code_postal'); }
  get ville() { return this.clientForm.get('ville'); }
  get pays() { return this.clientForm.get('pays'); }
  get mot_de_passe() { return this.clientForm.get('mot_de_passe'); }
  get confirm_password() { return this.clientForm.get('confirm_password'); }

  // Helper pour vérifier si le type client est société
  get isSociete(): boolean {
    return this.clientForm.get('type_client')?.value === 'societe';
  }

  get pageTitle(): string {
    return this.isEditMode ? 'Modifier le Client' : 'Nouveau Client';
  }

  get submitButtonText(): string {
    return this.isSubmitting
      ? (this.isEditMode ? 'Modification...' : 'Création...')
      : (this.isEditMode ? 'Modifier le Client' : 'Créer le Client');
  }
}
