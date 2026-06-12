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
  ville1: string;
  ville2: string;
  ville3: string;
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
      headline: "Vous n'êtes pas seule après votre intervention.",
      body:
        "Chaque jour, des femmes prennent une décision importante. Changer. Se transformer. Se retrouver. Mais une fois l'intervention passée… c'est souvent là que tout commence. Le corps change. Les sensations évoluent. Les émotions aussi. Et beaucoup de patientes se retrouvent seules face à cette étape. Chez METCARE®, nous avons fait de cette phase une priorité.",
      ctaEchange: 'Je bénéficie de mon échange offert',
      ctaGuide: 'Je reçois mon guide patient',
    },
    sections: {
      repere: {
        label: 'UN PREMIER REPÈRE POUR VOUS',
        title: '',
        body:
          "Suite à votre demande, vous recevrez un guide patient offert. Un guide simple pour vous aider à : comprendre ce qui se passe après votre intervention / savoir quoi observer / vous repérer dans les différentes étapes. Parce que comprendre… c'est déjà se rassurer.",
      },
      normal: {
        label: 'CE QUE VOUS VIVEZ EST NORMAL',
        title: '',
        intro: 'Que vous ayez réalisé',
        tags1: ['une liposuccion', 'un BBL', 'un lifting cervico-facial', 'une augmentation mammaire'],
        bridge: 'ou toute autre intervention, vous pouvez ressentir :',
        tags2: ["des doutes", "de l'inconfort", 'un manque de repères', 'des questions sans réponses'],
        outro: "Et c'est normal, mais cela ne devrait pas être vécu seul(e).",
      },
      safety: {
        label: 'LA SÉCURITÉ AVANT TOUT — SAFETY PATIENT®',
        title: '',
        body:
          "Chez METCARE®, la sécurité du patient est au cœur de tout. Nous sommes à l'origine du label Safety Patient®, pensé pour accompagner les patients avant et après leur intervention. Vous n'êtes pas seule. Vous êtes entourée.",
      },
      expertise: {
        label: 'UNE EXPERTISE RECONNUE',
        title: '',
        body:
          "Depuis plus de 17 ans, METCARE® accompagne : plus de 8000 patients chaque année / plus de 2500 chirurgiens partenaires / plus de 1300 experts spécialisés. Une approche structurée, dédiée à la chirurgie esthétique et à l'accompagnement périopératoire en chirurgie esthétique.",
      },
      conciergerie: {
        label: 'UNE CONCIERGERIE ESTHÉTIQUE INTERNATIONALE',
        title: '',
        body:
          "Où que vous soyez. Où que vous ayez réalisé votre intervention. Nous vous permettons d'accéder à un réseau de professionnels qualifiés, adaptés à votre situation et à votre parcours. Dans un cadre structuré, sécurisé et personnalisé.",
        cta: 'Je trouve un expert adapté à ma situation',
      },
      echange: {
        label: 'UN PREMIER ÉCHANGE SIMPLE ET OFFERT',
        title: '',
        intro:
          "Vous pouvez bénéficier d'un rendez-vous de mise en relation, entièrement offert.",
        bullets: [
          "Un échange d'environ 15 minutes",
          'Pour faire le point sur votre situation',
          'Et comprendre précisément vos besoins',
        ],
        followup:
          "Ce rendez-vous vous permet : d'être écoutée / d'être orientée / de ne plus rester seule. Le patient est notre priorité. C'est pour cela que cet échange est proposé sans engagement.",
        cta: 'Je bénéficie de mon échange offert',
      },
      parcours: {
        label: 'VOTRE PARCOURS',
        title: '',
        intro: "Vous n'avez pas besoin de tout gérer seule.",
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
        label: 'OPPORTUNITÉ',
        title: "Accès à notre Réseau International d'Experts",
        body: [
          "Vous recherchez un accompagnement avant ou après votre intervention ?",
          "METCARE® vous permet d'accéder à son réseau international d'experts spécialisés dans le parcours péri-opératoire : infirmiers, kinésithérapeutes, ostéopathes, praticiens spécialisés, professionnels du bien-être et de la récupération. Notre équipe vous aide à identifier les professionnels les plus adaptés à votre situation, dans votre ville de récupération ou lors de vos déplacements en France et à l'international. Parce qu'un parcours bien encadré ne s'arrête pas à l'intervention.",
        ],
      },
      bonEndroit: {
        label: 'VOUS ÊTES AU BON ENDROIT',
        title: '',
        intro:
          "Si vous êtes ici… ce n'est probablement pas un hasard.",
        bullets: [
          "Le besoin d'être rassurée",
          'Le besoin de comprendre',
          "Le besoin d'être accompagnée",
        ],
        followup: "Et c'est exactement notre rôle.",
      },
      final: {
        label: 'ACCOMPAGNEMENT PERSONNALISÉ',
        intro: "Vous souhaitez bénéficier d'un accompagnement plus approfondi pour votre projet esthétique ?",
        body: [
          "Au-delà de notre échange d'orientation gratuit, METCARE® vous propose un rendez-vous d'accompagnement personnalisé d'1h00 entièrement dédié à votre situation.",
          "Cet entretien vous permet de faire le point sur votre projet, de poser toutes vos questions et de bénéficier d'un regard expert sur les différentes étapes de votre parcours : préparation, intervention, récupération, organisation pratique, suivi post-opératoire et accompagnement global.",
          "Notre mission est de vous aider à construire un parcours plus serein, plus structuré et plus sécurisé grâce à plus de 17 années d'expérience auprès de milliers de patients à travers le monde.",
          "Grâce à cet échange approfondi, vous bénéficiez d'une vision plus claire de votre parcours et des actions à mettre en place avant, pendant et après votre intervention.",
          "Parce qu'un projet esthétique ne se résume pas à une intervention, mais à l'ensemble du parcours qui l'entoure.",
        ],
        cta: "Consultation d'accompagnement 1h00",
      },
    },
    form1: {
      title: 'Parlons de votre situation',
      intro:
        'En quelques secondes, expliquez-nous votre situation. Cela nous permet de vous orienter rapidement et de vous proposer un accompagnement adapté.',
      submit: 'Je rentre en contact avec METCARE',
      fields: {
        nom: 'Nom de famille',
        prenom: 'Prénom',
        email: 'Email',
        telephone: 'Téléphone',
        ville: 'Ville',
        dateIntervention: "Date d'intervention",
        pays: 'Pays',
        intervention: 'Avez-vous déjà réalisé votre intervention ?',
        typeIntervention: "Quel type d'intervention vous concerne ?",
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
      thankYou: "Profitez d'un rendez-vous offert de 15 minutes pour nous présenter vos besoins et être orienté(e) vers un expert METCARE® de notre réseau, proche de chez vous.",
      bookCta: 'Trouver mon accompagnement',
      fields: {
        villesQuestion: "Indiquez la ou les villes dans lesquelles vous pourriez avoir besoin d'un accompagnement pendant votre parcours",
        villesHelper: "Si vous ne le savez pas encore, indiquez simplement votre ville de résidence.",
        ville1Label: "Ville 1",
        ville2Label: "Ville 2 (optionnel)",
        ville3Label: "Ville 3 (optionnel)",
        technologie: "Connaissez-vous la technologie utilisée ou prévue ?",
        technologieDetail: "Précisez la technologie",
        sentiment: "Aujourd'hui, comment vous sentez-vous ?",
        aideMaintenant: "Qu'est-ce qui vous aiderait le plus maintenant ?",
        accompagnement: "Souhaitez-vous être accompagnée :",
      },
    },
    ui: {
      noSession: "Aucune demande en cours. Utilisez le formulaire sur la page d'accueil.",
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
        intro: 'Whether you have undergone',
        tags1: ['a liposuction', 'a BBL', 'a face lift', 'a breast augmentation'],
        bridge: 'or any other intervention, you may feel:',
        tags2: ['doubts', 'discomfort', 'lack of landmarks', 'unanswered questions'],
        outro: "And it's normal, but this should not be experienced alone.",
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
        label: 'OPPORTUNITY',
        title: 'Access to our International Expert Network',
        body: [
          "Looking for support before or after your procedure?",
          "METCARE® gives you access to its international network of experts specialized in the peri-operative journey: nurses, physiotherapists, osteopaths, specialized practitioners, wellness and recovery professionals. Our team helps you identify the professionals best suited to your situation, in your recovery city or during your travels in France and internationally. Because a well-supported journey doesn't end with the procedure.",
        ],
      },
      bonEndroit: {
        label: 'YOU ARE IN THE RIGHT PLACE',
        title: '',
        intro:
          "If you are here… it's probably not a coincidence.",
        bullets: [
          'The need to be reassured',
          'The need to understand',
          'The need to be accompanied',
        ],
        followup: 'And that is exactly our role.',
      },
      final: {
        label: 'PERSONALIZED ACCOMPANIMENT',
        intro: "Are you looking for more in-depth support for your aesthetic project?",
        body: [
          "Beyond our free orientation exchange, METCARE® offers you a 1h00 personalized accompaniment appointment entirely dedicated to your situation.",
          "This interview allows you to review your project, ask all your questions and benefit from expert insight on the different stages of your journey: preparation, procedure, recovery, practical organization, post-operative follow-up and overall support.",
          "Our mission is to help you build a calmer, more structured and more secure journey thanks to more than 17 years of experience with thousands of patients around the world.",
          "Through this in-depth exchange, you gain a clearer vision of your journey and the actions to put in place before, during and after your procedure.",
          "Because an aesthetic project is not just about a procedure, but about the entire journey surrounding it.",
        ],
        cta: "Accompaniment Consultation 1h00",
      },
    },
    form1: {
      title: 'Let\'s talk about your situation',
      intro:
        'In a few seconds, explain your situation to us. This allows us to orient you quickly and offer you an adapted accompaniment.',
      submit: 'I get in touch with METCARE',
      fields: {
        nom: 'Last Name',
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
      thankYou: 'Enjoy a complimentary 15-minute appointment to present your needs and be guided towards a METCARE® expert in our network, near you.',
      bookCta: 'Find my accompaniment',
      fields: {
        villesQuestion: "Indicate the city or cities where you may need accompaniment during your journey",
        villesHelper: "If you don't know yet, simply indicate your city of residence.",
        ville1Label: 'City 1',
        ville2Label: 'City 2 (optional)',
        ville3Label: 'City 3 (optional)',
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
