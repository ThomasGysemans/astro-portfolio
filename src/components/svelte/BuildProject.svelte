<script lang="ts">
    import type { FullProject } from "@db/models/DAOProject.ts";
    import type { Technology } from "@db/models/DAOSkills.ts";
    import type { ProjectType } from "@lib/ProjectType.ts";
    import { ProjectNature } from "@lib/ProjectNature.ts";
    import ProjectSkillsSelector from "@components/svelte/ProjectSkillsSelector.svelte";
    import ToggleIconInput from "@components/svelte/ToggleIconInput.svelte";
    import ToggleSelect from "@components/svelte/ToggleSelect.svelte";
    import ToggleInput from "@components/svelte/ToggleInput.svelte";
    import DropZone from "@components/svelte/DropZone.svelte";
    import Icon from "@iconify/svelte";

    export let project: FullProject | null;
    export let skills: Technology[];
    export let projectType: ProjectType;
    export let presentationPicturePreview: string | undefined;
    export let handleImport: (e: CustomEvent<{files: File[]}>) => Promise<void>;
</script>

<div class="bg-white rounded-md border-2 border-primary/50 min-w-[300px] max-w-[360px]">
    <div class="w-full h-52 relative p-2">
        <div class="relative flex items-center justify-center w-full h-full rounded-[4px]">
            <DropZone name="presentationPicture" previewUrl={presentationPicturePreview} on:drop={handleImport} className="w-full h-full object-cover">
                <Icon icon="lucide:image" class="text-5xl opacity-75" />
            </DropZone>
            <div class="absolute top-5 right-5 rounded-full w-8 h-8 flex justify-center items-center {projectType.color}">
                <Icon icon={`lucide:${projectType.icon}`} class="text-lg text-white" />
            </div>
        </div>
    </div>
    <div class="py-4 px-6 h-[calc(100%-240px)] flex flex-col">
        <ToggleInput
            textarea
            name="name"
            initialValue={project?.name ?? "Project's name"}
            className="underline text-primary text-xl font-bold"
            tagName="strong"
        />
        <div class="w-full space-y-6">
            <ToggleInput
                textarea
                name="summary"
                initialValue={project?.summary ?? "Project's summary"}
                className="text-primary text-sm leading-8 font-light"
                tagName="span"
            />
        </div>
        <ProjectSkillsSelector skills={skills} />
        <div class="flex justify-between !mt-auto">
            <ToggleIconInput initialValue={project?.teamMembers} name="teamMembers">
                <Icon icon="lucide:circle-user-round" slot="solo" />
                <Icon icon="lucide:users" slot="team" />
            </ToggleIconInput>
            <ToggleSelect initialValue={project?.nature} name="nature">
                <Icon icon={`lucide:${ProjectNature.PROFESSIONAL.icon}`} slot="pro" />
                <Icon icon={`lucide:${ProjectNature.SCHOOL.icon}`} slot="school" />
                <Icon icon={`lucide:${ProjectNature.PERSONAL.icon}`} slot="personal" />
            </ToggleSelect>
            <span class="text-primary/50 flex items-center text-sm">
                <Icon icon="lucide:calendar" class="mr-2" />
                <ToggleInput
                    name="date"
                    initialValue={project?.date ?? new Date().getFullYear().toString()}
                    tagName="span"
                    className="relative top-[2px]"
                    width="w-12"
                />
            </span>
        </div>
    </div>
</div>
