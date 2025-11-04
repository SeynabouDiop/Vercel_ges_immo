import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Visite } from '../../../models/visite.model';
import { VisiteService } from '../../../services/visite.service';

@Component({
  selector: 'app-visite-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './visite-list.component.html',
  styleUrl: './visite-list.component.css'
})
export class VisiteListComponent implements OnInit {

  visites: Visite[] = [];
  filteredVisites: Visite[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  // Filtres
  searchTerm = '';
  statutFilter = 'all';
  dateFilter = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor(
    private visiteService: VisiteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVisites();
  }

  loadVisites(): void {
    this.isLoading = true;
    this.visiteService.getAllVisites().subscribe({
      next: (visites) => {
        this.visites = visites;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des visites';
        this.isLoading = false;
        console.error('Error loading visites:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = this.visites;

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(visite =>
        visite.id_bien.titre.toLowerCase().includes(term) ||
        visite.id_bien.ville.toLowerCase().includes(term) ||
        (visite.id_client && visite.id_client.prenom.toLowerCase().includes(term)) ||
        (visite.id_client && visite.id_client.nom.toLowerCase().includes(term))
      );
    }

    // Filtre par statut
    if (this.statutFilter !== 'all') {
      filtered = filtered.filter(visite => visite.statut === this.statutFilter);
    }

    // Filtre par date
    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter);
      filtered = filtered.filter(visite => {
        const visiteDate = new Date(visite.date_visite);
        return visiteDate.toDateString() === filterDate.toDateString();
      });
    }

    this.filteredVisites = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredVisites.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedVisites(): Visite[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredVisites.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getPages(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  editVisite(visiteId: string): void {
    this.router.navigate(['/admin/visites/edit', visiteId]);
  }

  deleteVisite(visite: Visite): void {
    const bienTitre = visite.id_bien.titre;
    const dateVisite = new Date(visite.date_visite).toLocaleDateString('fr-FR');

    if (confirm(`Êtes-vous sûr de vouloir supprimer la visite du "${dateVisite}" pour le bien "${bienTitre}" ?`)) {
      this.visiteService.deleteVisite(visite._id!).subscribe({
        next: () => {
          this.successMessage = 'Visite supprimée avec succès';
          this.loadVisites();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression de la visite';
          console.error('Error deleting visite:', error);
        }
      });
    }
  }

  updateVisiteStatut(visite: Visite, newStatut: string): void {
    this.visiteService.updateVisite(visite._id!, { statut: newStatut as any }).subscribe({
      next: (updatedVisite) => {
        this.successMessage = 'Statut de la visite mis à jour';
        this.loadVisites();
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors de la mise à jour du statut';
        console.error('Error updating visite:', error);
      }
    });
  }

  getStatutLabel(statut: string): string {
    const statuts: { [key: string]: string } = {
      'planifiee': 'Planifiée',
      'confirmee': 'Confirmée',
      'terminee': 'Terminée',
      'annulee': 'Annulée'
    };
    return statuts[statut] || statut;
  }

  getResultatLabel(resultat: string): string {
    const resultats: { [key: string]: string } = {
      'interesse': 'Intéressé',
      'non_interesse': 'Non intéressé',
      'a_revoir': 'À revoir'
    };
    return resultats[resultat] || resultat;
  }

  getStatutBadgeClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'planifiee': 'badge-warning',
      'confirmee': 'badge-info',
      'terminee': 'badge-success',
      'annulee': 'badge-danger'
    };
    return classes[statut] || 'badge-secondary';
  }

  getResultatBadgeClass(resultat: string): string {
    const classes: { [key: string]: string } = {
      'interesse': 'badge-success',
      'non_interesse': 'badge-danger',
      'a_revoir': 'badge-warning'
    };
    return classes[resultat] || 'badge-secondary';
  }
}
