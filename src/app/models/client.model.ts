import { User } from './user.model';

export interface ClientFormData {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  mot_de_passe?: string; // Optionnel pour l'édition
  type_utilisateur: 'locataire' | 'proprietaire' | 'agent';
  type_client: 'particulier' | 'societe' | 'investisseur';
  raison_sociale?: string;
  siret?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  pays?: string;
  confirm_password?: string;
}

export interface Client {
  _id?: string;
  id_utilisateur: User;
  type_client: 'particulier' | 'societe' | 'investisseur';
  raison_sociale?: string;
  siret?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  pays?: string;
  date_creation?: Date;
}

// Interface pour la création d'un client
export interface ClientCreateRequest {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  mot_de_passe: string; // ASSUREZ-VOUS QUE CETTE PROPRIÉTÉ EXISTE
  type_utilisateur: 'locataire' | 'proprietaire' | 'agent';
  type_client: 'particulier' | 'societe' | 'investisseur';
  raison_sociale?: string;
  siret?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  pays?: string;
}

// Interface pour la mise à jour d'un client
export interface ClientUpdateRequest {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  type_utilisateur?: 'locataire' | 'proprietaire' | 'agent';
  type_client?: 'particulier' | 'societe' | 'investisseur';
  raison_sociale?: string;
  siret?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  pays?: string;
  statut?: 'actif' | 'inactif' | 'suspendu';
}

