import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Caracteristique } from '../../../models/caracteristique.model';
import { CaracteristiqueService } from '../../../services/caracteristique.service';

@Component({
  selector: 'app-caracteristiques',
  imports: [CommonModule, FormsModule],
  templateUrl: './caracteristiques.component.html',
  styleUrl: './caracteristiques.component.css'
})
export class CaracteristiquesComponent implements OnInit {
  caracteristiques: Caracteristique[] = [];
  filteredCaracteristiques: Caracteristique[] = [];
  selectedCategorie: string = 'all';
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Formulaire
  isEditing = false;
  currentCaracteristique: Caracteristique = {
    libelle: '',
    categorie: 'interieur'
  };

  categories = [
    { value: 'all', label: 'Toutes les catégories' },
    { value: 'interieur', label: 'Intérieur' },
    { value: 'exterieur', label: 'Extérieur' },
    { value: 'securite', label: 'Sécurité' },
    { value: 'energie', label: 'Énergie' },
    { value: 'confort', label: 'Confort' }
  ];

  constructor(private caracteristiqueService: CaracteristiqueService) {}

  ngOnInit(): void {
    this.loadCaracteristiques();
  }

  loadCaracteristiques(): void {
    this.isLoading = true;
    this.caracteristiqueService.getAllCaracteristiques().subscribe({
      next: (data) => {
        this.caracteristiques = data;
        this.applyFilter();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des caractéristiques';
        this.isLoading = false;
        console.error('Error loading caracteristiques:', error);
      }
    });
  }

  applyFilter(): void {
    if (this.selectedCategorie === 'all') {
      this.filteredCaracteristiques = this.caracteristiques;
    } else {
      this.filteredCaracteristiques = this.caracteristiques.filter(
        c => c.categorie === this.selectedCategorie
      );
    }
  }

  onCategorieChange(): void {
    this.applyFilter();
  }

  // CRUD Operations
  createCaracteristique(): void {
    this.isLoading = true;
    this.caracteristiqueService.createCaracteristique(this.currentCaracteristique).subscribe({
      next: (caracteristique) => {
        this.caracteristiques.push(caracteristique);
        this.applyFilter();
        this.resetForm();
        this.successMessage = 'Caractéristique créée avec succès';
        this.isLoading = false;
        this.hideMessageAfterDelay();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la création';
        this.isLoading = false;
        console.error('Error creating caracteristique:', error);
      }
    });
  }

  editCaracteristique(caracteristique: Caracteristique): void {
    this.isEditing = true;
    this.currentCaracteristique = { ...caracteristique };
  }

  updateCaracteristique(): void {
    if (!this.currentCaracteristique._id) return;

    this.isLoading = true;
    this.caracteristiqueService.updateCaracteristique(
      this.currentCaracteristique._id,
      this.currentCaracteristique
    ).subscribe({
      next: (updated) => {
        const index = this.caracteristiques.findIndex(c => c._id === updated._id);
        if (index !== -1) {
          this.caracteristiques[index] = updated;
        }
        this.applyFilter();
        this.resetForm();
        this.successMessage = 'Caractéristique modifiée avec succès';
        this.isLoading = false;
        this.hideMessageAfterDelay();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la modification';
        this.isLoading = false;
        console.error('Error updating caracteristique:', error);
      }
    });
  }

  deleteCaracteristique(caracteristique: Caracteristique): void {
    if (!caracteristique._id) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer "${caracteristique.libelle}" ?`)) {
      this.caracteristiqueService.deleteCaracteristique(caracteristique._id).subscribe({
        next: () => {
          this.caracteristiques = this.caracteristiques.filter(c => c._id !== caracteristique._id);
          this.applyFilter();
          this.successMessage = 'Caractéristique supprimée avec succès';
          this.hideMessageAfterDelay();
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erreur lors de la suppression';
          console.error('Error deleting caracteristique:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.isEditing) {
      this.updateCaracteristique();
    } else {
      this.createCaracteristique();
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentCaracteristique = {
      libelle: '',
      categorie: 'interieur'
    };
  }

  cancelEdit(): void {
    this.resetForm();
  }

  // MÉTHODE MANQUANTE - AJOUTÉE ICI
  getCategorieIcon(categorie: string): string {
    const icons: { [key: string]: string } = {
      'interieur': 'fa-couch',
      'exterieur': 'fa-tree',
      'securite': 'fa-shield-alt',
      'energie': 'fa-bolt',
      'confort': 'fa-wind'
    };
    return icons[categorie] || 'fa-circle';
  }

  getCategorieLabel(categorie: string): string {
    const cat = this.categories.find(c => c.value === categorie);
    return cat ? cat.label : categorie;
  }

  private hideMessageAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }
}
