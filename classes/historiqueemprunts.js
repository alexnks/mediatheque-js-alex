import { Emprunt } from "./emprunt.js";

export class HistoriqueEmprunts {

    constructor() {
        this.historique = [];
    }
 
    ajouterEmprunt(emprunt) {
        this.historique.push(emprunt);
        this.sauvegarder();
    }

    supprimerEmprunt(index) {
        this.historique.splice(index, 1);
        this.sauvegarder();
    }

    vider() { 
        this.historique = [];
        this.sauvegarder();
    }

    sauvegarder() {
        localStorage.setItem("historique", JSON.stringify(this.historique));
    }

    charger() {
        const data = JSON.parse(localStorage.getItem("historique"));
        if (data) {
            this.historique = data.map(
                obj => new Emprunt(obj.lignes, obj.usager)
            );
        }
    }
}
