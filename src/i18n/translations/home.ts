import { text, type Localized } from "../text";

export const home = {
    "title": text(
        "Thomas Gysemans · Sites et applis qui mettent votre projet en orbite",
        "Thomas Gysemans · Websites and apps that put your project into orbit",
    ),
    "description": text(
        "Développeur et designer freelance : site vitrine, application mobile ou logiciel, conçus de A à Z, rapides, accessibles (RGAA) et conformes au RGPD. Devis gratuit sous 48 h.",
        "Freelance developer and designer: showcase website, mobile app or software, built from A to Z, fast, accessible and GDPR-compliant. Free quote within 48 hours.",
    ),

    // Hero. The title is split around the highlighted words, which carry the orbit ring.
    "herotitle1": text("Des sites et des applis", "Websites and apps"),
    "herotitle2": text("qui mettent votre projet", "that put your project"),
    "herotitlehl": text("en orbite.", "into orbit."),
    "herosub": text(
        "Je suis Thomas Gysemans, développeur et designer freelance, passionné d'astronomie. Site vitrine, application mobile ou logiciel : je le conçois de A à Z, original, rapide, et conforme au RGPD comme au RGAA.",
        "I'm Thomas Gysemans, a freelance developer and designer with a passion for astronomy. Showcase website, mobile app or software: I build it from A to Z, original, fast, and compliant with privacy and accessibility rules.",
    ),
    "seepricing": text("Voir les tarifs", "See pricing"),
    "check1": text("Devis gratuit sous 48 h", "Free quote within 48 hours"),
    "check2": text("Garantie un an", "One-year guarantee"),
    "check3": text("Le code vous appartient", "You own the code"),
    "orion": text("Orion"),
    "ursamajor": text("Grande Ourse", "Big Dipper"),

    // Why me
    "whyeyebrow": text("Pourquoi moi", "Why me"),
    "whytitle": text("Beau à regarder. Rapide à charger. Ouvert à tous.", "Beautiful to look at. Fast to load. Open to everyone."),
    "whyintro": text(
        "Un site joli mais lent, rapide mais banal, ou conforme en option : c'est souvent le compromis. Chez moi, ces qualités font partie du cahier des charges dès la première maquette.",
        "Pretty but slow, fast but bland, or compliant as an extra: that is the usual trade-off. With me, these qualities are part of the brief from the very first mockup.",
    ),
    "why1title": text("Original, dessiné à partir d'une page blanche", "Original, drawn from a blank page"),
    "why1": text(
        "Aucun thème acheté, aucun constructeur de pages. Votre projet est dessiné autour de votre marque et de vos clients, et vous validez chaque écran avant la première ligne de code.",
        "No bought theme, no page builder. Your project is designed around your brand and your customers, and you approve every screen before the first line of code.",
    ),
    "why1art": text("accroche", "headline"),
    "why2title": text("Vous modifiez votre site, sans passer par moi", "You update your site yourself, without calling me"),
    "why2": text(
        "Je livre souvent une interface d'administration sur mesure : textes, photos ou nouvelles réalisations, vous les publiez en quelques clics, sans toucher au code.",
        "I often deliver a tailor-made admin interface: texts, photos or new work, you publish them in a few clicks, without touching the code.",
    ),
    "why2window": text("administration", "admin"),
    "why2field": text("titre", "title"),
    // Typed in the little admin screen: the field is as wide as this text
    "why2typed": text("Nouveau chantier", "Spring menu 2027"),
    "why2publish": text("Publier", "Publish"),
    "why2live": text("en ligne ✓", "live ✓"),
    "why3title": text("Rapide à charger", "Fast to load"),
    "why3": text(
        "Seul le code utile est envoyé, au moment où il sert. Les planètes 3D de ce site, par exemple, ne se chargent qu'une fois la page affichée, et chacune seulement à l'approche de l'écran.",
        "Only the code that is needed gets sent, when it is needed. The 3D planets on this site, for instance, load only once the page is displayed, and each one only as it nears the screen.",
    ),
    "why3outof": text("sur 100", "out of 100"),
    "why4title": text("Beau sur chaque écran", "Beautiful on every screen"),
    "why4": text(
        "Du téléphone au grand écran, chaque mise en page est dessinée pour sa taille, pas seulement rétrécie.",
        "From phone to large display, every layout is designed for its size, not just shrunk.",
    ),
    "why5title": text("Conforme au RGPD et au RGAA", "Privacy and accessibility compliant"),
    "why5": text(
        "Aucun traceur sans votre accord, une navigation complète au clavier, des contrastes vérifiés.",
        "No tracker without your consent, full keyboard navigation, checked contrasts.",
    ),
    "why5chip1": text("RGPD", "GDPR"),
    "why5chip2": text("RGAA 4.1", "WCAG 2.1"),
    "why5chip3": text("0 traceur", "0 trackers"),
    "why5chip4": text("clavier ✓", "keyboard ✓"),
    // Lighthouse scores of this site, framed below the bento
    "scorestitle": text("Mesuré, pas promis", "Measured, not promised"),
    "scorestext": text(
        "Google Lighthouse note chaque page sur quatre critères : vitesse, accessibilité, bonnes pratiques et référencement. Voici les notes de ce site.",
        "Google Lighthouse scores every page on four criteria: speed, accessibility, best practices and search visibility. Here are this site's scores.",
    ),
    "scoresreport": text("Voir le rapport PageSpeed Insights", "See the PageSpeed Insights report"),
    // The category names of the Lighthouse report itself, in each language
    "scoreperf": text("Performances", "Performance"),
    "scorea11y": text("Accessibilité", "Accessibility"),
    "scorebp": text("Bonnes pratiques", "Best Practices"),
    "scoreseo": text("SEO"),

    // Tagline: the {shine} word lights up like a star
    "tagline1": text("Il y a des milliards de sites. Le vôtre doit", "There are billions of websites. Yours has to"),
    "taglineshine": text("briller", "shine"),
    "tagline2": text("assez fort pour qu'on le remarque.", "bright enough to be noticed."),

    // Work. The title and the introduction describe the three projects shown
    // (the "carousel" project of the back-office, then the next two featured).
    "workeyebrow": text("Réalisations", "Work"),
    "worktitle": text("Du coffre chiffré au logiciel métier.", "From an encrypted vault to business software."),
    "workintro": text(
        "Une application de sécurité pour cinq systèmes, une plateforme de vulgarisation et l'outil interne d'une entreprise. Chacun conçu, dessiné et développé par moi, de A à Z.",
        "A security app for five platforms, a science outreach platform and a company's internal tool. Each one designed, drawn and built by me, from A to Z.",
    ),
    "seeallprojects": text("Voir les {count} projets", "See all {count} projects"),
    "livesite": text("Site en ligne", "Live site"),
    "reviewseyebrow": text("Avis clients", "Client reviews"),
    "rating": text("Note de {n} sur 5", "Rated {n} out of 5"),

    // About
    "abouteyebrow": text("Derrière l'écran", "Behind the screen"),
    "abouttitle": text("Développeur, designer, et la tête dans les étoiles.", "Developer, designer, and head in the stars."),
    "about1": text(
        "Je code depuis mes 13 ans, d'abord en autodidacte, puis à l'IUT A de Lille. Stages chez Kimple et Tabuléo, un an d'alternance sur Quizéo, puis mes premiers clients freelance, venus par recommandation.",
        "I have been coding since I was 13, self-taught at first, then at the IUT A in Lille. Internships at Kimple and Tabuléo, a year-long apprenticeship on Quizéo, then my first freelance clients, who came through word of mouth.",
    ),
    "about2": text(
        "L'astronomie est mon autre passion, et elle se glisse souvent dans mon code. Space Visitor et ScienceSky m'ont appris la 3D, la performance, et l'art d'expliquer simplement.",
        "Astronomy is my other passion, and it often finds its way into my code. Space Visitor and ScienceSky taught me 3D, performance, and the art of explaining things simply.",
    ),
    "statyears": text("ans de code", "years of code"),
    "statprojects": text("projets menés", "projects shipped"),
    "play": text("Jouer", "Play"),

    // Method
    "methodeyebrow": text("Méthode", "Process"),
    "methodtitle": text("Du premier échange au décollage.", "From first call to liftoff."),
    "methodintro": text(
        "Un seul interlocuteur du début à la fin. Vous voyez votre projet à chaque étape, avant qu'il coûte une ligne de code.",
        "One single contact from start to finish. You see your project at every stage, before it costs a line of code.",
    ),
    "step": text("Étape {n} : ", "Step {n}: "),
    "guaranteetitle": text("Garantie un an", "One-year guarantee"),
    "guarantee": text(
        "Un bug dans l'année qui suit la livraison ? Je le corrige gratuitement, sans discussion.",
        "A bug within a year of delivery? I fix it for free, no questions asked.",
    ),

    // Comparison
    "compareeyebrow": text("Comparatif", "Comparison"),
    "comparetitle": text("Ailleurs en option. Ici, inclus.", "Extras elsewhere. Included here."),
    "compareintro": text(
        "Ce que vous obtenez avec moi, comparé aux autres façons courantes de créer un site ou une appli.",
        "What you get with me, compared with the other usual ways to build a site or an app.",
    ),
    "comparecaption": text(
        "Comparaison entre Thomas Gysemans, une agence classique et un constructeur de site",
        "Comparison between Thomas Gysemans, a traditional agency and a website builder",
    ),
    "criterion": text("Critère", "Criterion"),
    "withme": text("Avec moi", "With me"),
    "agency": text("Agence classique", "Traditional agency"),
    "builder": text("Constructeur de site", "Website builder"),
    "yes": text("Inclus", "Included"),
    "opt": text("Souvent en option", "Often an extra"),
    "var": text("Selon le prestataire", "Depends on the provider"),
    "no": text("Rarement", "Rarely"),
    "comparenote": text(
        "Comparaison générale : chaque agence et chaque outil est différent.",
        "General comparison: every agency and every tool is different.",
    ),

    // Pricing
    "pricingeyebrow": text("Tarifs", "Pricing"),
    "pricingtitle": text("Un prix pensé pour votre projet, pas pour un modèle.", "A price built for your project, not for a template."),
    "pricingintro": text(
        "Chaque projet est différent, chaque devis aussi. On fait le point gratuitement, et vous connaissez le prix avant que le travail commence.",
        "Every project is different, and so is every quote. We review it together for free, and you know the price before any work begins.",
    ),
    "fixedprice": text("Prix fixe", "Fixed price"),
    "from": text("à partir de", "from"),
    "price": text("prix", "price"),
    "onquote": text("Sur devis", "On quote"),
    "pricingnote1": text(
        "Le devis est gratuit et sans engagement. Une fois signé, le prix ne bouge plus.",
        "The quote is free and with no commitment. Once signed, the price does not change.",
    ),
    "pricingnote2": text("Paiement sécurisé possible via Malt.", "Secure payment available through Malt."),

    // FAQ
    "faqtitle": text("Vos questions, mes réponses.", "Your questions, my answers."),
    "askbox": text("Encore une question ?", "Still have a question?"),
    "askboxtext": text("Écrivez à cette adresse, je réponds sous 48 h.", "Write to this address, I reply within 48 hours."),

    // Quote
    "launcheyebrow": text("Réponse sous 48 h", "Reply within 48 hours"),
    "launchtitle": text("Prêt pour le décollage ?", "Ready for liftoff?"),
    "launchintro": text(
        "Décrivez votre projet en quelques lignes. Je vous réponds sous 48 h avec un devis gratuit, sans engagement.",
        "Describe your project in a few lines. I reply within 48 hours with a free, no-commitment quote.",
    ),
} satisfies Record<string, Localized>;

// The countdown of the method section (3, 2, 1, liftoff)
export const steps: { title: Localized, text: Localized }[] = [
    {
        title: text("Maquettes", "Mockups"),
        text: text(
            "Je dessine chaque écran. Vous les validez un par un, et rien n'est codé sans votre accord.",
            "I design every screen. You approve them one by one, and nothing gets coded without your go-ahead.",
        ),
    },
    {
        title: text("Prototype"),
        text: text(
            "Vous cliquez dans votre futur site ou votre appli avant même son développement.",
            "You click through your future site or app before it is even built.",
        ),
    },
    {
        title: text("Développement", "Development"),
        text: text(
            "Je code et je teste. Chaque ligne est relue, et des tests automatisés tournent à chaque livraison.",
            "I code and I test. Every line is reviewed, and automated tests run on every delivery.",
        ),
    },
    {
        title: text("Décollage", "Liftoff"),
        text: text(
            "Votre projet part en ligne dans les délais. Vous recevez le code source et toutes les clés.",
            "Your project goes live on schedule. You receive the source code and all the keys.",
        ),
    },
];

export type Availability = "yes" | "opt" | "var" | "no";

// Rows of the comparison table: me, a traditional agency, a website builder
export const comparison: { group: Localized, rows: { label: Localized, cells: [Availability, Availability, Availability] }[] }[] = [
    {
        group: text("Design"),
        rows: [
            { label: text("Maquettes dessinées pour vous", "Mockups designed for you"), cells: ["yes", "var", "no"] },
            { label: text("Prototype cliquable avant le code", "Clickable prototype before coding"), cells: ["yes", "opt", "no"] },
        ],
    },
    {
        group: text("Code"),
        rows: [
            { label: text("Conforme au RGAA (accessibilité)", "Accessibility compliant"), cells: ["yes", "no", "var"] },
            { label: text("Conforme au RGPD", "GDPR compliant"), cells: ["yes", "var", "no"] },
            { label: text("Aucun traceur par défaut", "No tracker by default"), cells: ["yes", "var", "no"] },
            { label: text("Bonnes pratiques SEO", "SEO best practices"), cells: ["yes", "var", "no"] },
            { label: text("Support Core Web Vitals", "Core Web Vitals support"), cells: ["yes", "var", "no"] },
            { label: text("Code source remis", "Source code handed over"), cells: ["yes", "var", "no"] },
        ],
    },
    {
        group: text("Mise en ligne et suivi", "Launch and follow-up"),
        rows: [
            { label: text("Mise en ligne", "Going live"), cells: ["yes", "opt", "yes"] },
            { label: text("Garantie un an sur les bugs", "One-year bug guarantee"), cells: ["yes", "opt", "no"] },
            { label: text("Un seul interlocuteur", "One single contact"), cells: ["yes", "no", "no"] },
            { label: text("Prix fixe, sans abonnement", "Fixed price, no subscription"), cells: ["yes", "var", "no"] },
        ],
    },
];

// The three offers. `preset` pre-selects the project type of the quote form.
export const plans: {
    preset: "site" | "app" | "soft",
    title: Localized,
    pitch: Localized,
    audience: Localized,
    features: Localized[],
    startingPrice: boolean, // "from {price}" with a fixed price, otherwise "on quote"
}[] = [
    {
        preset: "site",
        title: text("Site vitrine", "Showcase website"),
        pitch: text("Votre activité, présentée sous son meilleur jour.", "Your business, shown at its best."),
        audience: text("Pour les artisans, commerçants et indépendants.", "For craftspeople, shops and independents."),
        features: [
            text("Design sur mesure", "Custom design"),
            text("Beau sur chaque écran", "Beautiful on every screen"),
            text("Conforme au RGPD et au RGAA", "Privacy and accessibility compliant"),
            text("Mise en ligne et hébergement", "Launch and hosting"),
            text("Garantie un an", "One-year guarantee"),
        ],
        startingPrice: true,
    },
    {
        preset: "app",
        title: text("Application mobile", "Mobile app"),
        pitch: text("Votre service, dans la poche de vos clients.", "Your service, in your customers' pockets."),
        audience: text("Pour les entreprises et les porteurs de projet.", "For businesses and project founders."),
        features: [
            text("iOS et Android, avec Flutter ou Tauri", "iOS and Android, with Flutter or Tauri"),
            text("Interface d'administration web", "Web admin interface"),
            text("Publication sur les stores", "Published on the app stores"),
            text("Tests automatisés à chaque livraison", "Automated tests on every delivery"),
            text("Garantie un an", "One-year guarantee"),
        ],
        startingPrice: false,
    },
    {
        preset: "soft",
        title: text("Logiciel ou appli web", "Software or web app"),
        pitch: text("Un outil taillé pour votre métier.", "A tool cut out for your trade."),
        audience: text("Pour les équipes qui veulent gagner du temps.", "For teams that want to save time."),
        features: [
            text("Comptes et espaces clients", "Accounts and client areas"),
            text("Tableaux de bord sur mesure", "Custom dashboards"),
            text("Base de données pensée pour vous", "A database designed for you"),
            text("Code source remis", "Source code handed over"),
            text("Garantie un an", "One-year guarantee"),
        ],
        startingPrice: false,
    },
];

// Also published as FAQPage structured data by the page, so both always match.
export const faq: { q: Localized, a: Localized }[] = [
    {
        q: text("Vous développez aussi des applications mobiles ?", "Do you also build mobile apps?"),
        a: text(
            "Oui, et même sur ordinateur. Prism Security Manager, par exemple, fonctionne sur Android, iOS, macOS, Windows et Linux à partir d'un seul code. Je m'occupe aussi de la publication sur les stores.",
            "Yes, and desktop apps too. Prism Security Manager, for example, runs on Android, iOS, macOS, Windows and Linux from a single codebase. I also handle publishing on the app stores.",
        ),
    },
    {
        q: text("Et des logiciels ?", "And software?"),
        a: text(
            "Oui, pour le navigateur comme pour l'ordinateur. Pour GTI, j'ai remplacé un logiciel Microsoft Access de 2003 par une application web interne, sans bousculer les habitudes des équipes.",
            "Yes, for the browser as well as the desktop. For GTI, I replaced a 2003 Microsoft Access program with an internal web app, without upsetting the teams' habits.",
        ),
    },
    {
        q: text("L'accessibilité, c'est obligatoire pour moi ?", "Is accessibility mandatory for me?"),
        a: text(
            "C'est déjà le cas pour les services publics. Depuis le 28 juin 2025, la directive européenne sur l'accessibilité l'étend à de nombreux services privés, comme le commerce en ligne ou la banque. Les microentreprises de services en sont exemptées, mais un site accessible reste un site que plus de monde peut utiliser.",
            "It already is for public services. Since 28 June 2025, the European Accessibility Act extends it to many private services, such as online shops or banking. Service microenterprises are exempt, but an accessible site is still a site more people can use.",
        ),
    },
    {
        q: text("Et le RGPD ?", "What about the GDPR?"),
        a: text(
            "Par défaut, je n'installe aucun traceur publicitaire. Si vous voulez mesurer votre audience, j'utilise un outil exempté de consentement par la CNIL, ou je le place derrière votre accord. Résultat : bien souvent, aucun bandeau cookies.",
            "By default, I install no advertising tracker. If you want to measure your audience, I use a tool exempt from consent, or place it behind your visitors' agreement. As a result, there is often no cookie banner at all.",
        ),
    },
    {
        q: text("En combien de temps mon projet est livré ?", "How long until my project is delivered?"),
        a: text(
            "Le délai dépend du périmètre. On le fixe ensemble dans le devis, avant de commencer, et il est tenu : c'est ce que mes clients citent en premier.",
            "It depends on the scope. We set the deadline together in the quote, before starting, and it is met: that is the first thing my clients mention.",
        ),
    },
    {
        q: text("Je n'ai qu'une idée vague, c'est un problème ?", "I only have a vague idea, is that a problem?"),
        a: text(
            "Non. Une idée approximative suffit pour un premier échange, on affine ensemble. Les maquettes servent justement à voir le projet avant de le construire.",
            "No. A rough idea is enough for a first conversation, we refine it together. That is exactly what the mockups are for: seeing the project before building it.",
        ),
    },
    {
        q: text("À qui appartient le code ?", "Who owns the code?"),
        a: text(
            "À vous. À la livraison, vous recevez le code source et tous les accès : nom de domaine, hébergement, comptes des stores. Vous n'êtes lié à personne.",
            "You do. On delivery, you receive the source code and every access: domain name, hosting, app store accounts. You are tied to no one.",
        ),
    },
    {
        q: text("Et après la livraison ?", "And after delivery?"),
        a: text(
            "Pendant un an, tout bug est corrigé gratuitement, sans discussion. Pour de nouvelles fonctionnalités, on repart sur un devis, comme au début.",
            "For a year, any bug is fixed for free, no questions asked. For new features, we start again from a quote, as at the beginning.",
        ),
    },
    {
        q: text("Vous utilisez l'IA ?", "Do you use AI?"),
        a: text(
            "Oui, comme un outil : elle m'aide à livrer plus vite et à repérer les cas limites tôt. Chaque ligne reste relue par moi, et des tests automatisés tournent à chaque livraison.",
            "Yes, as a tool: it helps me deliver faster and catch edge cases early. Every line is still reviewed by me, and automated tests run on every delivery.",
        ),
    },
    {
        q: text("Je peux passer par Malt ?", "Can I go through Malt?"),
        a: text(
            "Oui. Sur Malt, le paiement est sécurisé et la mission est encadrée du début à la fin.",
            "Yes. On Malt, payment is secured and the assignment is covered from start to finish.",
        ),
    },
];
