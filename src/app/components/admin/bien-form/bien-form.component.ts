import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { BienCreateRequest, BienUpdateRequest, TypeBien } from '../../../models/bien-immobilier.model';
import { BienImmobilierService } from '../../../services/bien-immobilier.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-bien-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule,RouterLink],
  templateUrl: './bien-form.component.html',
  styleUrl: './bien-form.component.css'
})
export class BienFormComponent implements OnInit {

  bienForm: FormGroup;
  typesBien: TypeBien[] = [];
  isEditMode = false;
  bienId: string | null = null;
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Propriété pour l'année courante
  currentYear: number;

  // Options pour les selects
  etatsBien = [
    { value: 'neuf', label: 'Neuf' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'bon', label: 'Bon' },
    { value: 'renovation', label: 'À rénover' },
    { value: 'travaux', label: 'Travaux nécessaires' }
  ];

  statutsBien = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'loue', label: 'Loué' },
    { value: 'vendu', label: 'Vendu' },
    { value: 'reserve', label: 'Réservé' },
    { value: 'indisponible', label: 'Indisponible' }
  ];

  classesDPE = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' },
    { value: 'E', label: 'E' },
    { value: 'F', label: 'F' },
    { value: 'G', label: 'G' }
  ];

  constructor(
    private fb: FormBuilder,
    private bienService: BienImmobilierService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bienForm = this.createForm();
    // Initialisation de l'année courante
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    this.loadTypesBien();

    this.route.params.subscribe(params => {
      this.bienId = params['id'];
      this.isEditMode = !!this.bienId;

      if (this.isEditMode) {
        this.loadBien();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      // Informations générales
      id_type_bien: ['', Validators.required],
      titre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      description: ['', Validators.maxLength(2000)],

      // Adresse
      adresse: ['', Validators.required],
      complement_adresse: [''],
      code_postal: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      ville: ['', Validators.required],
      pays: ['France'],

      // Caractéristiques physiques
      surface_habitable: ['', [Validators.required, Validators.min(1)]],
      surface_terrain: ['', Validators.min(0)],
      nb_pieces: ['', Validators.min(0)],
      nb_chambres: ['', Validators.min(0)],
      nb_sdb: ['', Validators.min(0)],
      nb_wc: ['', Validators.min(0)],
      annee_construction: ['', [this.yearValidator.bind(this)]],

      // Performance énergétique
      dpe_energie: [''],
      dpe_ges: [''],

      // État et statut
      etat_bien: ['bon', Validators.required],
      statut: ['disponible', Validators.required],

      // Prix et finances
      prix_vente: ['', Validators.min(0)],
      prix_location: ['', Validators.min(0)],
      charges_mensuelles: [0, Validators.min(0)],
      depot_garantie: ['', Validators.min(0)]
    });
  }

  // Validateur personnalisé pour l'année
  private yearValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Pas d'erreur si vide
    }

    const year = parseInt(control.value);

    if (year < 1800 || year > this.currentYear) {
      return { invalidYear: true };
    }

    return null;
  }

  loadTypesBien(): void {
    this.bienService.getTypesBien().subscribe({
      next: (types) => {
        this.typesBien = types;
      },
      error: (error) => {
        console.error('Error loading types bien:', error);
      }
    });
  }

  loadBien(): void {
    if (!this.bienId) return;

    this.isLoading = true;
    this.bienService.getBienById(this.bienId).subscribe({
      next: (bien) => {
        this.populateForm(bien);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement du bien';
        this.isLoading = false;
        console.error('Error loading bien:', error);
      }
    });
  }

  populateForm(bien: any): void {
    this.bienForm.patchValue({
      id_type_bien: bien.id_type_bien._id || bien.id_type_bien,
      titre: bien.titre,
      description: bien.description || '',
      adresse: bien.adresse,
      complement_adresse: bien.complement_adresse || '',
      code_postal: bien.code_postal,
      ville: bien.ville,
      pays: bien.pays || 'France',
      surface_habitable: bien.surface_habitable,
      surface_terrain: bien.surface_terrain || '',
      nb_pieces: bien.nb_pieces || '',
      nb_chambres: bien.nb_chambres || '',
      nb_sdb: bien.nb_sdb || '',
      nb_wc: bien.nb_wc || '',
      annee_construction: bien.annee_construction || '',
      dpe_energie: bien.dpe_energie || '',
      dpe_ges: bien.dpe_ges || '',
      etat_bien: bien.etat_bien,
      statut: bien.statut,
      prix_vente: bien.prix_vente || '',
      prix_location: bien.prix_location || '',
      charges_mensuelles: bien.charges_mensuelles || 0,
      depot_garantie: bien.depot_garantie || ''
    });
  }

  onSubmit(): void {
    if (this.bienForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formValue = this.bienForm.value;

    // CORRECTION : Assurer que les champs requis sont présents
    const cleanedData: BienCreateRequest = {
      id_type_bien: formValue.id_type_bien,
      titre: formValue.titre,
      adresse: formValue.adresse,
      code_postal: formValue.code_postal,
      ville: formValue.ville,
      surface_habitable: formValue.surface_habitable,
      etat_bien: formValue.etat_bien,
      statut: formValue.statut,
      // Champs optionnels
      description: formValue.description || undefined,
      complement_adresse: formValue.complement_adresse || undefined,
      pays: formValue.pays || 'France',
      surface_terrain: formValue.surface_terrain || undefined,
      nb_pieces: formValue.nb_pieces || undefined,
      nb_chambres: formValue.nb_chambres || undefined,
      nb_sdb: formValue.nb_sdb || undefined,
      nb_wc: formValue.nb_wc || undefined,
      annee_construction: formValue.annee_construction || undefined,
      dpe_energie: formValue.dpe_energie || undefined,
      dpe_ges: formValue.dpe_ges || undefined,
      prix_vente: formValue.prix_vente || undefined,
      prix_location: formValue.prix_location || undefined,
      charges_mensuelles: formValue.charges_mensuelles || 0,
      depot_garantie: formValue.depot_garantie || undefined
    };

    // Nettoyer les valeurs undefined
    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key as keyof BienCreateRequest] === undefined) {
        delete cleanedData[key as keyof BienCreateRequest];
      }
    });

    if (this.isEditMode && this.bienId) {
      // Mode édition
      const updateData: BienUpdateRequest = cleanedData;
      this.updateBien(updateData);
    } else {
      // Mode création
      this.createBien(cleanedData);
    }
  }

  createBien(bienData: BienCreateRequest): void {
    this.bienService.createBien(bienData).subscribe({
      next: (bien) => {
        this.isSubmitting = false;
        this.successMessage = 'Bien créé avec succès';

        setTimeout(() => {
          this.router.navigate(['/admin/biens']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la création du bien';
        console.error('Error creating bien:', error);
      }
    });
  }

  updateBien(bienData: BienUpdateRequest): void {
    if (!this.bienId) return;

    this.bienService.updateBien(this.bienId, bienData).subscribe({
      next: (bien) => {
        this.isSubmitting = false;
        this.successMessage = 'Bien modifié avec succès';

        setTimeout(() => {
          this.router.navigate(['/admin/biens']);
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Erreur lors de la modification du bien';
        console.error('Error updating bien:', error);
      }
    });
  }

  onCancel(): void {
    if (this.bienForm.dirty) {
      if (confirm('Les modifications non enregistrées seront perdues. Continuer ?')) {
        this.router.navigate(['/admin/biens']);
      }
    } else {
      this.router.navigate(['/admin/biens']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.bienForm.controls).forEach(key => {
      const control = this.bienForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getters pour les contrôles du formulaire
  get id_type_bien() { return this.bienForm.get('id_type_bien'); }
  get titre() { return this.bienForm.get('titre'); }
  get description() { return this.bienForm.get('description'); }
  get adresse() { return this.bienForm.get('adresse'); }
  get code_postal() { return this.bienForm.get('code_postal'); }
  get ville() { return this.bienForm.get('ville'); }
  get surface_habitable() { return this.bienForm.get('surface_habitable'); }
  get annee_construction() { return this.bienForm.get('annee_construction'); }

  get pageTitle(): string {
    return this.isEditMode ? 'Modifier le Bien' : 'Nouveau Bien Immobilier';
  }

  get submitButtonText(): string {
    return this.isSubmitting
      ? (this.isEditMode ? 'Modification...' : 'Création...')
      : (this.isEditMode ? 'Modifier le Bien' : 'Créer le Bien');
  }
}

