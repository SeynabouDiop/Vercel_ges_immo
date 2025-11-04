export interface Visite {
  _id?: string;
  id_bien: {
    _id: string;
    titre: string;
    adresse: string;
    ville: string;
    prix_location?: number;
    prix_vente?: number;
    surface_habitable?: number;
    photos?: string[];
  };
  id_agent: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
  };
  id_client?: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
  };
  date_visite: Date;
  duree_estimee: number;
  statut: 'planifiee' | 'confirmee' | 'terminee' | 'annulee';
  notes?: string;
  resultat?: 'interesse' | 'non_interesse' | 'a_revoir';
  date_creation: Date;
}

export interface VisiteCreateRequest {
  id_bien: string;
  id_client?: string;
  date_visite: Date;
  duree_estimee?: number;
  notes?: string;
}

export interface VisiteUpdateRequest {
  statut?: 'planifiee' | 'confirmee' | 'terminee' | 'annulee';
  notes?: string;
  resultat?: 'interesse' | 'non_interesse' | 'a_revoir';
}
