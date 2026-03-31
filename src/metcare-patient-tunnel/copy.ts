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

export const getPatientForm1InterventionOptions = (lang: 'fr' | 'en') => 
  lang === 'fr' ? ['Oui', "Non, c'est en projet"] as const : ['Yes', "No, it's a project"] as const;

export const getPatientForm1TypeOptions = (lang: 'fr' | 'en') => 
  lang === 'fr' 
    ? ['Liposuccion', 'BBL', 'Augmentation mammaire', 'Lifting cervico-facial', 'Autre'] as const
    : ['Liposuction', 'BBL', 'Breast Augmentation', 'Face Lift', 'Other'] as const;

export const getPatientForm1AideOptions = (lang: 'fr' | 'en') => 
  lang === 'fr'
    ? ['Etre rassuree', 'Comprendre ma recuperation', 'Etre accompagnee', 'Trouver un expert'] as const
    : ['Be reassured', 'Understand my recovery', 'Be accompanied', 'Find an expert'] as const;

export const getPatientForm2QuandOptions = (lang: 'fr' | 'en') => 
  lang === 'fr'
    ? ['Moins de 7 jours', '1 a 3 semaines', '1 a 3 mois', 'Plus de 3 mois'] as const
    : ['Less than 7 days', '1 to 3 weeks', '1 to 3 months', 'More than 3 months'] as const;

export const getPatientForm2SiPasEncoreOptions = (lang: 'fr' | 'en') => 
  lang === 'fr'
    ? ["Moins d'1 mois", '1 a 3 mois', 'Plus tard', 'En reflexion'] as const
    : ['Less than 1 month', '1 to 3 months', 'Later', 'In reflection'] as const;

export const getPatientForm2TechnologieOptions = (lang: 'fr' | 'en') => 
  lang === 'fr' ? ['Oui', 'Non', 'Je ne sais pas'] as const : ['Yes', 'No', 'I don\'t know'] as const;

export const getPatientForm2SentimentOptions = (lang: 'fr' | 'en') => 
  lang === 'fr'
    ? ['Stressee', 'Perdue', 'En manque d\'informations', 'J\'ai des questions', 'Je veux etre rassuree'] as const
    : ['Stressed', 'Lost', 'Lack of information', 'I have questions', 'I want to be reassured'] as const;

export const getPatientForm2AideMaintenantOptions = (lang: 'fr' | 'en') => 
  lang === 'fr'
    ? ['Comprendre mon evolution', 'Etre accompagnee', 'Trouver un professionnel', 'Preparer mon intervention'] as const
    : ['Understand my progress', 'Be accompanied', 'Find a professional', 'Prepare my surgery'] as const;

export const getPatientForm2AccompagnementOptions = (lang: 'fr' | 'en') => 
  lang === 'fr'
    ? ['Pres de chez moi', 'A l\'etranger', 'Les deux'] as const
    : ['Near me', 'Abroad', 'Both'] as const;

export const patientCopy = {
  fr: {
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
  },
  en: {
    meta: {
      title: 'METCARE® — Patient Accompaniment',
    },
    hero: {
      headline: "You are not alone after your intervention.",
      body:
        "Every day, women make an important decision. To change. To transform. To find themselves. But once the intervention is over... that's often where it all begins. The body changes. Sensations evolve. Emotions too. And many patients find themselves alone facing this stage. At METCARE®, we have made this phase a priority.",
      ctaEchange: 'I benefit from my offered exchange',
      ctaGuide: 'I receive my patient guide',
    },
    sections: {
      repere: {
        label: 'A FIRST LANDMARK FOR YOU',
        title: '',
        body:
          "Following your request, you will receive an offered patient guide. A simple guide to help you: understand what happens after your intervention / know what to observe / find your way in the different stages. Because understanding... is already reassuring.",
      },
      normal: {
        label: 'WHAT YOU ARE EXPERIENCING IS NORMAL',
        title: '',
        body:
          "Whether you have undergone: a liposuction / a BBL / a face lift / a breast augmentation / or any other intervention. You may feel: doubts / discomfort / lack of landmarks / unanswered questions. And it's normal. But this should not be experienced alone.",
      },
      safety: {
        label: 'SAFETY FIRST — SAFETY PATIENT®',
        title: '',
        body:
          "At METCARE®, patient safety is at the heart of everything. We are at the origin of the Safety Patient® label, designed to accompany patients before and after their intervention. You are not alone. You are surrounded.",
      },
      expertise: {
        label: 'RECOGNIZED EXPERTISE',
        title: '',
        body:
          'For over 17 years, METCARE® has accompanied: more than 8000 patients each year / more than 2500 partner surgeons / more than 1300 specialized experts. A structured approach, dedicated to aesthetic surgery and perioperative accompaniment in aesthetic surgery.',
      },
      conciergerie: {
        label: 'AN INTERNATIONAL AESTHETIC CONCIERGE',
        title: '',
        body:
          "Wherever you are. Wherever you had your intervention. We allow you to access a network of qualified professionals, adapted to your situation and your path. In a structured, secure, and personalized framework.",
        cta: 'I find an expert adapted to my situation',
      },
      echange: {
        label: 'A SIMPLE AND OFFERED FIRST EXCHANGE',
        title: '',
        body:
          "You can benefit from a connection appointment, entirely offered. An exchange of about 15 minutes to review your situation and precisely understand your needs. This appointment allows you: to be listened to / to be oriented / to no longer stay alone. The patient is our priority. That is why this exchange is offered without commitment.",
        cta: 'I benefit from my offered exchange',
      },
      parcours: {
        label: 'YOUR JOURNEY',
        title: '',
        intro: "You don't need to manage everything alone.",
        steps: [
          'You share your situation with us (intervention, need, location)',
          'We contact you for a personalized exchange',
          'We orient you towards the adapted solutions.',
        ],
        outro: 'Simple, clear, structured.',
      },
      solutions: {
        label: 'YOUR SOLUTIONS',
        title: '',
        body:
          'Depending on your situation, you can benefit from: Personalized accompaniment / Complete 148-page e-book / Signature Recovery Protocol. Each solution is designed for you.',
      },
      opportunite: {
        label: 'A COMPLEMENTARY OPPORTUNITY',
        title: '',
        body:
          'Depending on your profile, you can also access: a waiting list to benefit from supervised care in certain cities (Paris and regions). This care is performed in a specific framework, with professionals trained in our approach. Places are limited.',
      },
      bonEndroit: {
        label: 'YOU ARE IN THE RIGHT PLACE',
        title: '',
        body:
          "If you are here... it is probably not by chance. Perhaps you feel: the need to be reassured / the need to understand / the need to be accompanied. And that is exactly our role.",
      },
      final: {
        body:
          'Let\'s talk about your situation. Take a few moments to explain your path to us. This allows us to orient you with precision and offer you an adapted accompaniment.',
        cta: 'I benefit from my offered exchange',
      },
    },
    form1: {
      title: 'Let\'s talk about your situation',
      intro:
        'In a few seconds, explain your situation to us. This allows us to orient you quickly and offer you an adapted accompaniment.',
      submit: 'I benefit from my offered exchange',
      fields: {
        nom: 'Name',
        prenom: 'First Name',
        email: 'Email',
        telephone: 'Phone',
        pays: 'Country',
        ville: 'City',
        codePostal: 'Zip code',
        intervention: 'Have you already had your intervention?',
        typeIntervention: 'What type of intervention concerns you?',
        aide: "What would help you the most today?",
      },
    },
    transition: {
      title: 'Your request has been successfully taken into account',
      body:
        'Thank you for your trust. You will receive: your patient guide / the first information / and our team will be able to get back to you quickly. Before that...',
      prompt:
        'Take 1 minute to tell us a bit more. This allows us to: better understand your situation / adapt our recommendations / orient you with precision.',
      notice: 'This form is optional. But it allows us to accompany you with precision.',
      cta: 'I complete my profile',
      skip: 'Skip this step',
      backHome: 'Back',
    },
    form2: {
      title: 'To go further',
      intro: 'This information allows us to accompany you with precision.',
      submit: 'I validate my profile',
      thankYou:
        'Thank you. This information allows us to better accompany you. Our team will be able to get back to you to review with you.',
      fields: {
        quand: 'When did your intervention take place?',
        siPasEncore: 'If it is not yet performed:',
        technologie: 'Do you know the technology used or planned?',
        technologieDetail: 'Specify the technology',
        sentiment: 'How do you feel today?',
        aideMaintenant: "What would help you the most now?",
        accompagnement: 'Would you like to be accompanied:',
      },
    },
    ui: {
      noSession: 'No current request. Use the form on the home page.',
    },
  }
} as const;
