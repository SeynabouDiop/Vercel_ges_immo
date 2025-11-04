import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BienCreateRequest, BienImmobilier, BienUpdateRequest, TypeBien } from '../models/bien-immobilier.model';

@Injectable({
  providedIn: 'root'
})
export class BienImmobilierService {

  private apiUrl = `${environment.apiUrl}/biens`;

  constructor(private http: HttpClient) { }

  // Gestion des types de bien
  getTypesBien(): Observable<TypeBien[]> {
    return this.http.get<TypeBien[]>(`${this.apiUrl}/types`);
  }

  createTypeBien(typeBien: Omit<TypeBien, '_id'>): Observable<TypeBien> {
    return this.http.post<TypeBien>(`${this.apiUrl}/types`, typeBien);
  }

  updateTypeBien(id: string, typeBien: Partial<TypeBien>): Observable<TypeBien> {
    return this.http.put<TypeBien>(`${this.apiUrl}/types/${id}`, typeBien);
  }

  deleteTypeBien(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/types/${id}`);
  }

  // Gestion des biens immobiliers
  getAllBiens(): Observable<BienImmobilier[]> {
    return this.http.get<BienImmobilier[]>(this.apiUrl);
  }

  getBiensByProprietaire(idProprietaire: string): Observable<BienImmobilier[]> {
    return this.http.get<BienImmobilier[]>(`${this.apiUrl}/proprietaire/${idProprietaire}`);
  }

  getBienById(id: string): Observable<BienImmobilier> {
    return this.http.get<BienImmobilier>(`${this.apiUrl}/${id}`);
  }

  createBien(bienData: BienCreateRequest): Observable<BienImmobilier> {
    return this.http.post<BienImmobilier>(this.apiUrl, bienData);
  }

  updateBien(id: string, bienData: BienUpdateRequest): Observable<BienImmobilier> {
    return this.http.put<BienImmobilier>(`${this.apiUrl}/${id}`, bienData);
  }

  deleteBien(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Recherche et filtres
  searchBiens(filters: any): Observable<BienImmobilier[]> {
    return this.http.post<BienImmobilier[]>(`${this.apiUrl}/search`, filters);
  }

  getBiensDisponibles(): Observable<BienImmobilier[]> {
    return this.http.get<BienImmobilier[]>(`${this.apiUrl}/disponibles`);
  }

  // Gestion des photos
  uploadPhotos(bienId: string, photos: File[]): Observable<any> {
    const formData = new FormData();
    photos.forEach(photo => {
      formData.append('photos', photo);
    });
    return this.http.post(`${this.apiUrl}/${bienId}/photos`, formData);
  }

  deletePhoto(bienId: string, photoName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${bienId}/photos/${photoName}`);
  }

  // Statistiques
  getStatistiques(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistiques`);
  }

}
