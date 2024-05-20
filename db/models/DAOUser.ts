import type { AstroCookies } from "astro";
import { and, db, eq, UserTable } from "astro:db";

export interface IUser {
    email: string;
    username: string;
}

export class DAOUser {
    public static async find(email: string, password: string): Promise<IUser | undefined> {
        return (await db
            .select({
                email: UserTable.email,
                username: UserTable.username
            })
            .from(UserTable)
            .where(and(
                eq(UserTable.email, email),
                eq(UserTable.password, password),
            )).execute())[0];
    }

    public static async isConnected(cookies: AstroCookies): Promise<boolean> {
        const email = (cookies.get("user")?.value);
        if (email === undefined) {
            return false;
        }
        const connected = (
            await db
                .select({ email: UserTable.email })
                .from(UserTable)
                .where(eq(UserTable.email, email))
        ).length === 1;
        if (!connected) {
            // The cookie isn't valid, so just delete it.
            cookies.delete("user");
        }
        return connected;
    }
}