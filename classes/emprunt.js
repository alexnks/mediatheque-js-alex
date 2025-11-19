export class Emprunt {
    constructor(lignes, usager = "Anonyme") {
        this.date = new Date().toLocaleString();
        this.lignes = lignes;  
        this.usager = usager;
    }
}
 