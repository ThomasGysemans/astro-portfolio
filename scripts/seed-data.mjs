// src/i18n/text.ts
function text(fr, en) {
  return {
    fr,
    en: en ?? fr
  };
}

// src/data/projects.ts
var ROLES = {
  app: "app",
  backOffice: "back-office",
  frontend: "frontend",
  framework: "framework",
  language: "language",
  styling: "styling",
  backend: "backend",
  threeD: "3d",
  engine: "engine",
  database: "database",
  markup: "markup",
  tooling: "tooling"
};
var PROJECTS = [
  {
    slug: "my-stage",
    name: text("MyStage"),
    featured: true,
    category: "web",
    type: "app-and-website",
    year: 2025,
    date: "2025",
    teamSize: 1,
    context: "professional",
    languages: ["fr"],
    thumb: "/thumbs/mystage.jpg",
    link: "https://my-stage.fr",
    sub: text("App Flutter & back-office web", "Flutter app & web back-office"),
    description: text(
      "Une application de suivi de stage pour \xE9tudiants, publi\xE9e sur les deux stores, avec un back-office web.",
      "An internship tracking app for students, published on both app stores, with a web back-office."
    ),
    about: text(
      "MyStage est une application de suivi de stage pour \xE9tudiants, d\xE9velopp\xE9e avec Flutter et publi\xE9e sur l'App Store et le Play Store. Les \xE9tudiants consignent leur stage jour apr\xE8s jour, tandis que les tuteurs suivent leur progression depuis un back-office SvelteKit propuls\xE9 par PocketBase.",
      "MyStage is an internship tracking app for students, built with Flutter and published on both app stores. Students log their internship day by day, while supervisors follow their progress from a SvelteKit back-office backed by PocketBase."
    ),
    tagline: text("PUBLI\xC9E SUR LES DEUX STORES", "PUBLISHED ON BOTH APP STORES"),
    caption: text("MyStage \u2014 suivi des t\xE2ches sur mobile", "MyStage \u2014 task tracking on mobile"),
    techs: [
      { name: "Flutter", role: ROLES.app },
      { name: "SvelteKit", role: ROLES.backOffice },
      { name: "Svelte", role: ROLES.frontend },
      { name: "TypeScript", role: ROLES.language },
      { name: "Tailwind", role: ROLES.styling },
      { name: "PocketBase", role: ROLES.backend }
    ]
  },
  {
    slug: "portfolio",
    name: text("Portfolio"),
    featured: true,
    category: "web",
    type: "website",
    year: 2025,
    date: "2025",
    teamSize: 1,
    context: "personal",
    languages: ["fr", "en"],
    thumb: "/thumbs/portfolio.jpg",
    github: "https://github.com/ThomasGysemans/astro-portfolio",
    link: "https://thomasgysemans.dev",
    sub: text("Ce site m\xEAme \u2014 Astro + Svelte", "This very site \u2014 Astro + Svelte"),
    description: text(
      "Ce site m\xEAme \u2014 toutes mes comp\xE9tences et mes anciens projets, avec un backend PocketBase self-hosted.",
      "This very site \u2014 all my skills and past projects, with a self-hosted PocketBase backend."
    ),
    about: text(
      "C'est mon portfolio. Il r\xE9capitule toutes mes comp\xE9tences et mes anciens projets, personnels comme professionnels. L'objectif est de prouver mes comp\xE9tences \xE0 un potentiel employeur \u2014 et peut-\xEAtre un jour lancer ma carri\xE8re freelance. Toutes les donn\xE9es vivent dans une base PocketBase que j'ai configur\xE9e moi-m\xEAme, avec un back-office priv\xE9 pour mettre \xE0 jour le contenu \xE0 tout moment.",
      "This is my portfolio. It recaps all my skills and past projects, both personal and professional. The goal is to prove my skills to a potential employer \u2014 and maybe one day launch my freelance career. All data lives in a PocketBase database I configured myself, with a private back-office to update content at any time."
    ),
    tagline: text("VOUS \xCATES ICI", "YOU ARE HERE"),
    caption: text(
      "Page d'accueil \u2014 Terre 3D interactive r\xE9alis\xE9e avec ThreeJS & Threlte",
      "Home page \u2014 interactive 3D Earth built with ThreeJS & Threlte"
    ),
    techs: [
      { name: "Svelte", role: ROLES.frontend },
      { name: "AstroJS", role: ROLES.framework },
      { name: "Tailwind", role: ROLES.styling },
      { name: "SCSS", role: ROLES.styling },
      { name: "Threlte", role: ROLES.threeD },
      { name: "PocketBase", role: ROLES.backend }
    ]
  },
  {
    slug: "space-visitor",
    name: text("Space Visitor"),
    featured: false,
    category: "games",
    type: "video-game",
    year: 2024,
    date: "2024",
    teamSize: 1,
    context: "personal",
    languages: ["en"],
    thumb: "/thumbs/space-visitor.jpg",
    github: "https://github.com/ThomasGysemans/SpaceVisitor",
    link: "https://spacevisitor.sciencesky.fr/",
    sub: text("Jeu 3D d'exploration du Syst\xE8me Solaire", "3D solar-system exploration game"),
    description: text(
      "Un jeu 3D dans lequel on survole le Syst\xE8me Solaire, directement dans le navigateur.",
      "A 3D game where you fly through the Solar System, right in the browser."
    ),
    about: text(
      "Space Visitor est un jeu 3D dans lequel le joueur vole \xE0 travers le Syst\xE8me Solaire, croisant les plan\xE8tes \u2014 dont la Terre \u2014 et le Soleil. Il est enti\xE8rement r\xE9alis\xE9 avec ThreeJS et Threlte et jouable directement dans le navigateur.",
      "Space Visitor is a 3D game in which the player flies through the Solar System, passing the planets \u2014 including Earth \u2014 and the Sun. It is built entirely with ThreeJS and Threlte and playable directly in the browser."
    ),
    tagline: text("EXPLOREZ LE SYST\xC8ME SOLAIRE", "EXPLORE THE SOLAR SYSTEM"),
    caption: text("Space Visitor \u2014 en vol parmi les plan\xE8tes", "Space Visitor \u2014 flying past the planets"),
    techs: [
      { name: "Threlte", role: ROLES.threeD },
      { name: "TypeScript", role: ROLES.language }
    ]
  },
  {
    slug: "bangerking",
    name: text("BangerKing"),
    featured: false,
    category: "languages",
    type: "programming-language",
    year: 2024,
    date: "2024",
    teamSize: 1,
    context: "personal",
    languages: ["en"],
    thumb: "/thumbs/bangerking.jpeg",
    github: "https://github.com/ThomasGysemans/Bangerking",
    sub: text("Un langage de programmation maison", "A custom programming language"),
    description: text(
      "Un langage de programmation interpr\xE9t\xE9 et compil\xE9, \xE9crit from scratch en C++.",
      "An interpreted and compiled programming language, written from scratch in C++."
    ),
    about: text(
      "BangerKing est mon propre langage de programmation \u2014 \xE0 la fois interpr\xE9t\xE9 et compil\xE9 \u2014 \xE9crit from scratch en C++ : lexer, parser, interpr\xE9teur et compilation. C'est le projet qui m'a appris comment les langages fonctionnent r\xE9ellement sous le capot.",
      "BangerKing is my own programming language \u2014 both interpreted and compiled \u2014 written from scratch in C++: lexer, parser, interpreter and compilation. It is the project that taught me how languages actually work under the hood."
    ),
    tagline: text("INTERPR\xC9T\xC9 & COMPIL\xC9", "INTERPRETED & COMPILED"),
    caption: text("BangerKing \u2014 un langage cr\xE9\xE9 from scratch", "BangerKing \u2014 a language built from scratch"),
    techs: [
      { name: "C++", role: ROLES.language }
    ]
  },
  {
    slug: "space-invaders",
    name: text("Space Invaders ++"),
    featured: false,
    category: "games",
    type: "video-game",
    year: 2024,
    date: "2024",
    teamSize: 2,
    context: "school",
    languages: ["fr"],
    thumb: "/thumbs/space-invaders.png",
    sub: text("Jeu multijoueur en \xE9quipe", "Multiplayer team game"),
    description: text(
      "Une r\xE9interpr\xE9tation multijoueur de Space Invaders, r\xE9alis\xE9e pour un projet scolaire.",
      "A team-based multiplayer take on Space Invaders, built for a school project."
    ),
    about: text(
      "Space Invaders ++ est une r\xE9interpr\xE9tation multijoueur du classique de l'arcade, r\xE9alis\xE9e en \xE9quipe de deux dans le cadre d'un projet scolaire avec TypeScript, HTML et SCSS.",
      "Space Invaders ++ is a team-based multiplayer reinterpretation of the arcade classic, built as a school project in a team of two with TypeScript, HTML and SCSS."
    ),
    tagline: text("ARCADE MULTIJOUEUR", "MULTIPLAYER ARCADE"),
    caption: text("Space Invaders ++ \u2014 de l'arcade en multijoueur", "Space Invaders ++ \u2014 multiplayer arcade action"),
    techs: [
      { name: "TypeScript", role: ROLES.language },
      { name: "HTML", role: ROLES.markup },
      { name: "SCSS", role: ROLES.styling }
    ]
  },
  {
    slug: "ysa",
    name: text("YSA"),
    featured: true,
    category: "web",
    type: "website",
    year: 2023,
    date: "2023",
    teamSize: 1,
    context: "professional",
    languages: ["fr"],
    thumb: "/thumbs/ysa.jpeg",
    link: "https://ysatoiture.fr",
    sub: text("Site d'une entreprise de toiture & r\xE9novation", "Roofing & renovation company site"),
    description: text(
      "Un site vitrine pour une entreprise de toiture & r\xE9novation \u2014 livr\xE9 de A \xE0 Z en freelance.",
      "A showcase website for a roofing & renovation company \u2014 delivered A to Z as a freelancer."
    ),
    about: text(
      "YSA est un site vitrine pour une entreprise de toiture et de r\xE9novation \u2014 un projet freelance livr\xE9 de A \xE0 Z : design, d\xE9veloppement, h\xE9bergement et d\xE9ploiement, dans un d\xE9lai pr\xE9cis.",
      "YSA is a showcase website for a roofing and renovation company \u2014 my freelance work delivered A to Z: design, development, hosting and deployment, on a precise deadline."
    ),
    tagline: text("FREELANCE, LIVR\xC9 DE A \xC0 Z", "FREELANCE, DELIVERED A TO Z"),
    caption: text("YSA \u2014 site vitrine client", "YSA \u2014 client showcase site"),
    techs: [
      { name: "SvelteKit", role: ROLES.framework },
      { name: "Svelte", role: ROLES.frontend },
      { name: "TypeScript", role: ROLES.language },
      { name: "SCSS", role: ROLES.styling }
    ]
  },
  {
    slug: "symfony-challenge",
    name: text("Symfony Challenge"),
    featured: true,
    category: "web",
    type: "website",
    year: 2023,
    date: "2023",
    teamSize: 1,
    context: "personal",
    languages: ["fr"],
    thumb: "/thumbs/symfony-challenge.jpeg",
    github: "https://github.com/ThomasGysemans/lemon-interactive-challenge",
    sub: text("Site CRUD avec Symfony", "CRUD website with Symfony"),
    description: text(
      "Un site CRUD complet r\xE9alis\xE9 avec Symfony, PHP et SQL.",
      "A full CRUD website built with Symfony, PHP and SQL."
    ),
    about: text(
      "Symfony Challenge est un site CRUD r\xE9alis\xE9 avec Symfony, PHP et SQL \u2014 du mod\xE8le de donn\xE9es aux pages finales. Un challenge personnel pour ma\xEEtriser un framework PHP full-stack classique.",
      "Symfony Challenge is a CRUD website built with Symfony, PHP and SQL \u2014 from data model to final pages. A personal challenge to master a classic full-stack PHP framework."
    ),
    tagline: text("PHP FULL-STACK", "FULL-STACK PHP"),
    caption: text("Symfony Challenge \u2014 site CRUD", "Symfony Challenge \u2014 CRUD website"),
    techs: [
      { name: "Symfony", role: ROLES.framework },
      { name: "PHP", role: ROLES.language },
      { name: "SQL", role: ROLES.database }
    ]
  },
  {
    slug: "Ilyva",
    name: text("Ilyva"),
    featured: true,
    category: "games",
    type: "video-game",
    year: 2023,
    date: "2023",
    teamSize: 4,
    context: "school",
    languages: ["fr"],
    thumb: "/thumbs/ilyva.jpeg",
    github: "https://github.com/ThomasGysemans/ilyva-website",
    link: "https://ilyva.sciencesky.fr/",
    sub: text("Un escape game autour de BASH", "A BASH escape game"),
    description: text(
      "Un escape game d'\xE9nigmes BASH, cr\xE9\xE9 en \xE9quipe de quatre pour un projet scolaire.",
      "An escape game of BASH riddles, created as a school project in a team of four."
    ),
    about: text(
      "Ilyva est un escape game construit autour d'\xE9nigmes BASH, cr\xE9\xE9 en \xE9quipe de quatre pour un projet scolaire \u2014 une exp\xE9rience web SvelteKit combin\xE9e \xE0 Godot, o\xF9 les joueurs r\xE9solvent des \xE9nigmes de terminal pour progresser.",
      "Ilyva is an escape game built around BASH riddles, created as a school project in a team of four \u2014 a SvelteKit web experience combined with Godot, where players solve terminal puzzles to progress."
    ),
    tagline: text("UN ESCAPE GAME SUR BASH", "AN ESCAPE GAME ON BASH"),
    caption: text("Ilyva \u2014 r\xE9solvez des \xE9nigmes BASH pour vous \xE9chapper", "Ilyva \u2014 solve BASH riddles to escape"),
    techs: [
      { name: "SvelteKit", role: ROLES.framework },
      { name: "TypeScript", role: ROLES.language },
      { name: "SCSS", role: ROLES.styling },
      { name: "Godot", role: ROLES.engine }
    ]
  },
  {
    slug: "sciencesky-app",
    name: text("ScienceSky App"),
    featured: false,
    category: "apps",
    type: "mobile-app",
    year: 2023,
    date: "2023",
    teamSize: 1,
    context: "personal",
    languages: ["fr"],
    thumb: "/thumbs/sciencesky-app.jpeg",
    sub: text("App mobile de vulgarisation scientifique", "Science outreach mobile app"),
    description: text(
      "Une app mobile pour rendre la science accessible \xE0 tous, r\xE9alis\xE9e avec Flutter.",
      "A mobile app to make science accessible to everyone, built with Flutter."
    ),
    about: text(
      "ScienceSky App am\xE8ne la plateforme de vulgarisation ScienceSky sur mobile \u2014 une app Flutter pour rendre la science et l'astronomie accessibles \xE0 tous.",
      "ScienceSky App brings the ScienceSky outreach platform to mobile \u2014 a Flutter app to make science and astronomy accessible to everyone."
    ),
    tagline: text("LA SCIENCE DANS VOTRE POCHE", "SCIENCE IN YOUR POCKET"),
    caption: text("ScienceSky App \u2014 la science dans votre poche", "ScienceSky App \u2014 science in your pocket"),
    techs: [
      { name: "Flutter", role: ROLES.app }
    ]
  },
  {
    slug: "aoc-2023",
    name: text("Advent Of Code 2023"),
    featured: false,
    category: "challenges",
    type: "coding-challenge",
    year: 2023,
    date: "2023",
    teamSize: 1,
    context: "personal",
    languages: ["en"],
    thumb: "/thumbs/advent-of-code.jpeg",
    github: "https://github.com/ThomasGysemans/adventofcode-2023",
    sub: text("No\xEBl en C++ et Rust", "Christmas in C++ and Rust"),
    description: text(
      "Les \xE9nigmes de l'Advent Of Code 2023, r\xE9solues en C++ et Rust.",
      "The Advent Of Code 2023 puzzles, solved in C++ and Rust."
    ),
    about: text(
      "Advent Of Code 2023 \u2014 une s\xE9rie quotidienne d'\xE9nigmes algorithmiques tout au long de d\xE9cembre, que j'ai r\xE9solues en C++ et Rust pour aiguiser mes comp\xE9tences bas niveau.",
      "Advent Of Code 2023 \u2014 a daily series of algorithmic puzzles throughout December, which I solved in C++ and Rust to sharpen my low-level skills."
    ),
    tagline: text("NO\xCBL EN C++", "CHRISTMAS IN C++"),
    caption: text("Advent Of Code \u2014 une \xE9nigme par jour", "Advent Of Code \u2014 one puzzle a day"),
    techs: [
      { name: "C++", role: ROLES.language },
      { name: "Rust", role: ROLES.language }
    ]
  },
  {
    slug: "m100",
    name: text("M100"),
    featured: false,
    category: "web",
    type: "website",
    year: 2023,
    date: "2023",
    teamSize: 1,
    context: "personal",
    languages: ["fr"],
    thumb: "/thumbs/m100.jpeg",
    github: "https://github.com/ThomasGysemans/BashInGodot",
    link: "https://m100.thomasgysemans.dev/",
    sub: text("Interpr\xE9teur BASH maison dans Godot", "Custom BASH interpreter in Godot"),
    description: text(
      "Un interpr\xE9teur BASH maison r\xE9alis\xE9 avec Godot.",
      "A custom BASH interpreter built with Godot."
    ),
    about: text(
      "M100 est un interpr\xE9teur BASH maison r\xE9alis\xE9 avec Godot \u2014 un \xE9mulateur de terminal qui comprend son propre dialecte BASH, r\xE9utilis\xE9 ensuite pour l'escape game Ilyva.",
      "M100 is a custom BASH interpreter built with Godot \u2014 a terminal emulator that understands its own BASH dialect, later reused for the Ilyva escape game."
    ),
    tagline: text("UN TERMINAL SUR MESURE", "A CUSTOM TERMINAL"),
    caption: text("M100 \u2014 un terminal qui parle BASH", "M100 \u2014 a terminal that speaks BASH"),
    techs: [
      { name: "Godot", role: ROLES.engine },
      { name: "BASH", role: ROLES.language }
    ]
  },
  {
    slug: "bdd-jo",
    name: text("BDD des JO", "Olympic Games database"),
    featured: false,
    category: "other",
    badge: "SQL",
    type: "database-project",
    year: 2023,
    date: "2023",
    teamSize: 2,
    context: "school",
    languages: ["fr"],
    thumb: "/thumbs/olympic-games-database.jpeg",
    github: "https://github.com/ThomasGysemans/IUT-Sae204",
    sub: text("Requ\xEAtes & statistiques", "Queries & statistics"),
    description: text(
      "Requ\xEAtes et statistiques sur une base de donn\xE9es des Jeux Olympiques \u2014 un projet SQL scolaire.",
      "Queries and statistics over an Olympic Games database \u2014 a school SQL project."
    ),
    about: text(
      "Un projet scolaire en \xE9quipe de deux : concevoir et interroger une base de donn\xE9es des Jeux Olympiques \u2014 requ\xEAtes SQL avanc\xE9es et statistiques sur des donn\xE9es historiques.",
      "A school project in a team of two: designing and querying an Olympic Games database \u2014 advanced SQL queries and statistics over historical data."
    ),
    tagline: text("REQU\xCATES & STATISTIQUES", "QUERIES & STATISTICS"),
    caption: text("BDD des JO \u2014 statistiques SQL", "Olympic Games database \u2014 SQL statistics"),
    techs: [
      { name: "SQL", role: ROLES.database }
    ]
  },
  {
    slug: "chasse-au-monstre",
    name: text("Chasse au monstre", "Monster Hunt"),
    featured: false,
    category: "games",
    type: "video-game",
    year: 2023,
    date: "2023",
    teamSize: 4,
    context: "school",
    languages: ["fr"],
    thumb: "/thumbs/monster-hunt.jpeg",
    github: "https://github.com/Yoshiip/chasse-au-monstre",
    sub: text("Jeu multijoueur en Java", "Multiplayer game in Java"),
    description: text(
      "Un jeu multijoueur de chasse au monstre r\xE9alis\xE9 en Java, pour un projet scolaire.",
      "A multiplayer monster-hunting game made in Java, as a school project."
    ),
    about: text(
      "Chasse au monstre \xBB est un jeu multijoueur r\xE9alis\xE9 en Java en \xE9quipe de quatre pour un projet scolaire \u2014 un joueur cache le monstre, les autres le traquent.",
      '"Chasse au monstre" is a multiplayer monster-hunting game made in Java as a school project in a team of four \u2014 one player hides the monster, the others hunt it down.'
    ),
    tagline: text("MULTIJOUEUR EN JAVA", "MULTIPLAYER IN JAVA"),
    caption: text("Chasse au monstre \u2014 cache-cache en Java", "Monster Hunt \u2014 hide and seek in Java"),
    techs: [
      { name: "Java", role: ROLES.language }
    ]
  },
  {
    slug: "dinodash",
    name: text("DinoDash"),
    featured: false,
    category: "games",
    type: "video-game",
    year: 2023,
    date: "2023",
    teamSize: 4,
    context: "school",
    languages: ["fr"],
    thumb: "/thumbs/dinodash.png",
    sub: text("Le Dino de Chrome dans le terminal", "Chrome Dino in the terminal"),
    description: text(
      "Le jeu du Dino de Chrome, recr\xE9\xE9 dans le terminal avec Java.",
      "The Chrome Dino game, recreated in the terminal with Java."
    ),
    about: text(
      "DinoDash recr\xE9e le c\xE9l\xE8bre runner du Dino de Chrome \u2014 mais dans le terminal, en Java, en \xE9quipe de quatre pour un projet scolaire.",
      "DinoDash recreates the famous Chrome Dino runner \u2014 but in the terminal, built in Java as a school project in a team of four."
    ),
    tagline: text("UN RUNNER DANS LE TERMINAL", "A RUNNER IN THE TERMINAL"),
    caption: text("DinoDash \u2014 le Dino court dans le terminal", "DinoDash \u2014 the Dino runs in the terminal"),
    techs: [
      { name: "Java", role: ROLES.language }
    ]
  },
  {
    slug: "foodhalluin",
    name: text("Food'Halluin"),
    featured: false,
    category: "web",
    type: "website",
    year: 2022,
    date: "2022",
    teamSize: 1,
    context: "professional",
    languages: ["fr"],
    thumb: "/thumbs/foodhalluin.jpeg",
    sub: text("Plateforme de restaurants", "Restaurants platform"),
    description: text(
      "Une plateforme commune pour les restaurants de la ville d'Halluin.",
      "A shared platform for the restaurants of the town of Halluin."
    ),
    about: text(
      "Food'Halluin est une plateforme commune pour les restaurants d'Halluin \u2014 un projet client freelance r\xE9alis\xE9 avec NextJS, React et Firebase, permettant aux restaurants de pr\xE9senter leurs menus au m\xEAme endroit.",
      "Food'Halluin is a shared platform for the restaurants of Halluin \u2014 freelance client work built with NextJS, React and Firebase, letting restaurants present their menus in one place."
    ),
    tagline: text("UNE PLATEFORME, TOUS LES RESTOS", "ONE PLATFORM, EVERY RESTO"),
    caption: text("Food'Halluin \u2014 une plateforme pour tous les restaurants", "Food'Halluin \u2014 one platform for every restaurant"),
    techs: [
      { name: "NextJS", role: ROLES.framework },
      { name: "React", role: ROLES.frontend },
      { name: "TypeScript", role: ROLES.language },
      { name: "SCSS", role: ROLES.styling },
      { name: "Firebase", role: ROLES.backend }
    ]
  },
  {
    slug: "sae15",
    name: text("Vitrine \xE9comobilit\xE9", "Eco-mobility showcase"),
    featured: false,
    category: "web",
    type: "website",
    year: 2022,
    date: "2022",
    teamSize: 4,
    context: "school",
    languages: ["fr"],
    thumb: "/thumbs/eco-mobility.jpeg",
    github: "https://github.com/ThomasGysemans/IUT-Sae1-5",
    link: "https://sae15.thomasgysemans.dev",
    sub: text("Maquette d'un site simple", "Mockup of a basic website"),
    description: text(
      "La maquette d'un site vitrine sur l'\xE9comobilit\xE9, r\xE9alis\xE9e \xE0 l'\xE9cole.",
      "A mockup of a showcase website about eco-friendly transport, built at school."
    ),
    about: text(
      "Un projet scolaire en \xE9quipe de quatre : la maquette d'un site vitrine simple sur les transports \xE9cologiques, r\xE9alis\xE9e en HTML, CSS et JavaScript purs.",
      "A school project in a team of four: the mockup of a basic showcase website about eco-friendly transport, built with plain HTML, CSS and JavaScript."
    ),
    tagline: text("RETOUR AUX BASES", "BACK TO BASICS"),
    caption: text("\xC9comobilit\xE9 \u2014 HTML/CSS/JS purs", "Eco-mobility \u2014 plain HTML/CSS/JS"),
    techs: [
      { name: "HTML", role: ROLES.markup },
      { name: "CSS", role: ROLES.styling },
      { name: "JavaScript", role: ROLES.language }
    ]
  },
  {
    slug: "microsoft-world-conquest",
    name: text("Microsoft World Conquest"),
    featured: false,
    category: "games",
    type: "video-game",
    year: 2022,
    date: "2022",
    teamSize: 2,
    context: "school",
    languages: ["fr"],
    thumb: "/thumbs/microsoft-world-conquest.png",
    github: "https://github.com/ThomasGysemans/IUT-Microsoft-World-Conquest",
    sub: text("Un jeu 2D dans le terminal", "A 2D game in the terminal"),
    description: text(
      "Un jeu de strat\xE9gie 2D jouable enti\xE8rement dans le terminal.",
      "A 2D strategy game playable entirely in the terminal."
    ),
    about: text(
      "Microsoft World Conquest est un jeu 2D jouable enti\xE8rement dans le terminal, r\xE9alis\xE9 en Java et BASH en \xE9quipe de deux pour un projet scolaire.",
      "Microsoft World Conquest is a 2D game playable entirely in the terminal, built in Java and BASH as a school project in a team of two."
    ),
    tagline: text("DE LA 2D DANS LE TERMINAL", "2D IN THE TERMINAL"),
    caption: text("Microsoft World Conquest \u2014 gameplay dans le terminal", "Microsoft World Conquest \u2014 terminal gameplay"),
    techs: [
      { name: "Java", role: ROLES.language },
      { name: "BASH", role: ROLES.tooling }
    ]
  },
  {
    slug: "versajs",
    name: text("VersaJS"),
    featured: false,
    category: "languages",
    type: "programming-language",
    year: 2021,
    date: "2021",
    teamSize: 1,
    context: "personal",
    languages: ["en"],
    thumb: "/thumbs/versajs.png",
    github: "https://github.com/ThomasGysemans/VersaJS",
    sub: text("Langage interpr\xE9t\xE9 en TypeScript", "Interpreted language in TypeScript"),
    description: text(
      "Un langage de programmation interpr\xE9t\xE9 maison, inspir\xE9 de Python et de JSX.",
      "A custom interpreted programming language inspired by Python and JSX."
    ),
    about: text(
      "VersaJS est un langage de programmation interpr\xE9t\xE9 maison inspir\xE9 de Python et de JSX, \xE9crit en TypeScript \u2014 ma premi\xE8re plong\xE9e dans le fonctionnement des interpr\xE9teurs.",
      "VersaJS is a custom interpreted programming language inspired by Python and JSX, written in TypeScript \u2014 my first deep dive into how interpreters work."
    ),
    tagline: text("PYTHON RENCONTRE JSX", "PYTHON MEETS JSX"),
    caption: text("VersaJS \u2014 Python rencontre JSX", "VersaJS \u2014 Python meets JSX"),
    techs: [
      { name: "TypeScript", role: ROLES.language }
    ]
  },
  {
    slug: "code-editor",
    name: text("Code Editor"),
    featured: false,
    category: "apps",
    type: "open-source-project",
    year: 2020,
    date: "2020",
    teamSize: 1,
    context: "personal",
    languages: ["en"],
    thumb: "/thumbs/code-editor.jpg",
    github: "https://github.com/ThomasGysemans/code_editor",
    link: "https://pub.dev/packages/code_editor",
    sub: text("Package Flutter", "Flutter package"),
    description: text(
      "Le package Flutter qui permet d'\xE9crire et d'\xE9diter du code dans une app.",
      "The Flutter package that lets you write and edit code inside an app."
    ),
    about: text(
      "Code Editor est un package Flutter open-source qui permet aux d\xE9veloppeurs d'int\xE9grer un \xE9diteur de code dans leurs propres apps \u2014 coloration syntaxique, \xE9dition, tout y est. Ma contribution open-source la plus utilis\xE9e.",
      "Code Editor is an open-source Flutter package that lets developers embed a code editor inside their own apps \u2014 syntax highlighting, editing, the works. My most-used open-source contribution."
    ),
    tagline: text("PACKAGE OPEN-SOURCE", "OPEN-SOURCE PACKAGE"),
    caption: text("Code Editor \u2014 du code dans votre app", "Code Editor \u2014 code inside your app"),
    techs: [
      { name: "Flutter", role: ROLES.app }
    ]
  },
  {
    slug: "sciencesky",
    name: text("ScienceSky"),
    featured: true,
    category: "web",
    type: "website",
    year: 2018,
    date: "2018",
    teamSize: 1,
    context: "personal",
    languages: ["fr"],
    thumb: "/thumbs/sciencesky.jpg",
    link: "https://sciencesky.fr/",
    sub: text("Plateforme de vulgarisation scientifique", "Science outreach platform"),
    description: text(
      "Une plateforme de vulgarisation pour partager l'astronomie avec tous \u2014 mon premier grand projet.",
      "A science outreach platform for sharing astronomy with everyone \u2014 my first big project."
    ),
    about: text(
      "ScienceSky est une plateforme de vulgarisation scientifique pour rendre l'astronomie accessible \xE0 tous \u2014 articles, images et contenus interactifs. D\xE9marr\xE9 en 2018, c'est mon premier grand projet et l'origine de tout ce qui a suivi.",
      "ScienceSky is a science outreach platform to make astronomy accessible to everyone \u2014 articles, imagery and interactive content. Started in 2018, it was my first big project and the origin of everything that followed."
    ),
    tagline: text("L\xC0 O\xD9 TOUT A COMMENC\xC9", "WHERE IT ALL STARTED"),
    caption: text("ScienceSky \u2014 partager l'astronomie avec tous", "ScienceSky \u2014 sharing astronomy with everyone"),
    techs: [
      { name: "Svelte", role: ROLES.frontend },
      { name: "SCSS", role: ROLES.styling },
      { name: "Firebase", role: ROLES.backend }
    ]
  }
];

// src/data/reviews.ts
var REVIEWS = [
  {
    quote: {
      fr: "Livr\xE9 \xE0 temps, exactement comme promis.",
      en: "Delivered on time, exactly as promised."
    },
    role: { fr: "G\xE9rant", en: "Owner" },
    company: { fr: "YSA \u2014 toiture & r\xE9novation", en: "YSA \u2014 roofing & renovation" },
    year: 2023
  },
  {
    quote: {
      fr: "Une communication claire, du d\xE9but \xE0 la fin.",
      en: "Clear communication, start to finish."
    },
    role: { fr: "Fondateur", en: "Founder" },
    company: { fr: "Food'Halluin \u2014 plateforme de restaurants", en: "Food'Halluin \u2014 restaurants platform" },
    year: 2022
  },
  {
    quote: {
      fr: "Tous les d\xE9lais tenus, des maquettes jusqu'aux stores.",
      en: "Every deadline kept, from mockups to the app stores."
    },
    role: { fr: "Associ\xE9", en: "Partner" },
    company: { fr: "MyStage \u2014 app de suivi de stage", en: "MyStage \u2014 internship tracking app" },
    year: 2025
  }
];

// src/data/technologies.ts
var TECH_COLORS = {
  "AstroJS": "#FF5D01",
  "BASH": "#4EAA25",
  "C++": "#659AD2",
  "COBOL": "#3B6FB6",
  "CSS": "#2965F1",
  "Firebase": "#FFCA28",
  "Flutter": "#45D1FD",
  "Godot": "#478CBF",
  "HTML": "#E44D26",
  "Java": "#E76F00",
  "JavaScript": "#F7DF1E",
  "MongoDB": "#47A248",
  "NextJS": "#9aa7bd",
  "NuxtJS": "#00DC82",
  "PHP": "#777BB3",
  "PocketBase": "#0E9CA5",
  "React": "#61DAFB",
  "Rust": "#DEA584",
  "SCSS": "#CD6799",
  "SQL": "#e38d13",
  "Svelte": "#FF3E00",
  "SvelteKit": "#FF3E00",
  "Symfony": "#9aa7bd",
  "Tailwind": "#38BDF8",
  "Threlte": "#F97316",
  "TypeScript": "#3178C6"
};
var TECH_GROUPS = [
  {
    title: { fr: "Frameworks frontend", en: "Frontend frameworks" },
    items: ["Svelte", "SvelteKit", "AstroJS", "React", "NextJS", "NuxtJS"]
  },
  {
    title: { fr: "Langages", en: "Languages" },
    items: ["TypeScript", "JavaScript", "Java", "C++", "Rust", "PHP", "BASH", "COBOL"]
  },
  {
    title: { fr: "Styles & markup", en: "Styling & markup" },
    items: ["HTML", "CSS", "SCSS", "Tailwind"]
  },
  {
    title: { fr: "Backend & bases de donn\xE9es", en: "Backend & databases" },
    items: ["PocketBase", "Firebase", "Symfony", "SQL", "MongoDB"]
  },
  {
    title: { fr: "Mobile, 3D & jeux", en: "Mobile, 3D & games" },
    items: ["Flutter", "Threlte", "Godot"]
  }
];
export {
  PROJECTS,
  REVIEWS,
  TECH_COLORS,
  TECH_GROUPS
};
