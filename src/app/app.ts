// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.html',
//   styleUrl: './app.css'
// })
// export class App {
//   protected title = 'fiec-application';
// }

import { Component, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeFr, 'fr');
registerLocaleData(localeDe, 'de');

import html2pdf from 'html2pdf.js';
// declare var html2pdf: any; // Ajoute ceci en haut du fichier si tu n'as pas de types pour html2pdf

// Définition de l'interface Tableau1
interface Tableau1 {
  recette: string;
  societe: string;
  contact: string;
  localisation: string;
  activite: string;
  situation_classe: string;
  situation_ref: string;
  niu: string;
  dateInspection: string;
  agents: string;
  rapport: string;
  superficie_occ: string;
  superficie_non_bat: string;
}

export interface GazRow {
  capacite: string;
  quantite: number;
  frais: number;
  frais_hidden: number;
  pe1: number;
  pe2: number;
  pe3: number;
  majoration: number;
  majoration1: number;
  majoration2: number;
  majoration3: number;
  total: number;
}

// Valeurs par défaut pour réinitialiser le tableau gazRows
const defaultGazRows: GazRow[] = [
  { capacite: "Appareil de capacité au plus égale 30 litres : 400 FCFA", quantite: 0, frais: 0, frais_hidden: 400, pe1: 0, pe2: 0, pe3: 0, majoration: 0, majoration1: 0, majoration2: 0, majoration3: 0, total: 0 },
  { capacite: "Appareil de capacité comprise entre 30 et 100 litres : 800 FCFA", quantite: 0, frais: 0, frais_hidden: 800, pe1: 0, pe2: 0, pe3: 0, majoration: 0, majoration1: 0, majoration2: 0, majoration3: 0, total: 0 },
  { capacite: "Appareil de capacité comprise entre 100 et 1000 litres : 3000 FCFA", quantite: 0, frais: 0, frais_hidden: 3000, pe1: 0, pe2: 0, pe3: 0, majoration: 0, majoration1: 0, majoration2: 0, majoration3: 0, total: 0 },
  { capacite: "Appareil de capacité comprise entre 1000 et 3000 litres : 6000 FCFA", quantite: 0, frais: 0, frais_hidden: 6000, pe1: 0, pe2: 0, pe3: 0, majoration: 0, majoration1: 0, majoration2: 0, majoration3: 0, total: 0 },
  { capacite: "Appareil de capacité supérieure à 3000 litres : 10 000 FCFA", quantite: 0, frais: 0, frais_hidden: 10000, pe1: 0, pe2: 0, pe3: 0, majoration: 0, majoration1: 0, majoration2: 0, majoration3: 0, total: 0 }
];

// Exemple de données de test pour gazRows
// const testGazRows: GazRow[] = [
//   { capacite: "Appareil de capacité au plus égale 30 litres : 400 FCFA", quantite: 2, frais: 800, frais_hidden: 400, pe: 20, majoration: 0, total: 800 },
//   { capacite: "Appareil de capacité comprise entre 30 et 100 litres : 800 FCFA", quantite: 1, frais: 800, frais_hidden: 800, pe: 30, majoration: 400, total: 1200 },
//   { capacite: "Appareil de capacité comprise entre 100 et 1000 litres : 3000 FCFA", quantite: 0, frais: 0, frais_hidden: 3000, pe: 0, majoration: 0, total: 0 },
//   { capacite: "Appareil de capacité comprise entre 1000 et 3000 litres : 6000 FCFA", quantite: 0, frais: 0, frais_hidden: 6000, pe: 0, majoration: 0, total: 0 },
//   { capacite: "Appareil de capacité supérieure à 3000 litres : 10 000 FCFA", quantite: 0, frais: 0, frais_hidden: 10000, pe: 0, majoration: 0, total: 0 }
// ];

// Définition du type pour une ligne du tableau vapeur
export interface VapeurRow {
  categorie: string;
  quantite: number;
  frais: number;
  frais_hidden: number;
  total: number;
}

// Valeurs par défaut pour réinitialiser le tableau vapeurRows
const defaultVapeurRows: VapeurRow[] = [
  { categorie: "Chaudière de 1ere Catégorie : 40 000 FCFA", quantite: 0, frais: 0, frais_hidden: 40000, total: 0 },
  { categorie: "Chaudière de 2eme Catégorie : 24 000 FCFA", quantite: 0, frais: 0, frais_hidden: 24000, total: 0 },
  { categorie: "Chaudière de 3eme Catégorie : 16 000 FCFA", quantite: 0, frais: 0, frais_hidden: 16000, total: 0 }
];

// Exemple de données de test pour vapeurRows
const testVapeurRows: VapeurRow[] = [
  { categorie: "Chaudière de 1ere Catégorie : 40 000 FCFA", quantite: 1, frais: 40000, frais_hidden: 40000, total: 40000 },
  { categorie: "Chaudière de 2eme Catégorie : 24 000 FCFA", quantite: 2, frais: 48000, frais_hidden: 24000, total: 48000 },
  { categorie: "Chaudière de 3eme Catégorie : 16 000 FCFA", quantite: 0, frais: 0, frais_hidden: 16000, total: 0 }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  providers: [{ provide: LOCALE_ID, useValue: 'fr' }]
})
export class AppComponent {
  // Tableau 1 : Identification
  tableau1: Tableau1 = {
    recette: '',
    societe: '',
    contact: '',
    localisation: '',
    activite: '',
    situation_classe: '',
    situation_ref: '',
    niu: '',
    dateInspection: '',
    agents: '',
    rapport: '',
    superficie_occ: '',
    superficie_non_bat: ''
  };

  labelMap: { [key: string]: string } = {
    recette: 'Nature de la Recette',
    societe: 'Nom ou Raison sociale',
    contact: 'Adresses/Téléphones/email',
    localisation: 'Localisation',
    activite: 'Activité(s)',
    situation_classe: 'Situation administrative',
    situation_ref: 'Référence Arrêté/Décision',
    niu: 'NIU'
  };

   recapVisible = false;

  /**
   * Remplit le formulaire avec les valeurs d'un objet partiel.
   * Seuls les champs présents dans l'objet passé seront mis à jour.
   * @param obj Un objet partiel de type Tableau1
   */
  remplirFormulaire(obj: Partial<Tableau1>) {
    this.tableau1 = { ...this.tableau1, ...obj };
  }

  // Définition de la valeur par défaut pour Tableau1
  defaultTableau1: Tableau1 = {
    recette: '',
    societe: '',
    contact: '',
    localisation: '',
    activite: '',
    situation_classe: '',
    situation_ref: '',
    niu: '',
    dateInspection: '',
    agents: '',
    rapport: '',
    superficie_occ: '',
    superficie_non_bat: ''
  };

  /**
   * Réinitialise le formulaire avec les valeurs par défaut.
   */
  reinitialiserFormulaire() {
    this.tableau1 = { ...this.defaultTableau1 };
  }

  // Exemple de données de test
  donneesTest: Partial<Tableau1> = {
    recette: "Frais d'Inspection et de Contrôle(FIEC)",
    societe: "ELEGANCE PRESSING",
    contact: "Tél: 77 123 45 67, Email: elegance@gmail.com",
    localisation: "Bonassama - Bonaberi, Arrondissement de Douala 4ème",
    activite: "Pressing (lingerie industrielle)",
    situation_classe: "2ème",
    situation_ref: "Arrêté N° 123/2023 du 01/01/2023",
    niu: "1234567890",
    dateInspection: "2023-10-01",
    agents: "KEMENI RODRIGUE, BENA ALAIN",
    rapport: "2023-001",
    superficie_occ: "500 m²",
    superficie_non_bat: "300 m²"
  };

  // Pour tester le remplissage automatique :
  // this.remplirFormulaire(this.donneesTest);

  // Pour tester la réinitialisation :
  // this.reinitialiserFormulaire();

  // Tableau 2 : Appareils à pression à gaz
  aPression = false;
  gazRows: GazRow[] = [...defaultGazRows];
  get gazTotal() { return this.gazRows.reduce((sum, row) => sum + row.total, 0); }

  // Tableau 3 : Appareils vapeur d'eau
  vapeurRows: VapeurRow[] = [...defaultVapeurRows];
  get vapeurTotal() { return this.vapeurRows.reduce((sum, row) => sum + row.frais, 0); }



  // Pour l’itération sûre sur l’objet tableau1
  // objectKeys(obj: any): string[] {
  //   return Object.keys(obj);
  // }

  // ...
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
  objectTypedKeys<T extends object>(obj: T): Array<keyof T> {
    return Object.keys(obj) as Array<keyof T>;
  }


  app_a_gaz_30 : number = 0;
  app_a_gaz_100 : number = 0;
  app_a_gaz_1000 : number = 0;
  app_a_gaz_3000 : number = 0;
  app_a_gaz_other : number = 0;
  app_a_gaz_sup_30_total : number = 0;
  frais_visite: number = 0;
  app_a_pression: string = 'Non';

  // Calcul pour la ligne des frais
    updateFrais(i: number) {
      let row = this.gazRows[i];
      if (i = 1) {row.frais = row.quantite * row.frais_hidden; }
      if (i = 2) {row.frais = row.quantite * row.frais_hidden; }
      if (i = 3) {row.frais = row.quantite * row.frais_hidden; }
      if (i = 4) {row.frais = row.quantite * row.frais_hidden; }
      if (i = 5) {row.frais = row.quantite * row.frais_hidden; }
    }



    getQuantiteGaz30OuMoins(): number {
      // On suppose que le premier élément correspond à <= 30L
      this.app_a_gaz_30 = this.gazRows[0]?.quantite ? Number(this.gazRows[0].quantite) : 0;
      return this.app_a_gaz_30;
    }

    getQuantiteGaz100OuMoins(): number {
      // On suppose que le premier élément correspond à <= 30L
      this.app_a_gaz_100 = this.gazRows[1]?.quantite ? Number(this.gazRows[1].quantite) : 0;
      return this.app_a_gaz_100;
    }

    getQuantiteGaz1000OuMoins(): number {
      // On suppose que le premier élément correspond à <= 30L
      this.app_a_gaz_1000 = this.gazRows[2]?.quantite ? Number(this.gazRows[2].quantite) : 0;
      return this.app_a_gaz_1000;
    }

    getQuantiteGaz3000OuMoins(): number {
      // On suppose que le premier élément correspond à <= 30L
      this.app_a_gaz_3000 = this.gazRows[3]?.quantite ? Number(this.gazRows[3].quantite) : 0;
      return this.app_a_gaz_3000;
    }

    getQuantiteGaz3000OuPlus(): number {
      // On suppose que le premier élément correspond à <= 30L
      this.app_a_gaz_other = this.gazRows[4]?.quantite ? Number(this.gazRows[4].quantite) : 0;
      return this.app_a_gaz_other;
    }

    getQuantiteGazPlusDe30(): number {
      // On additionne les quantités des appareils > 30L (indices 1 à 4)
      this.app_a_gaz_sup_30_total = this.gazRows
        .slice(1)
        .reduce((sum, row) => sum + (Number(row.quantite) || 0), 0);
      return this.app_a_gaz_sup_30_total;
    }

    // Calcul pour la ligne gaz
    updateGazRow(i: number) {
      this.updateFrais(i);
      let row = this.gazRows[i];
      // SI PE <= 25 bars, pas de majoration (PE: Pression d'épreuve max saisie par l'utilisateur)
      row.majoration = 0;
      row.majoration1 = 0;
      row.majoration2 = 0;
      row.majoration3 = 0;
      if (row.pe1 > 25 && row.pe1 <= 250) row.majoration1 = row.frais * 0.5;
      if (row.pe1 > 250) row.majoration1 = row.frais * 1.0;
      if (row.pe2 > 25 && row.pe2 <= 250) row.majoration2 = row.frais * 0.5;
      if (row.pe2 > 250) row.majoration2 = row.frais * 1.0;
      if (row.pe3 > 25 && row.pe3 <= 250) row.majoration3 = row.frais * 0.5;
      if (row.pe3 > 250) row.majoration3 = row.frais * 1.0;
      row.majoration = row.majoration1 + row.majoration2 + row.majoration3; 
      row.total = row.frais + row.majoration;
    }

    // Calcul pour la ligne vapeur
    updateVapeurRow(i: number) {
      let row = this.vapeurRows[i];
      row.frais = row.quantite * row.frais_hidden;
      // row.total = row.quantite * row.frais_hidden;
    }

    fraisEpreuve(){
      this.frais_visite = 0;
      this.getQuantiteGaz30OuMoins();
      this.getQuantiteGazPlusDe30();
      // this.getQuantiteGaz100OuMoins();
      // this.getQuantiteGaz1000OuMoins();
      // this.getQuantiteGaz3000OuMoins();
      // this.getQuantiteGaz3000OuPlus();

      
      if (this.app_a_gaz_30 > 0 ) {
        this.frais_visite += 10000 * ((this.app_a_gaz_30 - this.app_a_gaz_30%10) / 10);
        if (this.app_a_gaz_30%10 > 0)
          this.frais_visite += 10000;
      }

      if (this.app_a_gaz_sup_30_total > 0) {
        this.frais_visite += 10000 * ((this.app_a_gaz_sup_30_total - this.app_a_gaz_sup_30_total%5) / 5);
        if (this.app_a_gaz_sup_30_total%5 > 0)
          this.frais_visite += 10000;
      }
      
      // if (this.app_a_gaz_100 > 0) {
      //   this.frais_visite += 10000 * ((this.app_a_gaz_100 - this.app_a_gaz_100%5) / 5);
      //   if (this.app_a_gaz_100%5 > 0)
      //     this.frais_visite += 10000;
      // }
      // if (this.app_a_gaz_1000 > 0) {
      //   this.frais_visite += 10000 * ((this.app_a_gaz_1000 - this.app_a_gaz_1000%5) / 5);
      //   if (this.app_a_gaz_1000%5 > 0)
      //     this.frais_visite += 10000;
      // }
      // if (this.app_a_gaz_3000 > 0) {
      //   this.frais_visite += 10000 * ((this.app_a_gaz_3000 - this.app_a_gaz_3000%5) / 5);
      //   if (this.app_a_gaz_3000%5 > 0)
      //     this.frais_visite += 10000;
      // }
      // // Pour les appareils à gaz de capacité supérieure à 3000 litres
      // if (this.app_a_gaz_other > 0) {
      // this.frais_visite += 10000 * ((this.app_a_gaz_other - this.app_a_gaz_other%5) / 5);
      // if (this.app_a_gaz_other%5 > 0)
      //   this.frais_visite += 10000;
      // }

      console.log("Frais de visite: " + this.frais_visite);
      console.log("app 30: " + this.app_a_gaz_30);
      // console.log("app 100: " + this.app_a_gaz_100);
      // console.log("app 1000: " + this.app_a_gaz_1000);
      // console.log("app 3000: " + this.app_a_gaz_3000);
      console.log("app plus de 30: " + this.app_a_gaz_sup_30_total);
      return this.frais_visite;
    }

    update_pression(){
      if (this.aPression) {
        // La case à cocher a été cochée
        this.app_a_pression = 'Oui';
      } else {
        // La case à cocher a été décochée
        this.app_a_pression = 'Non';
      }
    }

    majoration25bars() {
      // Calculer la majoration pour les appareils à gaz
      let majoration = 0;
      for (let row of this.gazRows) {
        if (row.pe1 > 25 && row.pe1 <= 250) {
          majoration += row.frais * 0.5; // 50% de majoration
        }
      }
      return majoration;
    }
    majoration250bars() {
      // Calculer la majoration pour les appareils à gaz
      let majoration = 0;
      for (let row of this.gazRows) {
        if (row.pe1 > 250) {
          majoration += row.frais * 1.0; // 100% de majoration
        }
      }
      return majoration;
    }

    totalRedevance() {
      // Calculer le total de la redevance
      let totalGaz = this.gazTotal;
      let totalVapeur = this.vapeurTotal;
      let majoration25 = this.majoration25bars();
      let majoration250 = this.majoration250bars();
      // console.log("Total Gaz: " + totalGaz);
      // console.log("Total Vapeur: " + totalVapeur);
      // console.log("Majoration 25 bars: " + majoration25);
      // console.log("Majoration 250 bars: " + majoration250);
      // let fraisVisite = this.fraisEpreuve();
      // return totalGaz + totalVapeur + majoration25 + majoration250 ;
      return totalGaz + totalVapeur ;
    }

    getTotalGeneral() {
      // Retourne le total général de la redevance
      return this.totalRedevance() + this.fraisEpreuve();
    }
    

    // Afficher le récapitulatif
    afficherRecap() {
      this.recapVisible = true;
    }
    // Cacher le récapitulatif
    cacherRecap() {
      this.recapVisible = false;
    }
      

    downloadPDF() {
    const element = document.getElementById('resume-pdf');
    if (!element) return;

    html2canvas(element, { scale: 2 }).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('recapitulatif.pdf');
    });
  }


  /**
   * Remplit le tableau gazRows avec des données de test
   */
  // genererGazRows() {
  //   this.gazRows = testGazRows.map(row => ({ ...row }));
  // }

  /**
   * Réinitialise le tableau gazRows à ses valeurs par défaut
   */
  reinitialiserGazRows() {
    this.gazRows = defaultGazRows.map(row => ({ ...row }));
  }

  /**
   * Remplit le tableau vapeurRows avec des données de test
   */
  genererVapeurRows() {
    this.vapeurRows = testVapeurRows.map(row => ({ ...row }));
  }

  /**
   * Réinitialise le tableau vapeurRows à ses valeurs par défaut
   */
  reinitialiserVapeurRows() {
    this.vapeurRows = defaultVapeurRows.map(row => ({ ...row }));
  }

  printFile() {
    // const element = document.body; // ou document.getElementById('resume-pdf')
    const element = document.getElementById('part2');
    const opt = {
      margin: [10, 0, 0, 0],
      filename: 'État des Sommes Dues - Cameroun.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try {
      if (typeof html2pdf !== 'undefined' && html2pdf) {
        html2pdf().set(opt).from(element).save();
      } else {
        throw new Error('html2pdf indisponible');
      }
    } catch (e) {
      console.warn('html2pdf.js indisponible, utilisation de window.print().', e);
      window.print();
    }
  }

  chiffresEnLettres(n: number | string): string {
    const unite = [
      "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"
    ];
    const dizaine = [
      "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"
    ];
    const dizaine2 = [
      "", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"
    ];

    if (typeof n === "string") {
      n = n.replace(/[.\s]/g, "");
      n = parseInt(n, 10);
    }
    if (isNaN(n as number)) return "";

    if ((n as number) < 0) return "moins " + this.chiffresEnLettres(-(n as number));
    if ((n as number) < 10) return unite[n as number];
    if ((n as number) < 20) return dizaine[(n as number) - 10];
    if ((n as number) < 100) {
      let t = Math.floor((n as number) / 10), u = (n as number) % 10;
      if (t === 7 || t === 9) {
        return dizaine2[t] + (u === 1 ? "-et-" : "-") + dizaine[u];
      }
      if (t === 8 && u === 0) return "quatre-vingts";
      if (u === 1 && t !== 8) return dizaine2[t] + " et un";
      return dizaine2[t] + (u ? "-" + unite[u] : "");
    }
    if ((n as number) < 200)
      return "cent" + ((n as number) > 100 ? " " + this.chiffresEnLettres((n as number) - 100) : "");
    if ((n as number) < 1000) {
      let c = Math.floor((n as number) / 100), r = (n as number) % 100;
      return (
        unite[c] +
        " cent" +
        (c > 1 && r === 0 ? "s" : "") +
        (r ? " " + this.chiffresEnLettres(r) : "")
      );
    }
    if ((n as number) < 2000)
      return "mille" + ((n as number) > 1000 ? " " + this.chiffresEnLettres((n as number) - 1000) : "");
    if ((n as number) < 1000000) {
      let m = Math.floor((n as number) / 1000), r = (n as number) % 1000;
      return (
        (m > 1 ? this.chiffresEnLettres(m) + " mille" : "mille") +
        (r ? " " + this.chiffresEnLettres(r) : "")
      );
    }
    if ((n as number) < 2000000)
      return (
        "un million" +
        ((n as number) > 1000000 ? " " + this.chiffresEnLettres((n as number) - 1000000) : "")
      );
    if ((n as number) < 1000000000) {
      let millions = Math.floor((n as number) / 1000000),
        reste = (n as number) % 1000000;
      return (
        this.chiffresEnLettres(millions) +
        " millions" +
        (reste ? " " + this.chiffresEnLettres(reste) : "")
      );
    }
    if ((n as number) === 1000000000) return "un milliard";
    return (n as number).toString();
  }

}
