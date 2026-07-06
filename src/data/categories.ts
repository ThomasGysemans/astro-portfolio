import type { Localized, ProjectCategory, ProjectContext, ProjectTypeId, TechRoleId } from "./models";

export type CategoryMeta = {
    label: Localized, // plural label used on the filter pills
    single: Localized, // singular label used on the compact cards ("Game · 2024")
    dot: string, // color of the dot shown on filter pills
    badge: string, // default thumbnail badge of the category
};

export const CATEGORIES: Record<ProjectCategory, CategoryMeta> = {
    web: { label: { fr: "Web", en: "Web" }, single: { fr: "Web", en: "Web" }, dot: "#566CF5", badge: "WEB" },
    games: { label: { fr: "Jeux", en: "Games" }, single: { fr: "Jeu", en: "Game" }, dot: "#EC323B", badge: "GAME" },
    apps: { label: { fr: "Apps", en: "Apps" }, single: { fr: "App", en: "App" }, dot: "#F09953", badge: "APP" },
    languages: { label: { fr: "Langages", en: "Languages" }, single: { fr: "Langage", en: "Language" }, dot: "#24D5FB", badge: "LANG" },
    challenges: { label: { fr: "Challenges", en: "Challenges" }, single: { fr: "Challenge", en: "Challenge" }, dot: "#F9DA08", badge: "CHALLENGE" },
    other: { label: { fr: "Autre", en: "Other" }, single: { fr: "Autre", en: "Other" }, dot: "#F983E7", badge: "OTHER" },
};

export const CONTEXTS: Record<ProjectContext, Localized> = {
    personal: { fr: "Personnel", en: "Personal" },
    school: { fr: "École", en: "School" },
    professional: { fr: "Professionnel", en: "Professional" },
};

// Labels of the `type` select identifiers stored in PocketBase.
export const PROJECT_TYPES: Record<ProjectTypeId, Localized> = {
    "website": { fr: "Site web", en: "Website" },
    "app-and-website": { fr: "App & site web", en: "App & website" },
    "video-game": { fr: "Jeu vidéo", en: "Video game" },
    "mobile-app": { fr: "App mobile", en: "Mobile app" },
    "programming-language": { fr: "Langage de programmation", en: "Programming language" },
    "coding-challenge": { fr: "Challenge de code", en: "Coding challenge" },
    "database-project": { fr: "Projet de base de données", en: "Database project" },
    "open-source-project": { fr: "Projet open-source", en: "Open-source project" },
};

// Labels of the `role` select identifiers stored in PocketBase.
export const TECH_ROLES: Record<TechRoleId, Localized> = {
    "frontend": { fr: "frontend", en: "frontend" },
    "backend": { fr: "backend", en: "backend" },
    "framework": { fr: "framework", en: "framework" },
    "language": { fr: "langage", en: "language" },
    "styling": { fr: "styles", en: "styling" },
    "app": { fr: "app", en: "app" },
    "back-office": { fr: "back-office", en: "back-office" },
    "3d": { fr: "3D", en: "3D" },
    "engine": { fr: "moteur", en: "engine" },
    "database": { fr: "base de données", en: "database" },
    "markup": { fr: "markup", en: "markup" },
    "tooling": { fr: "outillage", en: "tooling" },
};
