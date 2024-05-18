import { ProjectNature } from "@lib/ProjectNature.ts";
import { ProjectType } from "@lib/ProjectType.ts";

function getRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

function getRandomLetter(): string {
    const min = 'a'.charCodeAt(0);
    const max = 'z'.charCodeAt(0);
    return String.fromCharCode(getRandomNumber(min, max + 1));
}

function getRandomName(): string {
    const length = Math.random() * 25 + 1;
    let expectWord = false;
    let name = "";
    for (let i = 0; i < length; i++) {
        if (!expectWord && Math.random() < 0.2) {
            name += " ";
            expectWord = true;
        } else {
            name += getRandomLetter();
            expectWord = false;
        }
    }
    return name.trim();
}

function getRandomSkills(): Technology[] {
    return new Array(Math.ceil(Math.random() * 4)).fill({
        name: "ThreeJS",
        logo: "/logos/ThreeJS.svg",
        loved: false,
    });
}

function getRandomProjectType(): string {
    const types = [
        ProjectType.WEB,
        ProjectType.APPLICATION,
        ProjectType.SOFTWARE,
        ProjectType.LANGUAGE,
        ProjectType.GAME,
        ProjectType.CHALLENGE,
        ProjectType.OTHER,
    ];
    return types[Math.floor(Math.random() * types.length)].frenchName;
}

export function mockProject(): Project {
    const name = getRandomName();
    return {
        name: name,
        slug: name.replace(/ /g, "-"),
        description: "Un jeu 3D dans lequel le joueur vole dans le Système Solaire avec sur son passage les planètes, dont la Terre, et le Soleil.",
        summary: "Un jeu 3D dans lequel le joueur vole dans le Système Solaire avec sur son passage les planètes, dont la Terre, et le Soleil.",
        presentation_picture: 0,
        pictures: ["/exemple-space-visitor.png"],
        technologies: getRandomSkills(),
        team_members: Math.ceil(Math.random() * 20 + 1),
        nature: ProjectNature.SCHOOL,
        type: getRandomProjectType(),
        date: "202" + Math.ceil(Math.random() * 4 + 1),
    };
}

export function mockProjects(length?: number): Project[] {
    length ??= Math.ceil(Math.random() * 5 + 1);
    const projects: Project[] = [];
    for (let i = 0; i < length; i++) {
        projects.push(mockProject());
    }
    return projects;
}