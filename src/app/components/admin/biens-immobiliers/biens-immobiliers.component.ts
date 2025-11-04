import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BienImmobilier, TypeBien } from '../../../models/bien-immobilier.model';
import { BienImmobilierService } from '../../../services/bien-immobilier.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-biens-immobiliers',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './biens-immobiliers.component.html',
  styleUrl: './biens-immobiliers.component.css'
})
export class BiensImmobiliersComponent implements OnInit {
  biens: BienImmobilier[] = [];
  typesBien: TypeBien[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Filtres
  searchTerm = '';
  typeFilter = 'all';
  statutFilter = 'all';
  villeFilter = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  totalPages = 1;

  // CORRECTION: Ajout de Math pour l'utiliser dans le template
  Math = Math;

  constructor(
    private bienService: BienImmobilierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBiens();
    this.loadTypesBien();
  }

  loadBiens(): void {
    this.isLoading = true;
    this.bienService.getAllBiens().subscribe({
      next: (data: any) => {
        this.biens = data.biens || data;
        this.totalItems = data.total || this.biens.length;
        this.totalPages = data.totalPages || Math.ceil(this.totalItems / this.itemsPerPage);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des biens';
        this.isLoading = false;
        console.error('Error loading biens:', error);
      }
    });
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

  applyFilters(): void {
    // Implémentation des filtres
    let filtered = this.biens;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(bien =>
        bien.titre.toLowerCase().includes(term) ||
        bien.reference.toLowerCase().includes(term) ||
        bien.adresse.toLowerCase().includes(term)
      );
    }

    if (this.typeFilter !== 'all') {
      filtered = filtered.filter(bien => bien.id_type_bien === this.typeFilter);
    }

    if (this.statutFilter !== 'all') {
      filtered = filtered.filter(bien => bien.statut === this.statutFilter);
    }

    if (this.villeFilter) {
      filtered = filtered.filter(bien =>
        bien.ville.toLowerCase().includes(this.villeFilter.toLowerCase())
      );
    }

    this.biens = filtered;
    this.totalItems = filtered.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedBiens(): BienImmobilier[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.biens.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
    let endPage = startPage + maxPages - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // CORRECTION: Méthodes pour l'affichage paginé
  get displayStart(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get displayEnd(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  getStatutLabel(statut: string): string {
    const statuts: { [key: string]: string } = {
      'disponible': 'Disponible',
      'loue': 'Loué',
      'vendu': 'Vendu',
      'reserve': 'Réservé',
      'indisponible': 'Indisponible'
    };
    return statuts[statut] || statut;
  }

  getStatutBadgeClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'disponible': 'badge-success',
      'loue': 'badge-warning',
      'vendu': 'badge-secondary',
      'reserve': 'badge-info',
      'indisponible': 'badge-danger'
    };
    return classes[statut] || 'badge-secondary';
  }

  getTypeBienLibelle(idTypeBien: string): string {
    const type = this.typesBien.find(t => t._id === idTypeBien);
    return type ? type.libelle : 'Inconnu';
  }

  editBien(bienId: string): void {
    this.router.navigate(['/admin/biens/edit', bienId]);
  }

  deleteBien(bien: BienImmobilier): void {
    if (!bien._id) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer le bien "${bien.titre}" ?`)) {
      this.bienService.deleteBien(bien._id).subscribe({
        next: () => {
          this.biens = this.biens.filter(b => b._id !== bien._id);
          this.successMessage = 'Bien supprimé avec succès';
          this.hideMessageAfterDelay();
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression du bien';
          console.error('Error deleting bien:', error);
        }
      });
    }
  }

  private hideMessageAfterDelay(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }
}
