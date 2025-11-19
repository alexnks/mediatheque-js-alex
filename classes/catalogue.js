import { Livre } from "./livre.js";

export class Catalogue {
    constructor() {
        this.livres = [];
    } 

    ajouterLivre(livre) {
        this.livres.push(livre);
        this.sauvegarder();
    }

    supprimerLivre(id) {
        this.livres = this.livres.filter(l => l.id != id);
        this.sauvegarder();
    }

    rechercherLivre(id) {
        return this.livres.find(l => l.id == id);
    }

    sauvegarder() {
        localStorage.setItem("catalogue", JSON.stringify(this.livres));
    }

    charger() {
        const data = JSON.parse(localStorage.getItem("catalogue"));
        if (data) {
            this.livres = data.map(
                obj => new Livre(obj.id, obj.titre, obj.auteur, obj.stock)
            );
        }
    }
}
