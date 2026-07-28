import { text, type Localized } from "../text";

export const freelance = {
    "title": text("Portfolio de Thomas Gysemans - Freelance", "Portfolio of Thomas Gysemans - Freelance"),
    "description": text(
        "Développeur freelance : design, code et hébergement, de A à Z. Devis gratuit et première réponse sous 48 h.",
        "Freelance developer: design, code and hosting, A to Z. Free quote and first reply within 48 hours.",
    ),
    "herotitle": text(
        "Un projet <span class='text-accent'>beau et fiable</span>. Livré rapidement.",
        "A <span class='text-accent'>pretty, reliable</span> project. Delivered fast.",
    ),
    "herointro": text(
        "Design, code, hébergement : je m'occupe de tout, de A à Z. Vous validez mes maquettes, cliquez dans un prototype, et je livre votre produit fini en ligne, dans les délais.",
        "Design, code, hosting: I handle it all, from A to Z. You validate my mockups, click through a prototype, and I deliver your finished product live, on deadline.",
    ),
    "emailme": text("M'écrire", "Email me"),
    "hireonmalt": text("Me recruter sur Malt", "Hire me on Malt"),
    "freequote": text("Votre devis est gratuit, sans engagement.", "Your quote is free, no commitment."),
    "step1title": text("1 · Design"),
    "step1": text("Des maquettes que vous validez, écran par écran.", "Mockups you validate, screen by screen."),
    "step2title": text("2 · Prototype"),
    "step2": text("Cliquez dedans avant même qu'il soit développé.", "Click through it before it's even built."),
    "step3title": text("3 · Projet fini", "3 · Finished project"),
    "step3": text("En ligne, dans les délais, code & clés inclus.", "Live, on deadline, code & keys included."),
    "stat1num": text("A→Z"),
    "stat1": text("du design au déploiement", "design to deployment"),
    "stat2": text("projets livrés pour des clients", "projects delivered for clients"),
    "stat3num": text("48h"),
    "stat3": text("pour une première réponse et un devis gratuit", "to get a first reply and a free quote"),
    "stat4": text("projets au total, depuis {year}", "projects in total, since {year}"),
    "guaranteetitle": text("Garantie un an", "One-year guarantee"),
    "guarantee": text(
        "Un bug dans l'année suivant la livraison ? Corrigé gratuitement, sans poser de questions.",
        "A bug within a year of delivery? Fixed free, no questions asked.",
    ),
    "aititle": text("Rapide, et sans dette technique", "Fast, and without technical debt"),
    "ai1a": text("Développement outillé", "Tooled-up development"),
    "ai1b": text("→ délais courts", "→ short deadlines"),
    "ai2a": text("Cas limites", "Edge cases"),
    "ai2b": text("→ détectés tôt", "→ caught early"),
    "ai3a": text("Chaque ligne", "Every line"),
    "ai3b": text("→ relue par moi", "→ reviewed by me"),
    "ai4a": text("Tests automatisés", "Automated tests"),
    "ai4b": text("→ à chaque livraison", "→ on every delivery"),
    "carestitle": text("Accessible et responsable", "Accessible and responsible"),
    "care1a": text("Accessibilité", "Accessibility"),
    "care1b": text("→ conforme au RGAA", "→ open to everyone"),
    "care2a": text("Données personnelles", "User data"),
    "care2b": text("→ RGPD respecté", "→ handled per the law"),
    // Budget anchor. The starting figure itself lives in FreelancePage.astro
    // (STARTING_PRICE) so it stays a single number rather than a string to
    // translate twice; the whole block is hidden until it is set.
    "pricingtitle": text("Combien ça coûte ?", "What does it cost?"),
    "price1label": text("Site vitrine", "Showcase website"),
    "price1from": text("à partir de {price}", "from {price}"),
    "price1desc": text(
        "Design, développement, mise en ligne et hébergement.",
        "Design, development, deployment and hosting.",
    ),
    "price2label": text("Application sur mesure", "Custom application"),
    "price2value": text("Sur devis", "On quote"),
    "price2desc": text(
        "Web, mobile ou desktop. Le prix dépend du périmètre, qu'on cadre ensemble avant de commencer.",
        "Web, mobile or desktop. The price depends on the scope, which we define together before starting.",
    ),
    "pricingnote": text(
        "Prix indicatifs. Le devis final est fixe et gratuit : pas de surprise en cours de route.",
        "Indicative prices. The final quote is fixed and free: no surprises along the way.",
    ),
    "deliveredforclients": text("Livré pour des clients", "Delivered for clients"),
    "reviewstitle": text("Ils ont travaillé avec moi", "They worked with me"),
    "ctatitle": text("Un projet en tête ?", "Have a project in mind?"),
    "ctasubtitle": text(
        "Devis gratuit et première réponse sous 48 h. Vous repartez avec le code et les clés.",
        "Free quote and first reply within 48 hours. You leave with the code and the keys.",
    ),
    "onmalt": text("Sur Malt", "On Malt"),
} satisfies Record<string, Localized>;
