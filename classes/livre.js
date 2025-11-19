export class Livre {
    constructor(id, titre, auteur, stock) {
        this.id = id;
        this.titre = titre;
        this.auteur = auteur;
        this.stock = stock;
    }

    augmenterStock(qte) {
        if (qte > 0) {
            this.stock += qte;
        }
    }

    diminuerStock(qte) {
        if (qte > 0 && this.stock - qte >= 0) {
            this.stock -= qte;
        }
    }

    description() {
        return `${this.titre} - ${this.auteur} (${this.stock} ex.)`;
    }
}
