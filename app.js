// ========== IMPORT DES CLASSES =====================
import { Livre } from "./livre.js";
import { Catalogue } from "./catalogue.js";
import { LigneEmprunt } from "./ligneemprunt.js";
import { EmpruntEnCours } from "./empruntencours.js";
import { Emprunt } from "./emprunt.js";
import { HistoriqueEmprunts } from "./historiqueemprunts.js";
 

// ========== CREATION DES OBJETS PRINCIPAUX ========================================
const catalogue = new Catalogue();
catalogue.charger();

const empruntEnCours = new EmpruntEnCours();

const historique = new HistoriqueEmprunts();
historique.charger();


// ========== RECUPERATION DES ELEMENTS HTML ===========================
const formAjoutLivre = document.getElementById("form-ajout-livre");
const tableLivresBody = document.querySelector("#table-livres tbody");

const selectLivre = document.getElementById("select-livre");
const quantiteInput = document.getElementById("quantite");
const ajouterLigneBtn = document.getElementById("ajouter-ligne");
const tableEmpruntBody = document.querySelector("#table-emprunt tbody");
const validerEmpruntBtn = document.getElementById("valider-emprunt");

const tableHistoriqueBody = document.querySelector("#table-historique tbody");
const viderHistoriqueBtn = document.getElementById("vider-historique");


// ========== FONCTIONS D'AFFICHAGE SIMPLES ==========

function afficherCatalogue() {
    tableLivresBody.innerHTML = "";

    for (let livre of catalogue.livres) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${livre.id}</td>
            <td>${livre.titre}</td>
            <td>${livre.auteur}</td>
            <td>${livre.stock}</td>
            <td><button class="btn-supprimer-livre" data-id="${livre.id}">Supprimer</button></td>
        `;
 
        tableLivresBody.appendChild(tr);
    }

    afficherSelectLivres();
}

function afficherSelectLivres() {
    selectLivre.innerHTML = "";

    for (let livre of catalogue.livres) {
        const option = document.createElement("option");
        option.value = livre.id;
        option.textContent = livre.titre + " (" + livre.stock + ")";
        selectLivre.appendChild(option);
    }
}

function afficherEmpruntEnCours() {
    tableEmpruntBody.innerHTML = "";

    for (let l of empruntEnCours.lignes) {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${l.livre.titre}</td>
            <td>${l.quantite}</td>
            <td><button class="btn-supprimer-ligne" data-id="${l.livre.id}">X</button></td>
        `;

        tableEmpruntBody.appendChild(tr);
    }
}

function afficherHistorique() {
    tableHistoriqueBody.innerHTML = "";

    for (let i = 0; i < historique.historique.length; i++) {
        const emp = historique.historique[i];

        let details = "";
        for (let l of emp.lignes) {
            details += `${l.livre.titre} (${l.quantite}), `;
        }

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${emp.date}</td>
            <td>${details}</td>
            <td><button class="btn-supprimer-emprunt" data-index="${i}">Supprimer</button></td>
        `;

        tableHistoriqueBody.appendChild(tr);
    }
}


// ========== EVENEMENTS (VERSION SIMPLE) ==========

formAjoutLivre.addEventListener("submit", function (e) {
    e.preventDefault();

    const titre = document.getElementById("titre").value;
    const auteur = document.getElementById("auteur").value;
    const stock = parseInt(document.getElementById("stock").value);

    const id = Date.now(); 

    const livre = new Livre(id, titre, auteur, stock);
    catalogue.ajouterLivre(livre);

    afficherCatalogue();
    formAjoutLivre.reset();
});

tableLivresBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-supprimer-livre")) {
        const id = e.target.dataset.id;
        catalogue.supprimerLivre(id);
        afficherCatalogue();
    }
});

ajouterLigneBtn.addEventListener("click", function () {
    const idLivre = Number(selectLivre.value);    
    const quantite = Number(quantiteInput.value);  

    if (!quantite || quantite <= 0) {
        alert("Quantité invalide");
        return;
    }

    const livre = catalogue.rechercherLivre(idLivre);

    if (quantite > livre.stock) {
        alert("Stock insuffisant ! Il reste " + livre.stock + " exemplaires.");
        return;
    }

    empruntEnCours.ajouterLivre(livre, quantite);

    afficherEmpruntEnCours();
    quantiteInput.value = "";
});


tableEmpruntBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-supprimer-ligne")) {

        const id = Number(e.target.dataset.id);

        empruntEnCours.supprimerLigne(id);
        afficherEmpruntEnCours();
    }
});


validerEmpruntBtn.addEventListener("click", function () {

    for (let l of empruntEnCours.lignes) {
        if (l.quantite > l.livre.stock) {
            alert("Stock insuffisant pour " + l.livre.titre);
            return;
        }
    }

    for (let l of empruntEnCours.lignes) {
        l.livre.diminuerStock(l.quantite);
    }
    catalogue.sauvegarder();

    const emprunt = new Emprunt(empruntEnCours.lignes);
    historique.ajouterEmprunt(emprunt);

    empruntEnCours.vider();

    afficherCatalogue();
    afficherEmpruntEnCours();
    afficherHistorique();
});

tableHistoriqueBody.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-supprimer-emprunt")) {
        const index = e.target.dataset.index;
        historique.supprimerEmprunt(index);
        afficherHistorique();
    }
});

viderHistoriqueBtn.addEventListener("click", function () {
    if (confirm("Vidage total ?")) {
        historique.vider();
        afficherHistorique();
    }
});

async function exporterHistorique() {
    const msg = document.getElementById("message-export");

    msg.textContent = "Export en cours...";

    await new Promise(resolve => setTimeout(resolve, 1000));

    msg.textContent = "Export terminé ! (simulation)";
}
const exporterHistoriqueBtn = document.getElementById("exporter-historique");

exporterHistoriqueBtn.addEventListener("click", function() {
    exporterHistorique();
});

// ========== AFFICHAGE INITIAL ==========
afficherCatalogue();
afficherEmpruntEnCours();
afficherHistorique();
