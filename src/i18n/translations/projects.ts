import { text, type Localized } from "../text";

export const projects = {
    "title": text("Portfolio de Thomas Gysemans - Mes projets", "Portfolio of Thomas Gysemans - My projects"),
    "description": text(
        "Tous mes projets (scolaires, personnels et freelance) ainsi que mes compétences techniques.",
        "All my projects (school, personal and freelance work) along with my tech skills.",
    ),
    "allmyprojects": text("Tous mes projets", "All my projects"),
    "featuredtitle": text("Mes projets à la une", "My featured projects"),
    "subtitle": text(
        "{count} projets · {from} → {to} · scolaire, personnel & freelance",
        "{count} projects · {from} → {to} · school, personal & freelance work",
    ),
    "featuredpill": text("À la une", "Featured"),
    "allpill": text("Tous", "All"),
    "searchplaceholder": text("Rechercher un projet…", "Search a project…"),
    "sortnewest": text("Année : récents d'abord", "Year: newest first"),
    "sortoldest": text("Année : anciens d'abord", "Year: oldest first"),
    "result": text("résultat", "result"),
    "results": text("résultats", "results"),
    "builtwith": text("Projets réalisés avec", "Showing projects built with"),
    "clicktofilter": text(
        "cliquez sur une technologie pour filtrer, ✕ pour effacer",
        "click any technology chip to filter, ✕ to clear",
    ),
    "removetechfilter": text("Retirer le filtre", "Clear the filter"),
    "noprojectfound": text(
        "Aucun projet ne correspond. Essayez un autre filtre ou terme de recherche.",
        "No project matches. Try another filter or search term.",
    ),
    "showallprojects": text("Afficher tous les projets", "Show all projects"),
    "mytechskills": text("Mes compétences techniques", "My tech skills"),
    "techskillsintro": text(
        "Des technologies que j'ai utilisées dans de vrais projets et pour lesquelles j'ai une solide expérience : cliquez sur l'une d'elles pour voir les projets correspondants ci-dessus.",
        "Technologies I have used in real projects and for which I have solid experience: click any of them to see the matching projects above.",
    ),
    "technologies": text("technologies"),
    "project": text("projet", "project"),
    "projectcount": text("projets", "projects"),
    "educationtitle": text("🎓 Mon parcours scolaire", "🎓 My educational background"),
    "education": text(
        "J'ai obtenu mon BAC Général au lycée Sacré-Cœur de Tourcoing avec mention très bien, puis j'ai continué à l'IUT de Villeneuve-d'Ascq où j'ai obtenu mon DUT Informatique. J'ai réalisé toute ma troisième année en alternance chez Tabuléo, en mettant mes compétences en pratique sur la plateforme éducative Quizéo, et j'ai obtenu mon BUT.",
        "I obtained my high-school diploma with highest honors (\"mention très bien\"), then continued my studies in France, in Lille, where I earned my DUT in Computer Science. I spent my whole third year as an apprentice at Tabuléo, putting my skills into practice on the educational platform Quizéo, and graduated with a BUT.",
    ),
    "teamskillstitle": text("🤝 Compétences d'équipe & méthode", "🤝 Team & method skills"),
} satisfies Record<string, Localized>;
