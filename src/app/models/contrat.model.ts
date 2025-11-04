export interface ContratLocation {
  _id?: string;
  id_bien: {
    _id: string;
    titre: string;
    adresse: string;
    ville: string;
    surface_habitable: number;
    nb_pieces?: number;
    description?: string;
  };
  id_locataire: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
  };
  id_agent?: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
  };
  numero_contrat: string;
  date_debut: Date;
  date_fin?: Date;
  duree_bail: number;
  loyer_mensuel: number;
  charges_mensuelles: number;
  depot_garantie: number;
  index_depart?: number;
  date_etat_lieux?: Date;
  statut: 'actif' | 'resilie' | 'termine';
  conditions_particulieres?: string;
  date_creation: Date;
}

export interface ContratCreateRequest {
  id_bien: string;
  id_locataire: string;
  date_debut: Date;
  date_fin?: Date;
  duree_bail: number;
  loyer_mensuel: number;
  charges_mensuelles?: number;
  depot_garantie: number;
  index_depart?: number;
  date_etat_lieux?: Date;
  conditions_particulieres?: string;
}

export interface ContratUpdateRequest {
  date_fin?: Date;
  loyer_mensuel?: number;
  charges_mensuelles?: number;
  statut?: 'actif' | 'resilie' | 'termine';
  conditions_particulieres?: string;
}
