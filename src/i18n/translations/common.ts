import { text, type Localized } from "../text";

export const common = {
    "title": text("Portfolio de Thomas Gysemans", "Portfolio of Thomas Gysemans"),
    "contact": text("Contact"),
    "contactme": text("Me contacter", "Contact me"),
    "details": text("Détails", "Details"),
    "seemore": text("Voir plus", "See more"),
    "solo": text("Solo"),
    "teamof": text("Équipe de", "Team of"),
    "previous": text("Précédent", "Previous"),
    "next": text("Suivant", "Next"),
    "mygithubaccount": text("Mon compte GitHub", "My GitHub account"),
    "mylinkedinaccount": text("Mon compte LinkedIn", "My LinkedIn account"),
    "mymaltprofile": text("Mon profil Malt", "My Malt profile"),
    "blackhole": text("Trou noir", "Black hole"),
    "availableforfreelance": text("DISPONIBLE EN FREELANCE", "AVAILABLE FOR FREELANCE"),
    "switchtheme": text("Changer de thème", "Switch color theme"),
    "openmenu": text("Ouvrir le menu", "Open menu"),
    "closemenu": text("Fermer le menu", "Close menu"),
    "menu": text("Menu"),
    "newwindow": text("nouvelle fenêtre", "new window"),
    "skiptocontent": text("Aller au contenu principal", "Skip to main content"),
} satisfies Record<string, Localized>;
