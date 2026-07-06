import { text, type Localized } from "../text";

export const home = {
    "herotitle": text(
        "Je crée votre projet de&nbsp;<span class='text-accent'>A</span>&nbsp;à&nbsp;<span class='text-accent'>Z</span>.",
        "I create your project from&nbsp;<span class='text-accent'>A</span>&nbsp;to&nbsp;<span class='text-accent'>Z</span>.",
    ),
    "herointro": text(
        "Je suis Thomas, <strong>développeur web & mobile</strong>, <strong>UI/UX designer</strong>, autodidacte depuis mes 13 ans. <strong>Passionné d'informatique</strong> et d'astronomie, les deux se rencontrent souvent, à commencer par cette Terre 3D interactive.",
        "I'm Thomas, <strong>web & app developer</strong>, <strong>UI/UX designer</strong>, self-taught since age 13. <strong>Passionate about computer science</strong> and astronomy, the two often meet, starting with this live 3D Earth.",
    ),
    "createproject": text("Créons votre projet", "Let's create your project"),
    "showcasemode": text("✦ Mode vitrine", "✦ Showcase mode"),
    "webdev": text("Développeur web", "Web developer"),
    "appdev": text("Développeur d'applications", "App developer"),
    "designer": text("UI/UX designer"),
    "dragtoorbit": text("Glissez pour orbiter", "Drag to orbit"),
    "earthalt": text("Terre 3D interactive", "Interactive 3D Earth"),
    "stat1num": text("10+"),
    "stat1": text("années de code en autodidacte, depuis mes 13 ans", "years of self-taught code, since age 13"),
    "stat2num": text("20"),
    "stat2": text("projets (scolaires, personnels & clients)", "projects (school, personal & client work)"),
    "stat3num": text("26"),
    "stat3": text("technologies, frameworks et outils variés que je maîtrise", "technologies, frameworks and various programming tools that I master"),
    "stat4num": text("A→Z"),
    "stat4": text("projets freelance créés de zéro et déployés", "freelance projects made from scratch and deployed"),
    "featuredprojects": text("Projet à la une", "Featured project"),
    "opentheshowcase": text("Ouvrir la vitrine ✦ →", "Open the showcase ✦ →"),
    "selectedprojects": text("Projets sélectionnés", "Selected projects"),
    "allprojectscount": text("Les {count} projets →", "All {count} projects →"),
    "aboutme": text("Un peu plus sur moi", "A bit more about me"),
    "studiestitle": text("🎓 Études", "🎓 Studies"),
    "studies": text(
        "Principalement autodidacte, mais mes études à l'IUT A (Villeneuve-d'Ascq) ont affûté mon travail en équipe et mes compétences en bases de données et en SQL.",
        "Mostly self-taught, but my studies in France sharpened my teamwork and my database and SQL skills.",
    ),
    "experiencetitle": text("💼 Expérience", "💼 Experience"),
    "experience": text(
        "Des stages chez Kimple et Tabuléo, puis une alternance d'un an, en contribuant à « Quizéo » et à sa refonte.",
        "Internships at Kimple and Tabuléo, then a year-long apprenticeship, contributing to and redesigning “Quizéo”.",
    ),
    "freelancetitle": text("🚀 Freelance"),
    "freelance": text(
        "Le bouche-à-oreille m'a apporté des sites clients livrés de A à Z, seul, dans des délais précis.",
        "Word of mouth brought me client sites delivered A to Z, solo, on precise deadlines.",
    ),
    "teamskillstitle": text("🤝 Esprit d'équipe", "🤝 Team skills"),
    "teamskills": text(
        "Formé à la <strong>méthode Agile</strong> pendant mes études ; à l'aise dans les grandes équipes comme dans les petites structures.",
        "<strong>Agile training</strong> during my studies; comfortable in both large teams and small adapted setups.",
    ),
} satisfies Record<string, Localized>;
