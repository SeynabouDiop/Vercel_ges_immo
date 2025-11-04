import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BienCaracteristique, Caracteristique, CaracteristiqueBien } from '../models/caracteristique.model';

@Injectable({
  providedIn: 'root'
})
export class CaracteristiqueService {

  private apiUrl = `${environment.apiUrl}/caracteristiques`;

  constructor(private http: HttpClient) { }

  // Gestion des caractéristiques
  getAllCaracteristiques(): Observable<Caracteristique[]> {
    return this.http.get<Caracteristique[]>(this.apiUrl);
  }

  getCaracteristiquesByCategorie(categorie: string): Observable<Caracteristique[]> {
    return this.http.get<Caracteristique[]>(`${this.apiUrl}/categorie/${categorie}`);
  }

  getCaracteristiqueById(id: string): Observable<Caracteristique> {
    return this.http.get<Caracteristique>(`${this.apiUrl}/${id}`);
  }

  createCaracteristique(caracteristique: Omit<Caracteristique, '_id'>): Observable<Caracteristique> {
    return this.http.post<Caracteristique>(this.apiUrl, caracteristique);
  }

  updateCaracteristique(id: string, caracteristique: Partial<Caracteristique>): Observable<Caracteristique> {
    return this.http.put<Caracteristique>(`${this.apiUrl}/${id}`, caracteristique);
  }

  deleteCaracteristique(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Gestion des caractéristiques des biens
  getCaracteristiquesByBien(idBien: string): Observable<CaracteristiqueBien[]> {
    return this.http.get<CaracteristiqueBien[]>(`${this.apiUrl}/bien/${idBien}`);
  }

  addCaracteristiqueToBien(bienCaracteristique: Omit<BienCaracteristique, 'caracteristique'>): Observable<BienCaracteristique> {
    return this.http.post<BienCaracteristique>(`${this.apiUrl}/bien`, bienCaracteristique);
  }

  updateCaracteristiqueBien(idBien: string, idCaracteristique: string, valeur: string): Observable<BienCaracteristique> {
    return this.http.put<BienCaracteristique>(`${this.apiUrl}/bien/${idBien}/${idCaracteristique}`, { valeur });
  }

  removeCaracteristiqueFromBien(idBien: string, idCaracteristique: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bien/${idBien}/${idCaracteristique}`);
  }

  // Catégories disponibles
  getCategories(): string[] {
    return ['interieur', 'exterieur', 'securite', 'energie', 'confort'];
  }

}
