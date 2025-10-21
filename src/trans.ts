type Text = {
    fr: string,
    en: string,
}

const trans = {
    "common": {
        "title": text("Portfolio de Thomas Gysemans", "Portfolio of Thomas Gysemans"),
        "knowmore": text("En savoir plus", "Learn more"),
        "contact": text("Contact"),
        "status": text("Statut", "Status"),
        "mygithubaccount": text("Mon compte GitHub", "My GitHub account"),
        "mylinkedinaccount": text("Mon compte LinkedIn", "My LinkedIn account"),
        "githubrepo": text("Repo GitHub", "GitHub repo"),
        "playgame": text("Jouer au jeu", "Play the game"),
        "back": text("Retour", "Back"),
        "logo": text("Logo de ScienceSky.fr", "Logo of ScienceSky.fr"),
        "quit": text("Quitter", "Leave"),
        "previous": text("Précédent", "Previous"),
        "next": text("Suivant", "Next"),
        "all": text("Tous", "All"),
        "allFeminine": text("Toutes", "All"),
        "noFilter": text("Aucun tri", "No filter"),
        "mostRecent": text("Plus récents", "Newest"),
        "mostOld": text("Plus anciens", "Oldest"),
        "blackhole": text("Trou noir", "Black hole"),
    },
    "homepage": {
        "iam": text("Je suis...", "I am..."),
        "webdev": text("Développeur web", "Web developer"),
        "appdev": text("Développeur d'applications", "Developer of mobile applications"),
        "designer": text("UI/UX Designer"),
        "recentprojects": text("Mes projets récents", "My recent projects"),
        "aboutme": text("Quelques infos de<br>plus sur moi...", "Some additional<br>information on me..."),
        "mystudies": text("Mes études", "My studies"),
        "studies": text("J’ai appris énormément en autodidacte mais mes études à l’IUT A de Villeneuve-d’Ascq m’ont appris beaucoup sur le travail en équipe et ont énormément renforcé mes compétences en ce qui concerne les bases de données et <a href='https://sql.sh/' target='_blank' class='underline'>SQL</a>.", "I learned a lot on my own, but my studies at IUT A in Lille taught me a lot about teamwork and greatly strengthened my skills in databases and <a href='https://sql.sh/' target='_blank' class='underline'>SQL</a>."),
        "myproxp": text("Mon expérience professionelle", "My professional experience"),
        "proxp": text("J’ai suivi un stage d’une semaine à <a href='https://www.kimpleapp.com/' target='_blank' class='underline'>Kimple</a> lors de mon année de Seconde durant laquelle j’ai re-créé “Flappy Bird” pour le web. J’ai également suivi un stage de 3 mois chez <a href='https://www.tabuleo.com/' target='_blank' class='underline'>Tabuléo</a> où j’ai contribué au re-design de leur projet “Quizéo”. J'ai fait une alternance chez eux pendant plus d'un an.", "I did a one-week internship at <a href='https://www.kimpleapp.com/' target='_blank' class='underline'>Kimple</a> during my second year, during which I recreated “Flappy Bird” for the web. I also started an internship in April 2024 at <a href='https://www.tabuleo.com/' target='_blank' class='underline'>Tabuléo</a> where I contributed to the redesign of their “Quizéo” project. I worked there as an intern for over a year."),
        "myfreelance": text("Ma freelance", "My freelance"),
        "freelance": text("Grâce au bouche-à-oreille, des entrepreneurs m’ont contacté pour que je leur crée un site web d’entreprise. Cela m’a appris beaucoup car j’ai eu la chance de réaliser des projets clients de A à Z, seul et en respectant des délais précis.", "Through word of mouth, entrepreneurs have contacted me to create a business website for them. This has taught me a lot because I have had to complete client projects from A to Z, alone and within precise deadlines."),
        "myteamskills": text("Mes compétences d'équipe", "My team skills"),
        "teamskills": text("J’ai suivi une formation sur la méthode Agile durant mes études et je suis capable de travailler dans une grande équipe. Mon stage chez Tabuléo m’a également appris à travailler dans une petite équipe avec une méthode plus adaptée.", "I followed training on the Agile method during my studies and I am able to work in a large team. My internship at Tabuléo also taught me how to work in a small team with a more adapted method."),
        "status": text("Actuellement développeur indépendant disponible pour donner vie à vos projets.", "Currently working as a freelance developer. I'm available to make your projects come to life."),
        "aboutthissite": text("Concernant ce site", "About this website"),
        "thissite": text("Ce site a été réalisé avec <a href='https://astro.build/' target='_blank'>Astro</a>, <a href='https://svelte.dev/' target='_blank'>Svelte</a> et <a href='https://tailwindcss.com/' target='_blank'>Tailwind</a> (pour le frontend) ainsi que <a href='https://pocketbase.io/'>PocketBase</a> pour le backend (qui est une base de données <a href='https://github.com/tursodatabase/libsql' target='_blank'>SQLite</a>, self-hosted). Il y a un “backoffice” privé qui me permet de contrôler le contenu de mon portfolio à tout moment. Il respecte également les <a href='https://www.accede-web.com/notices/interface-riche/' target='_blank'>normes d’accessibilité</a>.", "This site was built with <a href='https://astro.build/' target='_blank'>Astro</a>, <a href='https://svelte.dev/' target='_blank'>Svelte</a> and <a href='https://tailwindcss.com/' target='_blank'>Tailwind</a> (for the frontend) and <a href='https://pocketbase.io/'>PocketBase</a> for the backend (which is a self-hosted <a href='https://github.com/tursodatabase/libsql' target='_blank'>SQLite</a> database). There is a private “backoffice” that allows me to control the content of my portfolio at all times. It also respects <a href='https://www.accede-web.com/en/guidelines/rich-interface-components/' target='_blank'>accessibility standards</a>."),
        "spacesection": text("Je suis passionné d’informatique, et grâce à ma curiosité et ma passion je me forme en autodidacte depuis mes 13 ans et je continue à consolider mes compétences tous les jours.", "I am passionate about computer programming, and thanks to my curiosity and passion I have been self-taught since I was 13 and I continue to consolidate my skills every day."),
        "spacevideo": text("Ces extraits vidéo sont tirés d’un jeu web en 3D que j’ai créé, “SpaceVisitor”, entièrement réalisé avec <a class='underline' href='https://threejs.org' target='_blank'>ThreeJS</a> et <a class='underline' href='https://threlte.xyz' target='_blank'>Threlte</a>.", "These video clips are from a 3D web game I created, “SpaceVisitor”, made entirely with <a class='underline' href='https://threejs.org' target='_blank'>ThreeJS</a> and <a class='underline' href='https://threlte.xyz' target='_blank'>Threlte</a>."),
        "dialog": text("Je suis passionné d’informatique, mais aussi d’astronomie, j’ai ainsi combiné mes passions pour réaliser ce modèle 3D interactif !", "I am passionate about computer programming, but also about astronomy, so I combined my passions to create this interactive 3D model!"),
        "showcase": text("VITRINE DE MES PROJETS", "SHOWCASE OF MY PROJECTS"),
        "infreelance": text("En freelance", "In freelance"),
    },
    "showcase": {
        "seeall": text("Voir tous mes projets", "See all of my projects"),
        "allprojects": text("Tous mes projets", "All of my projects"),
        "mybestprojects": text("Vitrine de mes<br>meilleurs projets", "Showcase of my<br>best projects"),
        "title": text("Portfolio de Thomas Gysemans - Vitrine de mes projets principaux", "Portfolio of Thomas Gysemans - Showcase of my main projects"),
    },
    "error": {
        "notfound": text("Page introuvable", "Page not found"),
    },
    "projects": {
        "title": text("Portfolio de Thomas Gysemans - Mes projets", "Portfolio of Thomas Gysemans - My projects"),
        "myprojects": text("Mes projets", "My projects"),
        "filterType": text("Filtrer selon le type", "Filter type"),
        "filterSkills": text("Filtrer selon les technologies", "Filter skills"),
        "orderDate": text("Trier selon la date", "Order based on date"),
        "searchProject": text("Rechercher un projet", "Search by name"),
        "filteringSkills": text("Vous êtes en train de filtrer les projets qui utilisent les technologies ci-dessous. Sélectionnez d'autres technologies pour affiner le filtre ci-dessus.", "You are currently filtering projects that use the technologies below. Select other technologies to refine the filter above."),
        "noProjectFound": text("Il n'y a aucun projet qui correspond aux filtres que vous avez renseignés.", "There are no projects that match the filters you have entered."),
        "myTechSkills": text("Mes compétences techniques", "My tech skills"),
        "listingSkills": text("Même si lister des technologies de cette manière n’a pas beaucoup de sens, je vous les présente comme les technologies que j’ai utilisées dans le passé et pour lesquelles j’ai un minimum d’expérience.", "Although listing technologies in this way does not make much sense, I present them to you as technologies that I have used in the past and for which I have a minimum of experience."),
        "educationalBackground": text("Mon parcours scolaire", "My educational background"),
        "school": text("J'ai obtenu mon BAC Général au lycée Sacré-cœur de Tourcoing avec mention très bien. J'ai continué mes études au sein de l'IUT de Villeneuve d'Ascq et j'y ai obtenu mon DUT Informatique. J'ai réalisé une alternance tout le long de ma troisième année, dans une entreprise appelée Tabuléo où j'ai mis en pratique mes compétences dans le contexte de la plateforme éducative <a href='https://quizeo.com' target='_blank' class='underline'>Quizéo</a>.", "I obtained my high school diploma with honors (\"mention très bien\"). I continued my studies at the IUT of Villeneuve d'Ascq and obtained another diploma (\"DUT\") in Computer Science. I did my third year as an intern in a company called Tabuléo where I put my skills into practice in the context of the educational platform <a href='https://quizeo.com' target='_blank' class='underline'>Quizéo</a>. I then graduated and obtained a diploma called \"BUT\"."),
        "presentingProject": text("Présentation du projet", "Presenting project"),
    },
    "singleProject": {
        "usedTechonologies": text("Techonologies utilisées dans ce projet", "Technologies used in this project"),
        "linkToGithub": text("Lien GitHub", "Link to the GitHub repo"),
        "illustratingProject": text("Illustration du projet", "Illustration of the project"),
        "illustrationNumber": text("Illustration numéro", "Illustration number"),
        "ofProject": text("du projet", "of project"),
        "teamOf": text("Équipe de", "Team of"),
    },
} satisfies Record<string, Record<string, Text>>;

export const techSkills = [
    text("Maîtrise des frameworks web (frontend & backend)", "Mastery of web frameworks (frontend & backend)"),
    text("Programmation orientée objet (POO)", "Object-oriented programming (POO)"),
    text("Web scraping (Puppeteer)"),
    text("Capable de créer un langage interprété ou compilé via LLVM", "Able to create interpreted or compiled language via LLVM"),
    text("Capable de gérer une base de données relationnelle ou orientée documents", "Able to manage a relational or document-oriented database"),
];

export const schoolSkills = [
    text("Autonomie dans la réalisation d'un programme", "Autonomy in carrying out a program"),
    text("Management d'équipe et travail en autonomie", "Team management and independent work"),
    text("Coopérer dans une équipe selon la méthodologie Agile", "Cooperating in a team according to the Agile methodology"),
    text("Répartition des tâches dans une équipe", "Distribution of tasks in a team"),
];

function text(fr: string, en?: string): Text {
    return {
        fr,
        en: en ?? fr,
    };
}

export default trans;