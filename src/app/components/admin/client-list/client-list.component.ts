import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Client, ClientUpdateRequest } from '../../../models/client.model';
import { ClientService } from '../../../services/client.service';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css'
})
export class ClientListComponent implements OnInit {

  clients: Client[] = [];
  filteredClients: Client[] = [];
  isLoading = true;
  errorMessage = '';
  successMessage = '';

  // Filtres et recherche
  searchTerm = '';
  typeFilter = 'all';
  statusFilter = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  // Ajouter cette propriété
  activeTab: string = 'all';

 
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  // Propriétés calculées pour les statistiques
  get totalClients(): number {
    return this.clients.length;
  }

  get activeClients(): number {
    return this.clients.filter(c => c.id_utilisateur.statut === 'actif').length;
  }

  get ownerClients(): number {
    return this.clients.filter(c => c.id_utilisateur.type_utilisateur === 'proprietaire').length;
  }

  get tenantClients(): number {
    return this.clients.filter(c => c.id_utilisateur.type_utilisateur === 'locataire').length;
  }

  get agentClients(): number {
    return this.clients.filter(c => c.id_utilisateur.type_utilisateur === 'agent').length;
  }

  // Propriété pour le compteur d'affichage
  get displayRange(): string {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredClients.length);
    return `${start} à ${end}`;
  }

  constructor(
    private clientService: ClientService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.clientService.getAllClients().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des clients';
        this.isLoading = false;
        console.error('Error loading clients:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = this.clients;

    // Filtre par recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.id_utilisateur.nom.toLowerCase().includes(term) ||
        client.id_utilisateur.prenom.toLowerCase().includes(term) ||
        client.id_utilisateur.email.toLowerCase().includes(term) ||
        (client.id_utilisateur.telephone && client.id_utilisateur.telephone.includes(term))
      );
    }

    // Filtre par type
    if (this.typeFilter !== 'all') {
      filtered = filtered.filter(client =>
        client.id_utilisateur.type_utilisateur === this.typeFilter
      );
    }

    // Filtre par statut
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(client =>
        client.id_utilisateur.statut === this.statusFilter
      );
    }

    this.filteredClients = filtered;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredClients.length / this.itemsPerPage);
    this.currentPage = 1; // Reset à la première page après filtrage
  }

  get paginatedClients(): Client[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredClients.slice(startIndex, endIndex);
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

  editClient(clientId: string): void {
    this.router.navigate(['/admin/clients/edit', clientId]);
  }

  deleteClient(client: Client): void {
    const clientName = `${client.id_utilisateur.prenom} ${client.id_utilisateur.nom}`;

    if (confirm(`Êtes-vous sûr de vouloir supprimer le client "${clientName}" ? Cette action est irréversible.`)) {
      this.clientService.deleteClient(client.id_utilisateur.id).subscribe({
        next: () => {
          this.successMessage = `Client "${clientName}" supprimé avec succès`;
          this.loadClients(); // Recharger la liste

          // Masquer le message après 3 secondes
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = 'Erreur lors de la suppression du client';
          console.error('Error deleting client:', error);
        }
      });
    }
  }

  toggleClientStatus(client: Client): void {
    const newStatus = client.id_utilisateur.statut === 'actif' ? 'inactif' : 'actif';
    const clientName = `${client.id_utilisateur.prenom} ${client.id_utilisateur.nom}`;

    const action = newStatus === 'actif' ? 'activer' : 'désactiver';

    if (confirm(`Êtes-vous sûr de vouloir ${action} le client "${clientName}" ?`)) {
      // CORRECTION : Utiliser le type correct avec conversion explicite
      const updateData: ClientUpdateRequest = {
        statut: newStatus as 'actif' | 'inactif' | 'suspendu'
      };

      this.clientService.updateClient(client.id_utilisateur.id, updateData).subscribe({
        next: (updatedClient) => {
          this.successMessage = `Client "${clientName}" ${newStatus === 'actif' ? 'activé' : 'désactivé'} avec succès`;
          this.loadClients();

          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.errorMessage = `Erreur lors de la modification du statut du client`;
          console.error('Error updating client status:', error);
        }
      });
    }
  }

  getClientTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'locataire': 'Locataire',
      'proprietaire': 'Propriétaire',
      'admin': 'Administrateur',
      'agent': 'Agent'
    };
    return types[type] || type;
  }

  getStatusLabel(status: string): string {
    const statuses: { [key: string]: string } = {
      'actif': 'Actif',
      'inactif': 'Inactif',
      'suspendu': 'Suspendu'
    };
    return statuses[status] || status;
  }

  getClientTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'locataire': 'fa-user',
      'proprietaire': 'fa-user-tie',
      'admin': 'fa-shield-alt',
      'agent': 'fa-briefcase'
    };
    return icons[type] || 'fa-user';
  }

  exportClients(): void {
    // Simulation d'export CSV
    const csvContent = this.convertToCSV(this.filteredClients);
    this.downloadCSV(csvContent, 'clients.csv');
    this.successMessage = 'Liste des clients exportée avec succès';

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  private convertToCSV(clients: Client[]): string {
    const headers = ['Nom', 'Prénom', 'Email', 'Téléphone', 'Type', 'Statut', 'Date création'];
    const rows = clients.map(client => [
      client.id_utilisateur.nom,
      client.id_utilisateur.prenom,
      client.id_utilisateur.email,
      client.id_utilisateur.telephone || '',
      this.getClientTypeLabel(client.id_utilisateur.type_utilisateur),
      this.getStatusLabel(client.id_utilisateur.statut),
      new Date(client.id_utilisateur.date_creation).toLocaleDateString('fr-FR')
    ]);

    return [headers, ...rows].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
  }

  private downloadCSV(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
