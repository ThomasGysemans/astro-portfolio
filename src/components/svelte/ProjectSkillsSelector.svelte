<script lang="ts">
    export let skills: Technology[];

    let selectedSkills: Technology[] = [];

    function handleNewSkill(e: Event): void {
        const target = e.target as HTMLSelectElement;
        const value = target.value;
        if (!selectedSkills.some(s => s.name === value)) {
            selectedSkills = [...selectedSkills, skills.find(s => s.name === value)!];
        }
    }

    function removeSkill(name: string): void {
        selectedSkills = selectedSkills.filter(s => s.name !== name);
    }

    $: filteredSkills = skills.filter(a => !selectedSkills.some(b => a.name === b.name));
</script>

<input type="hidden" name="skills" value={selectedSkills.map(s => s.name).join()} />

<div class="flex flex-wrap *:mb-4 *:mr-4 my-4">
    {#each selectedSkills as skill (skill.name)}
        <div class="rounded-md px-3 py-2 flex items-center space-x-2 bg-[#EFEFEF]">
            <img src={skill.logo} alt="Logo de {skill.name}" class="w-5 h-auto object-cover">
            <em class="font-light not-italic text-primary whitespace-nowrap text-sm">{skill.name}</em>
            <button type="button" title="Retirer" aria-label="Retirer" class="text-primary opacity-50 hover:opacity-100" on:click={() => removeSkill(skill.name)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-x">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <path d="m15 9-6 6"/>
                    <path d="m9 9 6 6"/>
                </svg>
            </button>
        </div>
    {/each}
    {#if filteredSkills.length > 0}
        <div class="rounded-md px-3 py-2 flex items-center space-x-2 border-2 border-primary/50">
            <select on:change={handleNewSkill} class="focus:outline-primary-light max-w-24 text-sm">
                <option value="none">Ajouter...</option>
                {#each filteredSkills as skill (skill.name)}
                    <option value={skill.name}>{skill.name}</option>
                {/each}
            </select>
        </div>
    {/if}
</div>