export type PatientForm1Data = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  pays: string;
  ville: string;
  codePostal: string;
  interventionRealisee: string;
  typesIntervention: string[];
  aideAujourdhui: string[];
};

export type PatientForm2Data = {
  quandIntervention: string;
  siPasEncore: string;
  technologieConnue: string;
  technologieDetail: string;
  commentVousSentez: string[];
  aideMaintenant: string[];
  accompagnementSouhaite: string;
};

export const patientForm1InterventionOptions = ['Oui', "Non, c'est en projet"] as const;

export const patientForm1TypeOptions = [
  'Liposuccion',
  'BBL',
  'Augmentation mammaire',
  'Lifting cervico-facial',
  'Autre',
] as const;

export const patientForm1AideOptions = [
  'Etre rassuree',
  'Comprendre ma recuperation',
  'Etre accompagnee',
  'Trouver un expert',
] as const;

export const patientForm2QuandOptions = [
  'Moins de 7 jours',
  '1 a 3 semaines',
  '1 a 3 mois',
  'Plus de 3 mois',
] as const;

export const patientForm2SiPasEncoreOptions = [
  "Moins d'1 mois",
  '1 a 3 mois',
  'Plus tard',
  'En reflexion',
] as const;

export const patientForm2TechnologieOptions = ['Oui', 'Non', 'Je ne sais pas'] as const;

export const patientForm2SentimentOptions = [
  'Stressee',
  'Perdue',
  'En manque d\'informations',
  'J\'ai des questions',
  'Je veux etre rassuree',
] as const;

export const patientForm2AideMaintenantOptions = [
  'Comprendre mon evolution',
  'Etre accompagnee',
  'Trouver un professionnel',
  'Preparer mon intervention',
] as const;

export const patientForm2AccompagnementOptions = [
  'Pres de chez moi',
  'A l\'etranger',
  'Les deux',
] as const;

export const patientCopy = {
  meta: {
    title: 'METCARE® — Accompagnement patient',
  },
  hero: {
    headline: "Vous n'etes pas seule apres votre intervention.",
    body:
      "Chaque jour des femmes prennent une decision importante. Changer. Se transformer. Se retrouver. Mais une fois l'intervention passee... c'est souvent la que tout commence. Le corps change. Les sensations evoluent. Les emotions aussi. Et beaucoup de patientes se retrouvent seules face a cette etape. Chez METCARE®, nous avons fait de cette phase une priorite.",
    ctaEchange: 'Je beneficie de mon echange offert',
    ctaGuide: 'Je recois mon guide patient',
  },
  sections: {
    repere: {
      label: 'UN PREMIER REPERE POUR VOUS',
      title: '',
      body:
        "Suite a votre demande, vous recevrez un guide patient offert. Un guide simple pour vous aider a: comprendre ce qui se passe apres votre intervention / savoir quoi observer / vous reperer dans les differentes etapes. Parce que comprendre... c'est deja se rassurer.",
    },
    normal: {
      label: 'CE QUE VOUS VIVEZ EST NORMAL',
      title: '',
      body:
        "Que vous ayez realise: une liposuccion / un BBL / un lifting cervico-facial / une augmentation mammaire / ou toute autre intervention. Vous pouvez ressentir: des doutes / de l'inconfort / un manque de reperes / des questions sans reponse. Et c'est normal. Mais cela ne devrait pas etre vecu seule.",
    },
    safety: {
      label: 'LA SECURITE AVANT TOUT — SAFETY PATIENT®',
      title: '',
      body:
        "Chez METCARE®, la securite du patient est au coeur de tout. Nous sommes a l'origine du label Safety Patient®, pense pour accompagner les patients avant et apres leur intervention. Vous n'etes pas seule. Vous etes entouree.",
    },
    expertise: {
      label: 'UNE EXPERTISE RECONNUE',
      title: '',
      body:
        'Depuis plus de 17 ans, METCARE® accompagne: plus de 8000 patients chaque annee / plus de 2500 chirurgiens partenaires / plus de 1300 experts specialises. Une approche structuree, dediee a la chirurgie esthetique et a l\'accompagnement perioperatoire en chirurgie esthetique.',
    },
    conciergerie: {
      label: 'UNE CONCIERGERIE ESTHETIQUE INTERNATIONALE',
      title: '',
      body:
        "Ou que vous soyez. Ou que vous ayez realise votre intervention. Nous vous permettons d'acceder a un reseau de professionnels qualifies, adaptes a votre situation et a votre parcours. Dans un cadre structure, securise et personalise.",
      cta: 'Je trouve un expert adapte a ma situation',
    },
    echange: {
      label: 'UN PREMIER ECHANGE SIMPLE ET OFFERT',
      title: '',
      body:
        "Vous pouvez beneficier d'un rendez-vous de mise en relation, entierement offert. Un echange d'environ 15 minutes pour faire le point sur votre situation et comprendre precisement vos besoins. Ce rendez-vous vous permet: d'etre ecoutee / d'etre orientee / de ne plus rester seule. Le patient est notre priorite. C'est pour cela que cet echange est propose sans engagement.",
      cta: 'Je beneficie de mon echange offert',
    },
    parcours: {
      label: 'VOTRE PARCOURS',
      title: '',
      intro: "Vous n'avez pas besoin de tout gerer seule.",
      steps: [
        'Vous nous partagez votre situation (intervention, besoin, localisation)',
        'Nous vous contactons pour un echange personalise',
        'Nous vous orientons vers les solutions adaptees.',
      ],
      outro: 'Simple, clair, structure.',
    },
    solutions: {
      label: 'VOS SOLUTIONS',
      title: '',
      body:
        'Selon votre situation, vous pouvez beneficier de: Accompagnement personalise / E-book complet 148 pages / Signature Recovery Protocol. Chaque solution est pensee pour vous.',
    },
    opportunite: {
      label: 'UNE OPPORTUNITE COMPLEMENTAIRE',
      title: '',
      body:
        'Selon votre profil, vous pouvez egalement acceder a: une liste d\'attente pour beneficier de soins encadres dans certaines villes (Paris et regions). Ces soins sont realises dans un cadre specifique, avec des professionnels formes a notre approche. Les places sont limitees.',
    },
    bonEndroit: {
      label: 'VOUS ETES AU BON ENDROIT',
      title: '',
      body:
        "Si vous etes ici... ce n'est probablement pas un hasard. Peut-etre que vous ressentez: le besoin d'etre rassuree / le besoin de comprendre / le besoin d'etre accompagnee. Et c'est exactement notre role.",
    },
    final: {
      body:
        'Parlons de votre situation. Prenez quelques instants pour nous expliquer votre parcours. Cela nous permet de vous orienter avec precision et de vous proposer un accompagnement adapte.',
      cta: 'Je beneficie de mon echange offert',
    },
  },
  form1: {
    title: 'Parlons de votre situation',
    intro:
      'En quelques secondes, expliquez-nous votre situation. Cela nous permet de vous orienter rapidement et de vous proposer un accompagnement adapte.',
    submit: 'Je beneficie de mon echange offert',
    fields: {
      nom: 'Nom',
      prenom: 'Prenom',
      email: 'Email',
      telephone: 'Telephone',
      pays: 'Pays',
      ville: 'Ville',
      codePostal: 'Code postal',
      intervention: 'Avez-vous deja realise votre intervention ?',
      typeIntervention: 'Quel type d\'intervention vous concerne ?',
      aide: "Qu'est-ce qui vous aiderait le plus aujourd'hui ?",
    },
  },
  transition: {
    title: 'Votre demande a bien ete prise en compte',
    body:
      'Merci pour votre confiance. Vous allez recevoir : votre guide patient / les premieres informations / et notre equipe pourra revenir vers vous rapidement. Avant cela...',
    prompt:
      'Prenez 1 minute pour nous en dire un peu plus. Cela nous permet de: mieux comprendre votre situation / adapter nos recommandations / vous orienter avec precision.',
    notice: 'Ce formulaire est facultatif. Mais il nous permet de vous accompagner avec precision.',
    cta: 'Je complete mon profil',
    skip: 'Passer cette etape',
    backHome: 'Retour',
  },
  form2: {
    title: 'Pour aller plus loin',
    intro: 'Ces informations nous permettent de vous accompagner avec precision.',
    submit: 'Je valide mon profil',
    thankYou:
      'Merci. Ces informations nous permettent de mieux vous accompagner. Notre equipe pourra revenir vers vous pour faire le point avec vous.',
    fields: {
      quand: 'Quand a eu lieu votre intervention ?',
      siPasEncore: 'Si elle n\'est pas encore realisee :',
      technologie: 'Connaissez-vous la technologie utilisee ou prevue ?',
      technologieDetail: 'Precisez la technologie',
      sentiment: 'Aujourd\'hui, comment vous sentez-vous ?',
      aideMaintenant: "Qu'est-ce qui vous aiderait le plus maintenant ?",
      accompagnement: 'Souhaitez-vous etre accompagnee :',
    },
  },
  ui: {
    noSession: 'Aucune demande en cours. Utilisez le formulaire sur la page d\'accueil.',
  },
} as const;
