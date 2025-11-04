export interface Proprietaire {
  _id?: string;
  id_utilisateur: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    telephone?: string;
  };
  date_inscription: Date;
  specialite: 'residentiel' | 'commercial' | 'luxe' | 'mixte';
  experience: number;
  notes?: string;
  statut: 'actif' | 'inactif' | 'en_attente';
}

export interface BienImmobilier {
  _id?: string;
  reference: string;
  id_proprietaire: string;
  id_type_bien: {
    _id: string;
    libelle: string;
  };
  titre: string;
  description?: string;
  adresse: string;
  complement_adresse?: string;
  code_postal: string;
  ville: string;
  pays: string;
  latitude?: number;
  longitude?: number;
  surface_habitable: number;
  surface_terrain?: number;
  nb_pieces?: number;
  nb_chambres?: number;
  nb_sdb?: number;
  nb_wc?: number;
  annee_construction?: number;
  dpe_energie?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  dpe_ges?: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  etat_bien: 'neuf' | 'excellent' | 'bon' | 'renovation' | 'travaux';
  statut: 'disponible' | 'loue' | 'vendu' | 'reserve' | 'indisponible';
  prix_vente?: number;
  prix_location?: number;
  charges_mensuelles: number;
  depot_garantie?: number;
  photos: string[];
  date_creation: Date;
  date_modification: Date;
}

export interface Contrat {
  _id?: string;
  id_bien: {
    _id: string;
    titre: string;
    adresse: string;
    ville: string;
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

export interface ProprietaireStats {
  totalBiens: number;
  biensLoues: number;
  biensDisponibles: number;
  revenuMensuel: number;
  tauxOccupation: number;
  totalContrats: number;
}

export interface TypeBien {
  _id: string;
  libelle: string;
  description?: string;
}
