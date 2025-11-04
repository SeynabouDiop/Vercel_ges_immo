export interface Caracteristique {
  _id?: string;
  libelle: string;
  categorie: 'interieur' | 'exterieur' | 'securite' | 'energie' | 'confort';
  date_creation?: Date;
}

export interface BienCaracteristique {
  id_bien: string;
  id_caracteristique: string;
  valeur: string;
  caracteristique?: Caracteristique;
}

export interface CaracteristiqueBien {
  _id: string;
  libelle: string;
  categorie: string;
  valeur?: string;
}
