/**
 * Attribution of the vehicle photos (Wikimedia Commons, CC BY-SA). The licence requires crediting
 * the author, linking the licence and the source ; shown on /credits-photos (ADR-0024).
 * Vehicle photos show cars of the same model, not the agency's own cars ; the home background is the
 * Route des Crêtes between Cassis and La Ciotat.
 */
export type PhotoCredit = {
  subject: string
  file: string
  title: string
  author: string
  license: string
  licenseUrl: string
  source: string
}

export const PHOTO_CREDITS: readonly PhotoCredit[] = [
  {
    subject: "Page d'accueil (image de fond)",
    file: '/images/hero-route-des-cretes.jpg',
    title: 'Route des cretes P1010172mod.jpg',
    author: 'JYB Devot',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Route_des_cretes_P1010172mod.jpg',
  },
  {
    subject: 'Audi A3 Sportback',
    file: '/images/vehicles/audi-a3-sportback-1.jpg',
    title: "AUDI A3 SPORTBACK (Typ 8Y) China (10).jpg",
    author: "Dinkun Chen",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:AUDI_A3_SPORTBACK_(Typ_8Y)_China_(10).jpg",
  },
  {
    subject: 'Audi Q5',
    file: '/images/vehicles/audi-q5-1.jpg',
    title: "Audi Q5 FY Facelift IMG 4139.jpg",
    author: "Alexander Migl",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Audi_Q5_FY_Facelift_IMG_4139.jpg",
  },
  {
    subject: 'Audi RS 3 Sportback',
    file: '/images/vehicles/audi-rs3-1.jpg',
    title: "Audi RS 3 Sportback (55078405594).jpg",
    author: "Alexandre Prevot from Nancy, France",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Audi_RS_3_Sportback_(55078405594).jpg",
  },
  {
    subject: 'BMW Série 1',
    file: '/images/vehicles/bmw-serie-1-1.jpg',
    title: "BMW 120 (F70) IMG 1166.jpg",
    author: "Alexander-93",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:BMW_120_(F70)_IMG_1166.jpg",
  },
  {
    subject: 'BMW X3',
    file: '/images/vehicles/bmw-x3-1.jpg',
    title: "BMW G45 20 DSC 7119.jpg",
    author: "Alexander Migl",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:BMW_G45_20_DSC_7119.jpg",
  },
  {
    subject: 'BMW M4 Coupé',
    file: '/images/vehicles/bmw-m4-1.jpg',
    title: "BMW M4 (G82) Competition 1X7A0305.jpg",
    author: "Alexander Migl",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:BMW_M4_(G82)_Competition_1X7A0305.jpg",
  },
  {
    subject: 'Renault Rafale',
    file: '/images/vehicles/renault-rafale-1.jpg',
    title: "Renault Rafale IMG 8990.jpg",
    author: "Alexander-93",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Renault_Rafale_IMG_8990.jpg",
  },
  {
    subject: 'Renault Clio',
    file: '/images/vehicles/renault-clio-1.jpg',
    title: "Renault Clio V (2023) Esprit Alpine Automesse Ludwigsburg 2023 1X7A0012.jpg",
    author: "Alexander-93",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Renault_Clio_V_(2023)_Esprit_Alpine_Automesse_Ludwigsburg_2023_1X7A0012.jpg",
  },
  {
    subject: 'Mercedes-Benz Classe A',
    file: '/images/vehicles/mercedes-classe-a-1.jpg',
    title: "MERCEDES-BENZ A-CLASS (W177) China (2).jpg",
    author: "Dinkun Chen",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:MERCEDES-BENZ_A-CLASS_(W177)_China_(2).jpg",
  },
  {
    subject: 'Volkswagen Golf GTI',
    file: '/images/vehicles/vw-golf-gti-1.jpg',
    title: "Volkswagen Golf VIII GTI Clubsport 45 1X7A0298.jpg",
    author: "Alexander Migl",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Volkswagen_Golf_VIII_GTI_Clubsport_45_1X7A0298.jpg",
  },
]
