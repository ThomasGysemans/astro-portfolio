import { db, UserTable } from 'astro:db';

async function seedUser(): Promise<void> {
    await db
        .insert(UserTable)
        .values([
            { email: "gysemansthomas@gmail.com", username: "ThomasG", password: "azerty" }
        ]);
}

export default async function seed() {
    await seedUser();
}