import { text, type Localized } from "../text";

export const projects = {
    "title": text("Réalisations de Thomas Gysemans", "Work of Thomas Gysemans"),
    "description": text(
        "Tous mes projets (scolaires, personnels et freelance) ainsi que mes compétences techniques.",
        "All my projects (school, personal and freelance work) along with my tech skills.",
    ),
    "eyebrow": text("Réalisations", "Work"),
    "allmyprojects": text("Tous mes projets", "All my projects"),
    "featuredtitle": text("Mes projets à la une", "My featured projects"),
    "subtitle": text(
        "{count} projets · {from} → {to} · scolaire, personnel et freelance",
        "{count} projects · {from} → {to} · school, personal and freelance work",
    ),
    "filters": text("Filtrer par catégorie", "Filter by category"),
    "featuredpill": text("À la une", "Featured"),
    "allpill": text("Tous", "All"),
    "searchplaceholder": text("Rechercher un projet…", "Search a project…"),
    "sortnewest": text("Récents d'abord", "Newest first"),
    "sortoldest": text("Anciens d'abord", "Oldest first"),
    // {order}: the current order (the punctuation differs by language)
    "sortlabel": text("Trier par année : {order}", "Sort by year: {order}"),
    "result": text("résultat", "result"),
    "results": text("résultats", "results"),
    "builtwith": text("Projets réalisés avec", "Showing projects built with"),
    "clicktofilter": text(
        "cliquez sur une technologie pour filtrer, sur la croix pour effacer",
        "click any technology to filter, the cross to clear",
    ),
    "removetechfilter": text("Retirer le filtre", "Clear the filter"),
    "noprojectfound": text(
        "Aucun projet ne correspond. Essayez un autre filtre ou terme de recherche.",
        "No project matches. Try another filter or search term.",
    ),
    "showallprojects": text("Afficher tous les projets", "Show all projects"),
    "skillseyebrow": text("Compétences", "Skills"),
    "mytechskills": text("Mes compétences techniques", "My tech skills"),
    "techskillsintro": text(
        "Des technologies que j'ai utilisées dans de vrais projets et pour lesquelles j'ai une solide expérience : cliquez sur l'une d'elles pour voir les projets correspondants.",
        "Technologies I have used in real projects and for which I have solid experience: click any of them to see the matching projects.",
    ),
    "technologies": text("technologies"),
    "project": text("projet", "project"),
    "projectcount": text("projets", "projects"),
    "educationtitle": text("Mon parcours scolaire", "My educational background"),
    "education": text(
        "J'ai obtenu mon BAC Général au lycée Sacré-Cœur de Tourcoing avec mention très bien, puis j'ai continué à l'IUT de Villeneuve-d'Ascq où j'ai obtenu mon DUT Informatique. J'ai réalisé toute ma troisième année en alternance chez Tabuléo, en mettant mes compétences en pratique sur la plateforme éducative Quizéo, et j'ai obtenu mon BUT.",
        "I obtained my high-school diploma with highest honors (\"mention très bien\"), then continued my studies in France, in Lille, where I earned my DUT in Computer Science. I spent my whole third year as an apprentice at Tabuléo, putting my skills into practice on the educational platform Quizéo, and graduated with a BUT.",
    ),
    "teamskillstitle": text("Compétences d'équipe et méthode", "Team and method skills"),
    "showcasecta": text("Mode vitrine", "Showcase mode"),
    "showcasehint": text("Une visite immersive de mes projets à la une", "An immersive tour of my featured projects"),
} satisfies Record<string, Localized>;
