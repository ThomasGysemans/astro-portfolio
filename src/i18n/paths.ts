import { getRelativeLocaleUrl } from "astro:i18n";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

// "/en/projects/ysa" -> "/projects/ysa"; "/projects" -> "/projects".
export function stripLocale(pathname: string): string {
    const normalized = pathname.replace(/\/{2,}/g, "/");
    for (const locale of LOCALES) {
        if (locale === DEFAULT_LOCALE) continue;
        if (normalized === `/${locale}`) return "/";
        if (normalized.startsWith(`/${locale}/`)) return normalized.substring(locale.length + 1);
    }
    return normalized;
}

// The locale a pathname belongs to, based on its prefix.
export function localeOfPath(pathname: string): Locale {
    const normalized = pathname.replace(/\/{2,}/g, "/");
    for (const locale of LOCALES) {
        if (locale === DEFAULT_LOCALE) continue;
        if (normalized === `/${locale}` || normalized.startsWith(`/${locale}/`)) return locale;
    }
    return DEFAULT_LOCALE;
}

// The same page in another locale: "/en/projects" + "fr" -> "/projects".
export function pathInLocale(locale: Locale, pathname: string): string {
    return getRelativeLocaleUrl(locale, stripLocale(pathname));
}

// The hreflang alternate links of a page, plus x-default pointing to the default locale.
export function alternateLinks(pathname: string, domain: string): { hreflang: string, href: string }[] {
    const links = LOCALES.map(locale => ({
        hreflang: locale as string,
        href: `${domain}${pathInLocale(locale, pathname)}`,
    }));
    links.push({
        hreflang: "x-default",
        href: `${domain}${pathInLocale(DEFAULT_LOCALE, pathname)}`,
    });
    return links;
}
