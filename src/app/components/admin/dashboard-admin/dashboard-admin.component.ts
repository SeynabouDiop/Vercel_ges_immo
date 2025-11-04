import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { ClientService } from '../../../services/client.service';

interface DashboardStats {
  proprietaires: {
    total: number;
    evolution: number;
  };
  locataires: {
    total: number;
    evolution: number;
  };
  agents: {
    total: number;
    evolution: number;
  };
  biens: {
    total: number;
    disponibles: number;
    loues: number;
    evolution: number;
  };
  revenus: {
    mensuel: number;
    evolution: number;
  };
  contrats: {
    enAttente: number;
    evolution: number;
  };
}


@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css'
})
export class DashboardAdminComponent implements OnInit {

  currentUser: User | null = null;
  currentDate: Date = new Date();

  // CORRECTION : Ajouter la propriété stats
  stats: DashboardStats = {
    proprietaires: { total: 0, evolution: 0 },
    locataires: { total: 0, evolution: 0 },
    agents: { total: 0, evolution: 0 },
    biens: { total: 0, disponibles: 0, loues: 0, evolution: 0 },
    revenus: { mensuel: 0, evolution: 0 },
    contrats: { enAttente: 0, evolution: 0 }
  };

  recentClients: any[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Charger les statistiques
    this.loadStats();

    // Charger les clients récents
    this.loadRecentClients();
  }

  loadStats(): void {
    // Simulation de données - À remplacer par vos appels API réels
    this.stats = {
      proprietaires: {
        total: 45,
        evolution: 12
      },
      locataires: {
        total: 128,
        evolution: 8
      },
      agents: {
        total: 15,
        evolution: 5
      },
      biens: {
        total: 89,
        disponibles: 23,
        loues: 56,
        evolution: 15
      },
      revenus: {
        mensuel: 45230,
        evolution: 18
      },
      contrats: {
        enAttente: 8,
        evolution: -3
      }
    };

    // Exemple d'appels API réels (à décommenter et adapter) :
    /*
    this.clientService.getAllClients().subscribe(clients => {
      const proprietaires = clients.filter(c => c.id_utilisateur.type_utilisateur === 'proprietaire');
      const locataires = clients.filter(c => c.id_utilisateur.type_utilisateur === 'locataire');

      this.stats.proprietaires.total = proprietaires.length;
      this.stats.locataires.total = locataires.length;
    });

    this.agentService.getAllAgents().subscribe(agents => {
      this.stats.agents.total = agents.length;
    });

    this.bienService.getBiensStats().subscribe(stats => {
      this.stats.biens.total = stats.totalBiens;
      this.stats.biens.disponibles = stats.biensDisponibles;
      this.stats.biens.loues = stats.biensLoues;
    });
    */
  }

  loadRecentClients(): void {
    // Simulation de données - À remplacer par vos appels API réels
    this.recentClients = [
      {
        prenom: 'Marie',
        nom: 'Dubois',
        email: 'marie.dubois@email.com',
        type: 'locataire',
        dateInscription: new Date('2024-01-15')
      },
      {
        prenom: 'Pierre',
        nom: 'Martin',
        email: 'pierre.martin@email.com',
        type: 'proprietaire',
        dateInscription: new Date('2024-01-14')
      },
      {
        prenom: 'Sophie',
        nom: 'Bernard',
        email: 'sophie.bernard@email.com',
        type: 'locataire',
        dateInscription: new Date('2024-01-13')
      },
      {
        prenom: 'Luc',
        nom: 'Petit',
        email: 'luc.petit@email.com',
        type: 'proprietaire',
        dateInscription: new Date('2024-01-12')
      },
      {
        prenom: 'Emma',
        nom: 'Robert',
        email: 'emma.robert@email.com',
        type: 'locataire',
        dateInscription: new Date('2024-01-11')
      }
    ];

    // Exemple d'appel API réel (à décommenter et adapter) :
    /*
    this.clientService.getAllClients().subscribe(clients => {
      this.recentClients = clients
        .sort((a, b) => new Date(b.id_utilisateur.date_creation).getTime() - new Date(a.id_utilisateur.date_creation).getTime())
        .slice(0, 5)
        .map(client => ({
          prenom: client.id_utilisateur.prenom,
          nom: client.id_utilisateur.nom,
          email: client.id_utilisateur.email,
          type: client.id_utilisateur.type_utilisateur,
          dateInscription: new Date(client.id_utilisateur.date_creation)
        }));
    });
    */

    this.isLoading = false;
  }

  // Helper methods pour les templates
  getClientTypeLabel(type: string): string {
    return type === 'proprietaire' ? 'Propriétaire' : 'Locataire';
  }

  getClientTypeClass(type: string): string {
    return type === 'proprietaire' ? 'proprietaire' : 'locataire';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR').format(date);
  }
}
