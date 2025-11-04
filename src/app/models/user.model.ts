export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  type_utilisateur: 'admin' | 'agent' | 'proprietaire' | 'locataire';
  statut: 'actif' | 'inactif' | 'suspendu';
  date_creation: Date;
  date_modification: Date;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  mot_de_passe: string;
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  mot_de_passe: string;
  type_utilisateur: string;
}

