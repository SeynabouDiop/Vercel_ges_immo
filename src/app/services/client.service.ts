import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, ClientCreateRequest, ClientUpdateRequest } from '../models/client.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) { }

  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(this.apiUrl);
  }

  getClientById(id: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  createClient(clientData: ClientCreateRequest): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, clientData);
  }

  updateClient(id: string, clientData: ClientUpdateRequest): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/${id}`, clientData);
  }

  deleteClient(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getProfile(): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/profile/me`);
  }

  updateProfile(profileData: ClientUpdateRequest): Observable<Client> {
    return this.http.put<Client>(`${this.apiUrl}/profile/me`, profileData);
  }
}
