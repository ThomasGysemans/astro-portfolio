<script lang="ts">
    // Back-office editor of a project's technologies. Server-rendered by
    // Astro with the current list, then hydrated. The whole list is saved at
    // once by a normal form POST (action "save-techs"): the DOM order of the
    // rows gives each junction its 1-based position, so reordering is purely
    // client-side. Rows are reordered by drag & drop (or the keyboard, for
    // accessibility) with a flip animation.
    import { flip } from "svelte/animate";
    import { tick } from "svelte";

    type Tech = { id: string; name: string };
    type Role = { id: string; label: string };
    type IncomingTech = { id: string; technologyId: string; name: string; role: string };

    // `ref` is the junction id, or `new:<technologyId>` for a tech added in
    // this session (created server-side on save).
    type Row = { ref: string; technologyId: string; name: string; role: string };

    interface Props {
        techs: IncomingTech[];
        availableTechs: Tech[];
        roles: Role[];
    }

    const { techs, availableTechs, roles }: Props = $props();

    let rows = $state<Row[]>(
        techs.map(t => ({ ref: t.id, technologyId: t.technologyId, name: t.name, role: t.role })),
    );
    // Junction ids to delete server-side (existing rows removed here).
    let removed = $state<string[]>([]);
    // Techs not currently in the list, offered by the "add" select.
    let available = $state<Tech[]>([...availableTechs]);

    let addTechId = $state(availableTechs[0]?.id ?? "");
    let addRole = $state(roles[0]?.id ?? "");

    let dragIndex = $state<number | null>(null);
    // Grip handles, keyed by row ref, so the keyboard reorder can restore
    // focus on the moved row (relocating a focused node drops its focus).
    const grips: Record<string, HTMLElement> = {};

    function moveRow(from: number, to: number): void {
        if (to < 0 || to >= rows.length || from === to) return;
        const [moved] = rows.splice(from, 1);
        rows.splice(to, 0, moved);
    }

    function handleDragStart(event: DragEvent, i: number): void {
        dragIndex = i;
        const li = (event.currentTarget as HTMLElement).closest("li");
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", String(i));
            // Drag the whole row, not just the grip handle.
            if (li) event.dataTransfer.setDragImage(li, 20, 20);
        }
    }

    function handleDragOver(event: DragEvent, i: number): void {
        if (dragIndex === null) return;
        event.preventDefault();
        if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        if (dragIndex === i) return;

        // Only move once the cursor has crossed the middle of the hovered row.
        // The half of that row nearest the dragged item is a dead zone: without
        // it, the row displaced by a swap lands back under the cursor and
        // triggers the reverse swap, oscillating indefinitely.
        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
        const inBottomHalf = event.clientY - rect.top > rect.height / 2;
        const to = i > dragIndex ? (inBottomHalf ? i : i - 1) : inBottomHalf ? i + 1 : i;
        if (to !== dragIndex) {
            moveRow(dragIndex, to);
            dragIndex = to;
        }
    }

    async function handleKey(event: KeyboardEvent, i: number): Promise<void> {
        const to = event.key === "ArrowUp" ? i - 1 : event.key === "ArrowDown" ? i + 1 : i;
        if (to === i) return;
        event.preventDefault();
        if (to < 0 || to >= rows.length) return;
        const ref = rows[i].ref;
        moveRow(i, to);
        // The moved row keeps the same node but changes position; restore its
        // focus once Svelte has applied the reorder so the arrows can be chained.
        await tick();
        grips[ref]?.focus();
    }

    function removeRow(i: number): void {
        const [row] = rows.splice(i, 1);
        // Existing junctions are deleted server-side; rows added in this
        // session just disappear.
        if (!row.ref.startsWith("new:")) removed.push(row.ref);
        available.push({ id: row.technologyId, name: row.name });
        available.sort((a, b) => a.name.localeCompare(b.name));
        if (!available.some(t => t.id === addTechId)) addTechId = available[0]?.id ?? "";
    }

    function addRow(): void {
        const tech = available.find(t => t.id === addTechId);
        if (!tech) return;
        rows.push({ ref: `new:${tech.id}`, technologyId: tech.id, name: tech.name, role: addRole });
        available = available.filter(t => t.id !== tech.id);
        addTechId = available[0]?.id ?? "";
    }
</script>

<form method="POST" class="flex flex-col gap-4">
    <input type="hidden" name="action" value="save-techs" />
    {#each removed as ref (ref)}
        <input type="hidden" name="tech_removed" value={ref} />
    {/each}

    <ul class="flex flex-col gap-2.5 list-none p-0 m-0">
        {#each rows as row, i (row.ref)}
            <li
                class="adm-row"
                class:dragging={dragIndex === i}
                animate:flip={{ duration: 200 }}
                ondragover={e => handleDragOver(e, i)}
            >
                <input type="hidden" name="tech_ref" value={row.ref} />
                <span
                    bind:this={grips[row.ref]}
                    class="adm-grip"
                    role="button"
                    tabindex="0"
                    draggable="true"
                    aria-label={`Déplacer ${row.name}`}
                    title="Glisser pour réordonner (ou flèches ↑ ↓)"
                    ondragstart={e => handleDragStart(e, i)}
                    ondragend={() => (dragIndex = null)}
                    onkeydown={e => handleKey(e, i)}
                >⠿</span>
                <span class="adm-tech-name font-bold text-heading text-[14px] flex-1 min-w-30">{row.name}</span>
                <select name="tech_role" bind:value={row.role} class="adm-input w-auto!" aria-label={`Rôle de ${row.name}`}>
                    {#each roles as role (role.id)}
                        <option value={role.id}>{role.label}</option>
                    {/each}
                </select>
                <button
                    type="button"
                    class="adm-btn-danger px-2.5!"
                    aria-label={`Retirer ${row.name}`}
                    onclick={() => removeRow(i)}
                >✕</button>
            </li>
        {/each}
    </ul>

    <div class="adm-row">
        <select bind:value={addTechId} class="adm-input w-auto!" aria-label="Technologie à ajouter" disabled={available.length === 0}>
            {#each available as tech (tech.id)}
                <option value={tech.id}>{tech.name}</option>
            {/each}
        </select>
        <select bind:value={addRole} class="adm-input w-auto!" aria-label="Rôle de la technologie à ajouter">
            {#each roles as role (role.id)}
                <option value={role.id}>{role.label}</option>
            {/each}
        </select>
        <button type="button" class="adm-btn-outline" onclick={addRow} disabled={available.length === 0}>Ajouter</button>
        <span class="flex-1"></span>
        <button type="submit" class="adm-btn">Enregistrer les technologies</button>
    </div>
</form>

<style>
    .adm-grip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        font-size: 1.1rem;
        line-height: 1;
        color: var(--muted);
        cursor: grab;
        user-select: none;
        border-radius: 0.5rem;
        transition: color 0.2s, background-color 0.2s;
    }

    .adm-grip:hover,
    .adm-grip:focus-visible {
        color: var(--accent);
        background-color: color-mix(in srgb, var(--accent) 12%, transparent);
        outline: none;
    }

    .adm-grip:active {
        cursor: grabbing;
    }

    li.dragging {
        opacity: 0.55;
        border-color: var(--accent);
    }
</style>
