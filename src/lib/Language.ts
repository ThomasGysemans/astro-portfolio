import { EnumUtilities } from "./Enum";

export class Language {
    public static readonly FR = new Language("FR", "french-flag");
    public static readonly EN = new Language("EN", "uk-flag");

    public constructor(
        public short: string,
        public flag: string,
    ) {}

    public static getAllLanguages(): Language[] {
        return EnumUtilities.getAllStaticInstances<Language>(Language as any);
    }

    public static getLanguage(short: string): Language | undefined {
        return EnumUtilities.getStaticInstance<Language>(short, Language as any, "short");
    }
}
