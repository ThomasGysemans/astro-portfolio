<script lang="ts">
    // Back-office editor of a project's technologies. Server-rendered by
    // Astro with the current list, then hydrated. It lives inside the main
    // project <form> and is saved with the rest of the project. It submits the
    // wanted state only — one `tech_id` + `tech_role` per row, in display order
    // — which the server reconciles with the stored junctions (see `saveTechs`),
    // so reordering is purely client-side and a retried save is harmless. Rows are reordered by drag & drop (or the keyboard,
    // for accessibility) with a flip animation. Changes that no control can
    // express (reorder, removal, addition) are reported to the back-office
    // runtime with a bubbling `adm:dirty` event.
    import { flip } from "svelte/animate";
    import { onMount, tick } from "svelte";
    import { adminIconSvg } from "@components/admin/icons";
    import { markPristine } from "@lib/admin/pristine";

    type Tech = { id: string; name: string; color: string };
    type Role = { id: string; label: string };
    type IncomingTech = { id: string; technologyId: string; name: string; color: string; role: string };

    // A tech appears at most once per project, so its id keys the row.
    type Row = { technologyId: string; name: string; color: string; role: string };

    interface Props {
        techs: IncomingTech[];
        availableTechs: Tech[];
        roles: Role[];
    }

    const { techs, availableTechs, roles }: Props = $props();

    // The three seeds below capture the props on purpose: they are the
    // server-rendered starting point of an editable list, not values to track.
    // A `$derived` would discard the admin's pending edits on any invalidation.
    // svelte-ignore state_referenced_locally
    let rows = $state<Row[]>(
        techs.map(t => ({ technologyId: t.technologyId, name: t.name, color: t.color, role: t.role })),
    );
    // Rows added in this session, flagged "nouvelle" until saved.
    // svelte-ignore state_referenced_locally
    const initialIds = new Set(techs.map(t => t.technologyId));
    // Techs not currently in the list, offered by the "add" select.
    // svelte-ignore state_referenced_locally
    let available = $state<Tech[]>([...availableTechs]);

    // svelte-ignore state_referenced_locally
    let addTechId = $state(availableTechs[0]?.id ?? "");
    // svelte-ignore state_referenced_locally
    let addRole = $state(roles[0]?.id ?? "");

    let root: HTMLElement;
    let dragIndex = $state<number | null>(null);
    // Grip handles, keyed by technology id, so the keyboard reorder can restore
    // focus on the moved row (relocating a focused node drops its focus).
    const grips: Record<string, HTMLElement> = {};

    // The roles as rendered are the starting point, not edits.
    // After a tick: the hydrated bindings write their values after onMount.
    onMount(() => {
        tick().then(() => markPristine(root));
    });

    function changed(): void {
        root?.dispatchEvent(new CustomEvent("adm:dirty", { bubbles: true }));
    }

    function moveRow(from: number, to: number): void {
        if (to < 0 || to >= rows.length || from === to) return;
        const [moved] = rows.splice(from, 1);
        rows.splice(to, 0, moved);
        changed();
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
        const key = rows[i].technologyId;
        moveRow(i, to);
        // The moved row keeps the same node but changes position; restore its
        // focus once Svelte has applied the reorder so the arrows can be chained.
        await tick();
        grips[key]?.focus();
    }

    function removeRow(i: number): void {
        // A row missing from the submitted list is deleted server-side.
        const [row] = rows.splice(i, 1);
        available.push({ id: row.technologyId, name: row.name, color: row.color });
        available.sort((a, b) => a.name.localeCompare(b.name));
        if (!available.some(t => t.id === addTechId)) addTechId = available[0]?.id ?? "";
        changed();
    }

    function addRow(): void {
        const tech = available.find(t => t.id === addTechId);
        if (!tech) return;
        rows.push({ technologyId: tech.id, name: tech.name, color: tech.color, role: addRole });
        available = available.filter(t => t.id !== tech.id);
        addTechId = available[0]?.id ?? "";
        changed();
    }
</script>

<div class="flex flex-col gap-3" data-field="techs" data-label="Technologies" bind:this={root}>
    <!-- Tells the server the editor ran, even when the list is empty. -->
    <input type="hidden" name="techs_present" value="1" />

    {#if rows.length === 0}
        <p class="adm-help">Aucune technologie pour l'instant : ajoute la première ci-dessous.</p>
    {/if}

    <ul class="adm-list" hidden={rows.length === 0}>
        {#each rows as row, i (row.technologyId)}
            <li
                class="adm-row"
                class:dragging={dragIndex === i}
                animate:flip={{ duration: 180 }}
                ondragover={e => handleDragOver(e, i)}
            >
                <input type="hidden" name="tech_id" value={row.technologyId} />
                <span
                    bind:this={grips[row.technologyId]}
                    class="adm-grip"
                    role="button"
                    tabindex="0"
                    draggable="true"
                    aria-label={`Déplacer ${row.name} (position ${i + 1} sur ${rows.length}, flèches haut et bas)`}
                    title="Glisser pour réordonner (ou flèches ↑ ↓)"
                    ondragstart={e => handleDragStart(e, i)}
                    ondragend={() => (dragIndex = null)}
                    onkeydown={e => handleKey(e, i)}
                >{@html adminIconSvg("grip")}</span>
                <span class="tech-position adm-mono" aria-hidden="true">{i + 1}</span>
                <span class="tech-dot" style:background={row.color || "var(--a-faint)"} aria-hidden="true"></span>
                <span class="tech-name">{row.name}</span>
                {#if !initialIds.has(row.technologyId)}
                    <span class="adm-badge tech-new">nouvelle</span>
                {/if}
                <select name="tech_role" bind:value={row.role} class="adm-input tech-role" aria-label={`Rôle de ${row.name}`}>
                    {#each roles as role (role.id)}
                        <option value={role.id}>{role.label}</option>
                    {/each}
                </select>
                <button
                    type="button"
                    class="adm-btn-ghost adm-btn-sm adm-btn-icon"
                    title="Retirer"
                    aria-label={`Retirer ${row.name}`}
                    onclick={() => removeRow(i)}
                >{@html adminIconSvg("x")}</button>
            </li>
        {/each}
    </ul>

    <div class="adm-addbar">
        <select bind:value={addTechId} class="adm-input tech-pick" aria-label="Technologie à ajouter" disabled={available.length === 0}>
            {#each available as tech (tech.id)}
                <option value={tech.id}>{tech.name}</option>
            {/each}
        </select>
        <select bind:value={addRole} class="adm-input tech-role" aria-label="Rôle de la technologie à ajouter">
            {#each roles as role (role.id)}
                <option value={role.id}>{role.label}</option>
            {/each}
        </select>
        <button type="button" class="adm-btn-outline" onclick={addRow} disabled={available.length === 0}>
            {@html adminIconSvg("plus")}Ajouter
        </button>
        {#if available.length === 0}
            <span class="adm-help">Toutes les technologies sont déjà dans la liste.</span>
        {/if}
    </div>
</div>

<style>
    .tech-position {
        width: 18px;
        text-align: right;
        color: var(--a-faint);
    }

    .tech-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex: none;
    }

    .tech-name {
        flex: 1;
        min-width: 120px;
        font-size: 14px;
        font-weight: 600;
        color: var(--a-text);
    }

    .tech-new {
        color: var(--a-add);
        border-color: color-mix(in srgb, var(--a-add) 45%, transparent);
    }

    .tech-role {
        width: auto;
        min-width: 130px;
        min-height: 30px;
        padding-top: 3px;
        padding-bottom: 3px;
        font-size: 13px;
    }

    .tech-pick {
        width: auto;
        min-width: 200px;
        flex: 0 1 260px;
    }
</style>
