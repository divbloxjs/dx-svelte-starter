<script>
    import { beforeUpdate, createEventDispatcher } from "svelte";

    /**
     * @typedef rowData
     * @property {string} rowTitle Title of this simple row
     */
    /**
     * Row data object to display
     * @type {rowData}
     * @property {string} rowData.rowTitle
     */
    export let rowData = {
        rowTitle: "Placeholder title",
    };

    /**
     * Data mapping object used to allow any data set to render in the preconfigured setup regardless of naming
     * @type {Object}
     * @property {string} rowDataMappingOverride.rowTitle What key is passed as the 'rowTitle' for this row
     */
    export let rowDataMappingOverride = {};

    /**
     * The default row data mapping. Overridden by rowDataMappingOverride key by key
     * @type {Object}
     */
    let rowDataMapping = {
        rowTitle: "rowTitle",
    };

    /**
     *  Whether or not the render to row as clickable or not
     * @type {boolean}
     */
    export let clickableRow = true;

    /**
     * Whether or not to load the row in a loading state
     * @type {boolean}
     */
    export let showLoadingState = false;

    // Used to style rows according to where they are in the list
    // e.g. dropup/down based on proximity to end of list

    /**
     * The index of the current row in the list
     * @type {number}
     */
    export let rowIndex; // E.g. 0,1,2,3

    /**
     * The length of the currently rendered list
     * @type {number}
     */
    export let listLength; // E.g 10

    const dispatch = createEventDispatcher();

    let initComplete = false;
    beforeUpdate(async () => {
        if (!initComplete) {
            initComplete = true;
            Object.keys(rowDataMappingOverride).forEach((defaultRowDataAttribute) => {
                if (rowDataMapping.hasOwnProperty(defaultRowDataAttribute)) {
                    rowDataMapping[defaultRowDataAttribute] = rowDataMappingOverride[defaultRowDataAttribute];
                }
            });
        }
    });

    /**
     * Handle row actions and bubble up event
     * @param event
     */
    const rowActionTriggered = (event) => {
        dispatch("actionTriggered", event.detail);
    };
</script>

{#if showLoadingState}
    <li
        class="relative flex w-full items-center justify-between bg-transparent py-2 px-4 hover:bg-base-200 
        {clickableRow ? 'hover:cursor-pointer' : ''}">
        <!-- Divider between rows -->
        {#if rowIndex !== 0}
            <span class="absolute left-0 top-0 h-[1px] w-full bg-base-200" />
        {/if}

        <!-- Row Data Placeholder Content -->
        <div class="rounded pl-2">
            <div class="w-24 animate-pulse rounded-lg bg-base-200 text-lg font-bold text-transparent">Loading...</div>
            <div
                class="mt-2 w-40 max-w-[18ch] animate-pulse overflow-x-hidden overflow-ellipsis
                        rounded-lg bg-base-200 text-transparent">
                Loading..................................
            </div>
        </div>
    </li>
{:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <li
        class="relative flex items-center justify-between py-2 px-4 hover:bg-base-200
        sm:py-4 {clickableRow ? 'hover:cursor-pointer' : ''}"
        on:click={() => {
            if (clickableRow) {
                dispatch("actionTriggered", { clickEvent: "row_clicked", rowId: rowData.id });
            }
        }}>
        <!-- Divider between rows -->
        {#if rowIndex !== 0}
            <span class="absolute left-0 top-0 h-[1px] w-full bg-base-200" />
        {/if}

        <!-- Row Data Content -->
        <div class="overflow-x-hidden rounded pl-2">
            <div class="w-full overflow-x-hidden overflow-ellipsis text-lg font-bold">
                {rowData[rowDataMapping.rowTitle]}
            </div>
        </div>

        <!-- Row Actions -->
        <div class="flex items-center justify-center">
            <slot {rowData} {rowActionTriggered} />
        </div>
    </li>
{/if}
