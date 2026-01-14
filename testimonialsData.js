/**
 * TESTIMONIALS DATA
 * Deux types de témoignages :
 * 1. featuredTestimonials : Citations longues pour la section du haut
 * 2. chatTestimonials : Messages courts style chat pour la section du bas
 */

const featuredTestimonials = [
    {
        id: 1,
        author: "Sarah M.",
        role: { en: "Freelance Designer", fr: "Designer Freelance" },
        text: {
            en: "This template completely changed how I manage my clients. It's not just a template, it's a whole new workflow.",
            fr: "Ce template a complètement changé ma façon de gérer mes clients. Ce n'est pas juste un template, c'est toute une méthode de travail.",
        },
        avatarColor: "#FFD700", // Gold
        emoji: "👩‍🎨"
    },
    {
        id: 2,
        author: "Thomas L.",
        role: { en: "Startup Founder", fr: "Fondateur Startup" },
        text: {
            en: "Finally a CRM that is simple to use but powerful enough for our growing team. Best investment of the year.",
            fr: "Enfin un CRM simple à utiliser mais assez puissant pour notre équipe en croissance. Meilleur investissement de l'année.",
        },
        avatarColor: "#4CAF50", // Green
        emoji: "🚀"
    },
    {
        id: 3,
        author: "Elena R.",
        role: { en: "Content Creator", fr: "Créatrice de Contenu" },
        text: {
            en: "My content production has doubled since I started using this calendar. Everything is so clear now.",
            fr: "Ma production de contenu a doublé depuis que j'utilise ce calendrier. Tout est si clair maintenant.",
        },
        avatarColor: "#9C27B0", // Purple
        emoji: "✍️"
    }
];

const chatTestimonials = [
    {
        id: 101,
        author: "Alex",
        text: { en: "Just bought the Freelance OS, amazing! ⚡️", fr: "Je viens de prendre le Freelance OS, incroyable ! ⚡️" },
        templateId: 1, // Freelance OS
        avatarColor: "#2196F3", // Blue
        emoji: "👨‍💻"
    },
    {
        id: 102,
        author: "Julie",
        text: { en: "How did I live without this CRM before? 😅", fr: "Comment je faisais sans ce CRM avant ? 😅" },
        templateId: 2, // CRM
        avatarColor: "#E91E63", // Pink
        emoji: "👩‍💼"
    },
    {
        id: 103,
        author: "Marc",
        text: { en: "The budget tracker is a life saver! 🙏", fr: "Le suivi de budget me sauve la vie ! 🙏" },
        templateId: 4, // Budget
        avatarColor: "#FF9800", // Orange
        emoji: "👨‍🎓"
    },
    {
        id: 104,
        author: "Sophie",
        text: { en: "Super clean design, love it ✨", fr: "Design super propre, j'adore ✨" },
        templateId: 1, // Freelance OS
        avatarColor: "#00BCD4", // Cyan
        emoji: "👩‍🎨"
    },
    {
        id: 105,
        author: "David",
        text: { en: "Worth every penny!", fr: "Ça vaut chaque centime !" },
        templateId: 2, // CRM
        avatarColor: "#607D8B", // Blue Grey
        emoji: "👨‍🏫"
    },
    {
        id: 106,
        author: "Emma",
        text: { en: "Finally organized for 2026 📅", fr: "Enfin organisée pour 2026 📅" },
        templateId: 3, // Content Calendar
        avatarColor: "#795548", // Brown
        emoji: "👩‍💻"
    }
];

// Export to window
window.featuredTestimonials = featuredTestimonials;
window.chatTestimonials = chatTestimonials;
