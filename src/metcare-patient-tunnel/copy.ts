export type PatientForm1Data = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  ville: string;
  dateIntervention: string;
  pays: string;
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
    ? ['Être rassurée', 'Comprendre ma récupération', 'Être accompagnée', 'Trouver un expert'] as const
    : ['Be reassured', 'Understand my recovery', 'Be accompanied', 'Find an expert'] as const;

export const getPatientForm2QuandOptions = (lang: 'fr' | 'en') => 
  lang === 'fr'
    ? ['Moins de 7 jours', '1 à 3 semaines', '1 à 3 mois', 'Plus de 3 mois'] as const
    : ['Less than 7 days', '1 to 3 weeks', '1 to 3 months', 'More than 3 months'] as const;

export const getPatientForm2SiPasEncoreOptions = (lang: 'fr' | 'en') => 
  lang === 'fr'
    ? ["Moins d'1 mois", '1 à 3 mois', 'Plus tard', 'En réflexion'] as const
    : ['Less than 1 month', '1 to 3 months', 'Later', 'In reflection'] as const;

export const getPatientForm2TechnologieOptions = (lang: 'fr' | 'en') => 
  lang === 'fr' ? ['Oui', 'Non', 'Je ne sais pas'] as const : ['Yes', 'No', 'I don\'t know'] as const;

export const getPatientForm2SentimentOptions = (lang: 'fr' | 'en') => 
  lang === 'fr'
    ? ['Stressée', 'Perdue', 'En manque d\'informations', 'J\'ai des questions', 'Je veux être rassurée'] as const
    : ['Stressed', 'Lost', 'Lack of information', 'I have questions', 'I want to be reassured'] as const;

export const getPatientForm2AideMaintenantOptions = (lang: 'fr' | 'en') => 
  lang === 'fr'
    ? ['Comprendre mon évolution', 'Être accompagnée', 'Trouver un professionnel', 'Préparer mon intervention'] as const
    : ['Understand my progress', 'Be accompanied', 'Find a professional', 'Prepare my surgery'] as const;

export const getPatientForm2AccompagnementOptions = (lang: 'fr' | 'en') => 
  lang === 'fr'
    ? ['Près de chez moi', 'À l\'étranger', 'Les deux'] as const
    : ['Near me', 'Abroad', 'Both'] as const;

export const patientCopy = {
  fr: {
    meta: {
      title: 'METCARE® — Accompagnement patient',
    },
    hero: {
      headline: "Vous n’êtes pas seule après votre intervention.",
      body:
        "Chaque jour, des femmes prennent une décision importante. Changer. Se transformer. Se retrouver. Mais une fois l’intervention passée… c’est souvent là que tout commence. Le corps change. Les sensations évoluent. Les émotions aussi. Et beaucoup de patientes se retrouvent seules face à cette étape. Chez METCARE®, nous avons fait de cette phase une priorité.",
      ctaEchange: 'Je bénéficie de mon échange offert',
      ctaGuide: 'Je reçois mon guide patient',
    },
    sections: {
      repere: {
        label: 'UN PREMIER REPÈRE POUR VOUS',
        title: '',
        body:
          "Suite à votre demande, vous recevrez un guide patient offert. Un guide simple pour vous aider à : comprendre ce qui se passe après votre intervention / savoir quoi observer / vous repérer dans les différentes étapes. Parce que comprendre… c’est déjà se rassurer.",
      },
      normal: {
        label: 'CE QUE VOUS VIVEZ EST NORMAL',
        title: '',
        body:
          "Que vous ayez réalisé : une liposuccion / un BBL / un lifting cervico-facial / une augmentation mammaire / ou toute autre intervention. Vous pouvez ressentir : des doutes / de l’inconfort / un manque de repères / des questions sans réponse. Et c’est normal. Mais cela ne devrait pas être vécu seule.",
      },
      safety: {
        label: 'LA SÉCURITÉ AVANT TOUT — SAFETY PATIENT®',
        title: '',
        body:
          "Chez METCARE®, la sécurité du patient est au cœur de tout. Nous sommes à l’origine du label Safety Patient®, pensé pour accompagner les patients avant et après leur intervention. Vous n’êtes pas seule. Vous êtes entourée.",
      },
      expertise: {
        label: 'UNE EXPERTISE RECONNUE',
        title: '',
        body:
          'Depuis plus de 17 ans, METCARE® accompagne : plus de 8000 patients chaque année / plus de 2500 chirurgiens partenaires / plus de 1300 experts spécialisés. Une approche structurée, dédiée à la chirurgie esthétique et à l’accompagnement périopératoire en chirurgie esthétique.',
      },
      conciergerie: {
        label: 'UNE CONCIERGERIE ESTHÉTIQUE INTERNATIONALE',
        title: '',
        body:
          "Où que vous soyez. Où que vous ayez réalisé votre intervention. Nous vous permettons d’accéder à un réseau de professionnels qualifiés, adaptés à votre situation et à votre parcours. Dans un cadre structuré, sécurisé et personnalisé.",
        cta: 'Je trouve un expert adapté à ma situation',
      },
      echange: {
        label: 'UN PREMIER ÉCHANGE SIMPLE ET OFFERT',
        title: '',
        intro:
          "Vous pouvez bénéficier d’un rendez-vous de mise en relation, entièrement offert.",
        bullets: [
          'Un échange d’environ 15 minutes',
          'Pour faire le point sur votre situation',
          'Et comprendre précisément vos besoins',
        ],
        followup:
          "Ce rendez-vous vous permet : d’être écoutée / d’être orientée / de ne plus rester seule. Le patient est notre priorité. C’est pour cela que cet échange est proposé sans engagement.",
        cta: 'Je bénéficie de mon échange offert',
      },
      parcours: {
        label: 'VOTRE PARCOURS',
        title: '',
        intro: "Vous n’avez pas besoin de tout gérer seule.",
        steps: [
          'Vous nous partagez votre situation (intervention, besoin, localisation)',
          'Nous vous contactons pour un échange personnalisé',
          'Nous vous orientons vers les solutions adaptées.',
        ],
        outro: 'Simple, clair, structuré.',
      },
      solutions: {
        label: 'VOS SOLUTIONS',
        title: '',
        body:
          'Selon votre situation, vous pouvez bénéficier de : Accompagnement personnalisé / E-book complet 148 pages / Signature Recovery Protocol. Chaque solution est pensée pour vous.',
      },
      opportunite: {
        label: 'UNE OPPORTUNITÉ COMPLÉMENTAIRE',
        title: '',
        body:
          'Selon votre profil, vous pouvez également accéder à : une liste d’attente pour bénéficier de soins encadrés dans certaines villes (Paris et régions). Ces soins sont réalisés dans un cadre spécifique, avec des professionnels formés à notre approche. Les places sont limitées.',
      },
      bonEndroit: {
        label: 'VOUS ÊTES AU BON ENDROIT',
        title: '',
        intro:
          "Si vous êtes ici… ce n’est probablement pas un hasard.",
        bullets: [
          'Le besoin d’être rassurée',
          'Le besoin de comprendre',
          'Le besoin d’être accompagnée',
        ],
        followup: 'Et c’est exactement notre rôle.',
      },
      final: {
        body:
          'Parlons de votre situation. Prenez quelques instants pour nous expliquer votre parcours. Cela nous permet de vous orienter avec précision et de vous proposer un accompagnement adapté.',
        cta: 'Je bénéficie de mon échange offert',
      },
    },
    form1: {
      title: 'Parlons de votre situation',
      intro:
        'En quelques secondes, expliquez-nous votre situation. Cela nous permet de vous orienter rapidement et de vous proposer un accompagnement adapté.',
      submit: 'Je bénéficie de mon échange offert',
      fields: {
        nom: 'Nom',
        prenom: 'Prénom',
        email: 'Email',
        telephone: 'Téléphone',
        ville: 'Ville',
        dateIntervention: "Date d'intervention",
        pays: 'Pays',
        intervention: 'Avez-vous déjà réalisé votre intervention ?',
        typeIntervention: 'Quel type d’intervention vous concerne ?',
        aide: "Qu'est-ce qui vous aiderait le plus aujourd'hui ?",
      },
    },
    transition: {
      title: 'Votre demande a bien été prise en compte',
      bodyIntro: 'Merci pour votre confiance. Vous allez recevoir :',
      bodyItems: ['Votre guide patient', 'Les premières informations', 'Un retour rapide de notre équipe'],
      bodyOutro: 'Avant cela...',
      promptIntro: 'Prenez 1 minute pour nous en dire un peu plus. Cela nous permet de :',
      promptItems: ['Mieux comprendre votre situation', 'Adapter nos recommandations', 'Vous orienter avec précision'],
      notice: 'Ce formulaire est facultatif. Mais il nous permet de vous accompagner avec précision.',
      cta: 'Je complète mon profil',
      skip: 'Passer cette étape',
      backHome: 'Retour',
    },
    form2: {
      title: 'Pour aller plus loin',
      intro: 'Ces informations nous permettent de vous accompagner avec précision.',
      submit: 'Je valide mon profil',
      thankYou: 'Merci. Ces informations nous permettent de mieux vous accompagner.',
      bookCta: 'Prendre rendez-vous',
      fields: {
        quand: 'Quand a eu lieu votre intervention ?',
        siPasEncore: "Si elle n’est pas encore réalisée, votre chirurgie aura lieu dans :",
        technologie: 'Connaissez-vous la technologie utilisée ou prévue ?',
        technologieDetail: 'Précisez la technologie',
        sentiment: 'Aujourd\'hui, comment vous sentez-vous ?',
        aideMaintenant: "Qu'est-ce qui vous aiderait le plus maintenant ?",
        accompagnement: 'Souhaitez-vous être accompagnée :',
      },
    },
    ui: {
      noSession: 'Aucune demande en cours. Utilisez le formulaire sur la page d’accueil.',
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
        label: 'A FIRST EXCHANGE — SIMPLE AND FREE',
        title: '',
        intro:
          'You can benefit from a connecting appointment, entirely free.',
        bullets: [
          'An exchange of around 15 minutes',
          'To take stock of your situation',
          'And understand your needs precisely',
        ],
        followup:
          'This appointment allows you to: be heard / be guided / no longer be alone. The patient is our priority. That is why this exchange is offered with no commitment.',
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
        intro:
          'If you are here… it’s probably not a coincidence.',
        bullets: [
          'The need to be reassured',
          'The need to understand',
          'The need to be accompanied',
        ],
        followup: 'And that is exactly our role.',
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
        ville: 'City',
        dateIntervention: 'Date of Intervention',
        pays: 'Country',
        intervention: 'Have you already had your intervention?',
        typeIntervention: 'What type of intervention concerns you?',
        aide: "What would help you the most today?",
      },
    },
    transition: {
      title: 'Your request has been successfully taken into account',
      bodyIntro: 'Thank you for your trust. You will receive:',
      bodyItems: ['Your patient guide', 'The first information', 'A quick follow-up from our team'],
      bodyOutro: 'Before that...',
      promptIntro: 'Take 1 minute to tell us a bit more. This allows us to:',
      promptItems: ['Better understand your situation', 'Adapt our recommendations', 'Orient you with precision'],
      notice: 'This form is optional. But it allows us to accompany you with precision.',
      cta: 'I complete my profile',
      skip: 'Skip this step',
      backHome: 'Back',
    },
    form2: {
      title: 'To go further',
      intro: 'This information allows us to accompany you with precision.',
      submit: 'I validate my profile',
      thankYou: 'Thank you. This information allows us to better accompany you.',
      bookCta: 'Book an Appointment',
      fields: {
        quand: 'When did your intervention take place?',
        siPasEncore: 'If it has not yet been performed, your surgery will take place in:',
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
