import { LigneEmprunt } from "./ligneemprunt.js";

export class EmpruntEnCours {

    constructor() {
        this.lignes = [];  
    }
 
    ajouterLivre(livre, quantite) {

        const ligneExistante = this.lignes.find(l => l.livre.id === livre.id);

        if (ligneExistante) {
            ligneExistante.quantite += quantite;
        } else {
            this.lignes.push(new LigneEmprunt(livre, quantite));
        }
    }

    supprimerLigne(idLivre) {
        this.lignes = this.lignes.filter(l => l.livre.id !== idLivre);
    }

    vider() { 
        this.lignes = [];
    }
}
