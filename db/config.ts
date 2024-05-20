import { column, defineDb, defineTable } from 'astro:db';

const ProjectTable = defineTable({
    columns: {
        name: column.text(),
        slug: column.text({ primaryKey: true }),
        description: column.text(),
        summary: column.text(),
        presentation_picture: column.number({ default: 0, optional: true }),
        team_members: column.number(),
        nature: column.text(),
        type: column.text(),
        date: column.text(),
        github: column.text({ optional: true }),
        link: column.text({ optional: true }),
        updatedAt: column.date(),
        showcase: column.boolean(),
    }
});

const TechnologyTable = defineTable({
    columns: {
        name: column.text({ primaryKey: true }),
        logo: column.text(),
        loved: column.boolean(),
    },
});

const PicturesTable = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        project: column.text({ references: () => ProjectTable.columns.slug }),
        picture: column.text(),
    },
    indexes: [
        { on: ["project", "picture"], unique: true },
    ]
});

const LanguagesTable = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        project: column.text({ references: () => ProjectTable.columns.slug }),
        language: column.text(),
    },
    indexes: [
        { on: ["project", "language"], unique: true },
    ]
});

const ProjectTechnologiesTable = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        project: column.text({ references: () => ProjectTable.columns.slug }),
        technology: column.text({ references: () => TechnologyTable.columns.name }),
    },
    indexes: [
        { on: ["project", "technology"], unique: true },
    ],
});

const UserTable = defineTable({
    columns: {
        email: column.text({ primaryKey: true, }),
        username: column.text(),
        password: column.text(),
    },
});

// https://astro.build/db/config
export default defineDb({
    tables: {
        ProjectTable,
        PicturesTable,
        LanguagesTable,
        TechnologyTable,
        ProjectTechnologiesTable,
        UserTable,
    }
});