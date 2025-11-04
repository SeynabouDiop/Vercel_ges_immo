import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BienImmobilier, Contrat, ProprietaireStats } from '../../../models/proprietaire.model';
import { ProprietaireService } from '../../../services/proprietaire.service';

@Component({
  selector: 'app-dashboard-proprietaire',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-proprietaire.component.html',
  styleUrl: './dashboard-proprietaire.component.css'
})
export class DashboardProprietaireComponent implements OnInit {
  stats: ProprietaireStats | null = null;
  recentBiens: BienImmobilier[] = [];
  recentContrats: Contrat[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private proprietaireService: ProprietaireService) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // Charger les statistiques
    this.proprietaireService.getStatistiques().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loadRecentData();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des statistiques';
        this.isLoading = false;
        console.error('Error loading stats:', error);
      }
    });
  }

  loadRecentData(): void {
    // Charger les biens récents
    this.proprietaireService.getBiens().subscribe({
      next: (biens) => {
        this.recentBiens = biens.slice(0, 5); // 5 derniers biens
        this.loadRecentContrats();
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des biens';
        this.isLoading = false;
        console.error('Error loading biens:', error);
      }
    });
  }

  loadRecentContrats(): void {
    // Charger les contrats récents
    this.proprietaireService.getContrats().subscribe({
      next: (contrats) => {
        this.recentContrats = contrats.slice(0, 5); // 5 derniers contrats
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Erreur lors du chargement des contrats';
        this.isLoading = false;
        console.error('Error loading contrats:', error);
      }
    });
  }

  getStatusBadgeClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'disponible': 'badge-success',
      'loue': 'badge-warning',
      'vendu': 'badge-secondary',
      'reserve': 'badge-info',
      'indisponible': 'badge-danger'
    };
    return classes[statut] || 'badge-secondary';
  }

  getContractStatusBadgeClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'actif': 'badge-success',
      'resilie': 'badge-danger',
      'termine': 'badge-secondary'
    };
    return classes[statut] || 'badge-secondary';
  }
}

