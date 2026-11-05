import { text, type Localized } from "../text";

export const common = {
    "title": text("Thomas Gysemans · Développeur et designer freelance", "Thomas Gysemans · Freelance developer and designer"),
    "details": text("Détails", "Details"),
    "solo": text("Solo"),
    "teamof": text("Équipe de", "Team of"),
    "previous": text("Précédent", "Previous"),
    "next": text("Suivant", "Next"),
    "newwindow": text("nouvelle fenêtre", "new window"),
    "skiptocontent": text("Aller au contenu principal", "Skip to main content"),
    "openmenu": text("Ouvrir le menu", "Open the menu"),
    "closemenu": text("Fermer le menu", "Close the menu"),
    "pausemotion": text("Mettre en pause les animations", "Pause the animations"),
    "resumemotion": text("Reprendre les animations", "Resume the animations"),
    "copyaddress": text("Copier l'adresse mail", "Copy the email address"),
    "copied": text("Adresse copiée", "Address copied"),
    "copyfailed": text("Copie impossible, l'adresse est sélectionnée", "Could not copy, the address is selected"),
    "malt": text("Profil Malt", "Malt profile"),
} satisfies Record<string, Localized>;
