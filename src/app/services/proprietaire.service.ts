import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BienImmobilier, Contrat, ProprietaireStats } from '../models/proprietaire.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProprietaireService {

  private apiUrl = `${environment.apiUrl}/proprietaires`;

  constructor(private http: HttpClient) { }

  // Profil propriétaire
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  // Biens immobiliers
  getBiens(): Observable<BienImmobilier[]> {
    return this.http.get<BienImmobilier[]>(`${this.apiUrl}/biens`);
  }

  getBienById(id: string): Observable<BienImmobilier> {
    return this.http.get<BienImmobilier>(`${this.apiUrl}/biens/${id}`);
  }

  createBien(bienData: any): Observable<BienImmobilier> {
    return this.http.post<BienImmobilier>(`${this.apiUrl}/biens`, bienData);
  }

  updateBien(id: string, bienData: any): Observable<BienImmobilier> {
    return this.http.put<BienImmobilier>(`${this.apiUrl}/biens/${id}`, bienData);
  }

  // Contrats
  getContrats(): Observable<Contrat[]> {
    return this.http.get<Contrat[]>(`${this.apiUrl}/contrats`);
  }

  // Statistiques
  getStatistiques(): Observable<ProprietaireStats> {
    return this.http.get<ProprietaireStats>(`${this.apiUrl}/statistiques`);
  }

}
