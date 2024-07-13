import type { IUser } from "@db/models/DAOUser.ts";
import type { Technology } from "@db/models/DAOSkills.ts";

declare global {
    type FormResult = {
        error?: FormError;
        user: IUser;
    };

    type FormError = true | string;
}
