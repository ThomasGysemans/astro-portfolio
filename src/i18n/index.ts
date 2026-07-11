// Entry point of the i18n module.
// Note for non-Astro contexts (data files, plain scripts): import from
// "@i18n/text" or "@i18n/config" directly — this index re-exports the
// path helpers, which depend on the "astro:i18n" virtual module.
import { common } from "./translations/common";
import { nav } from "./translations/nav";
import { home } from "./translations/home";
import { carousel } from "./translations/carousel";
import { projects } from "./translations/projects";
import { detail } from "./translations/detail";
import { showcase } from "./translations/showcase";
import { freelance } from "./translations/freelance";
import { footer, error } from "./translations/footer";

const trans = {
    common,
    nav,
    home,
    carousel,
    projects,
    detail,
    showcase,
    freelance,
    footer,
    error,
};

export default trans;
export { trans };
export { techSkills, schoolSkills } from "./translations/skills";
export { text, type Localized } from "./text";
export { LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from "./config";
export { stripLocale, localeOfPath, pathInLocale, alternateLinks } from "./paths";
