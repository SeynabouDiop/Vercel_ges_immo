export interface TypeBien {
  _id?: string;
  libelle: string;
  description?: string;
  date_creation?: Date;
}

export interface BienImmobilier {
  _id?: string;
  reference: string;
  id_proprietaire: string;
  id_agent?: string;
  id_type_bien: string;
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
  date_creation?: Date;
  date_modification?: Date;

  // Relations populées
  type_bien?: TypeBien;
  proprietaire?: any;
  agent?: any;
  caracteristiques?: any[];
}

export interface BienCreateRequest {
  id_type_bien: string;
  titre: string;
  description?: string;
  adresse: string;
  complement_adresse?: string;
  code_postal: string;
  ville: string;
  pays?: string;
  surface_habitable: number;
  surface_terrain?: number;
  nb_pieces?: number;
  nb_chambres?: number;
  nb_sdb?: number;
  nb_wc?: number;
  annee_construction?: number;
  dpe_energie?: string;
  dpe_ges?: string;
  etat_bien: string;
  statut?: string;
  prix_vente?: number;
  prix_location?: number;
  charges_mensuelles?: number;
  depot_garantie?: number;
}

export interface BienUpdateRequest {
  id_type_bien?: string;
  titre?: string;
  description?: string;
  adresse?: string;
  complement_adresse?: string;
  code_postal?: string;
  ville?: string;
  pays?: string;
  surface_habitable?: number;
  surface_terrain?: number;
  nb_pieces?: number;
  nb_chambres?: number;
  nb_sdb?: number;
  nb_wc?: number;
  annee_construction?: number;
  dpe_energie?: string;
  dpe_ges?: string;
  etat_bien?: string;
  statut?: string;
  prix_vente?: number;
  prix_location?: number;
  charges_mensuelles?: number;
  depot_garantie?: number;
}




