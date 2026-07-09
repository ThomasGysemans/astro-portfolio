// Models of the portfolio, as consumed by the pages.
// They are built from the PocketBase records by the functions of this folder.
import type { Localized } from "@i18n/text";

export type { Localized };

export type ProjectContext = "personal" | "school" | "professional";

export type ProjectCategory = "web" | "games" | "apps" | "languages" | "challenges" | "other";

// Values of the `type` select of the `projects` collection.
export type ProjectTypeId =
    | "website"
    | "app-and-website"
    | "video-game"
    | "mobile-app"
    | "programming-language"
    | "coding-challenge"
    | "database-project"
    | "open-source-project";

// Values of the `role` select of the `project_techs` collection.
export type TechRoleId =
    | "frontend"
    | "backend"
    | "framework"
    | "language"
    | "styling"
    | "app"
    | "back-office"
    | "3d"
    | "engine"
    | "database"
    | "markup"
    | "tooling";

// Values of the `group` select of the `technologies` collection.
export type TechGroupId =
    | "frontend-frameworks"
    | "languages"
    | "styling-markup"
    | "backend-databases"
    | "mobile-3d-games";

export type Technology = {
    name: string,
    color: string,
    group: TechGroupId,
};

export type ProjectTech = {
    name: string,
    color: string,
    role: TechRoleId,
};

export type Project = {
    slug: string,
    name: Localized,
    featured: boolean, // featured projects appear on the homepage and in the showcase
    carousel: boolean, // the (single) project whose pictures fill the homepage carousel
    category: ProjectCategory,
    badge?: string, // small uppercase badge on the thumbnail; derived from the category when omitted
    type: ProjectTypeId,
    year: number, // used for sorting
    date: string, // displayed date, e.g. "2023" or "2018 → 2025"
    teamSize: number, // 1 = solo
    context: ProjectContext,
    languages: App.LangCode[], // languages supported by the project itself
    thumb: string, // presentation picture URL, ~800px wide (cards)
    thumbLarge: string, // presentation picture URL, ~1200px wide (detail page)
    pictures: string[], // full-size URLs of the `pictures` files (images and videos)
    github?: string,
    link?: string,
    sub: Localized, // one-line subtitle shown on compact cards
    description: Localized, // short description shown on cards
    about: Localized, // long description shown on the detail page
    tagline: Localized, // uppercase hook shown in the carousel and the showcase
    caption: Localized, // caption of the presentation picture
    techs: ProjectTech[],
    updated: string, // record's last-modified timestamp (ISO), used for the sitemap's <lastmod>
};

export type Review = {
    quote: Localized,
    role: Localized, // role of the reviewer ("Owner", "Founder", ...)
    company: Localized, // company name and short activity
    year: number,
    rating: number, // star rating, 1 to 5
};
