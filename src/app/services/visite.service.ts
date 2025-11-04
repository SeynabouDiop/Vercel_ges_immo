import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Visite, VisiteCreateRequest, VisiteUpdateRequest } from '../models/visite.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisiteService {

  private apiUrl = `${environment.apiUrl}/visites`;

  constructor(private http: HttpClient) { }

  createVisite(visiteData: VisiteCreateRequest): Observable<Visite> {
    return this.http.post<Visite>(this.apiUrl, visiteData);
  }

  getAllVisites(params?: any): Observable<Visite[]> {
    return this.http.get<Visite[]>(this.apiUrl, { params });
  }

  getVisiteById(id: string): Observable<Visite> {
    return this.http.get<Visite>(`${this.apiUrl}/${id}`);
  }

  updateVisite(id: string, visiteData: VisiteUpdateRequest): Observable<Visite> {
    return this.http.put<Visite>(`${this.apiUrl}/${id}`, visiteData);
  }

  deleteVisite(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getVisitesByAgent(agentId: string): Observable<Visite[]> {
    return this.http.get<Visite[]>(`${this.apiUrl}/agent/${agentId}`);
  }

  getVisitesByBien(bienId: string): Observable<Visite[]> {
    return this.http.get<Visite[]>(`${this.apiUrl}/bien/${bienId}`);
  }

}
