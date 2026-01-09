/**
 * NOTIONBYMAT - DATABASE
 * Catalogue templates + données additionnelles.
 */

// ==========================================
// TEMPLATES
// ==========================================

const templatesData = [
    // ------------------------------------------
    // FREELANCE OS TEMPLATE
    // ------------------------------------------

    {
    id: 1,
    category: "productivity",
    title: "Freelance OS Template",
    description: "Complete project management with Kanban, Timeline and task tracking.",

    // Cover affichée sur la carte
    coverImage: "images/templates/freelance/Freelance_Cover.png",

    // Galerie affichée dans la modal (slider)
    gallery: [
      "images/templates/freelance/1.png",
      "images/templates/freelance/2.png",
      "images/templates/freelance/3.png",
      "images/templates/freelance/4.png",
      "images/templates/freelance/5.png",
    ],
    emoji: "🚀",

    isBestSeller: true,

    price: 0,
    pricePro: 29,
    promoPrice: 19, // Si présent => prix barré + promo

    soldCount: 127,
    rating: 4.9,

    useCases: ["Freelances", "Agences", "Consultants"],

    // Vidéo affichée uniquement si non vide
    videoUrl: "",

    links: {
      fr: {
        free: "https://gumroad.com/l/freelance-fr-free",
        pro: "https://gumroad.com/l/freelance-fr-pro",
      },
      en: {
        free: "https://gumroad.com/l/freelance-en-free",
        pro: "https://gumroad.com/l/freelance-en-pro",
      },
    },

    // Features traduisibles (recommandé)
    features: {
      fr: [
        "Tableau de bord complet",
        "Suivi des tâches (Kanban)",
        "Gestion des clients basique",
        "Timeline visuelle",
      ],
      en: [
        "Complete dashboard",
        "Task tracking (Kanban)",
        "Basic client management",
        "Visual timeline",
      ],
    },

    proFeatures: {
      fr: [
        "Automatisation des factures",
        "Suivi du temps (Time Tracking)",
        "Support prioritaire 24/7",
        "Accès aux mises à jour futures",
        "Templates de contrats inclus",
      ],
      en: [
        "Invoice automation",
        "Time tracking",
        "24/7 priority support",
        "Access to future updates",
        "Contract templates included",
      ],
    },
  },

    // ------------------------------------------
    // CRM COMPLETE TEMPLATE
    // ------------------------------------------
  {
    id: 2,
    category: "business",
    title: "CRM Complete",
    description: "Manage clients, prospects and sales pipeline in one place.",

    coverImage: "",
    gallery: [],
    emoji: "💼",

    isBestSeller: true,

    price: 0,
    pricePro: 39,

    links: {
      fr: { free: "#", pro: "#" },
      en: { free: "#", pro: "#" },
    },

    features: {
      fr: ["Base de données clients", "Pipeline de ventes", "Suivi des deals"],
      en: ["Client database", "Sales pipeline", "Deal tracking"],
    },

    proFeatures: {
      fr: ["Automatisations avancées", "Rapports analytiques", "Intégration email"],
      en: ["Advanced automations", "Analytics reports", "Email integration"],
    },
  },

  {
    id: 3,
    category: "creative",
    title: "Content Calendar",
    description: "Plan and organize your content with visual calendar.",

    coverImage: "",
    gallery: [],
    emoji: "📅",

    isBestSeller: false,

    price: 0,
    pricePro: 19,

    links: {
      fr: { free: "#", pro: "#" },
      en: { free: "#", pro: "#" },
    },

    features: {
      fr: ["Calendrier éditorial", "Vue mensuelle", "Catégories de contenu"],
      en: ["Editorial calendar", "Monthly view", "Content categories"],
    },

    proFeatures: {
      fr: ["Templates de posts", "Système de validation", "Rappels"],
      en: ["Post templates", "Approval workflow", "Reminders"],
    },
  },

  {
    id: 4,
    category: "finance",
    title: "Budget Tracker",
    description: "Track expenses and manage your personal or business budget.",

    coverImage: "",
    gallery: [],
    emoji: "💰",

    isBestSeller: false,

    price: 0,
    pricePro: 19,

    links: {
      fr: { free: "#", pro: "#" },
      en: { free: "#", pro: "#" },
    },

    features: {
      fr: ["Suivi des dépenses", "Catégories personnalisables", "Vue mensuelle"],
      en: ["Expense tracking", "Custom categories", "Monthly view"],
    },

    proFeatures: {
      fr: ["Graphiques avancés", "Export", "Prévisions"],
      en: ["Advanced charts", "Export", "Forecasting"],
    },
  },
];
