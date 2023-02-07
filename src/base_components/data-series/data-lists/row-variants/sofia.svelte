<script>
    import { beforeUpdate, createEventDispatcher } from "svelte";

    export let rowData = {};

    /**
     * @typedef rowDataMappingOverride
     * @property {string} [rowTitle]  What key is passed as the 'rowTitle' for this row
     * @property {string} [rowDescription] What key is passed as the 'rowDescription' for this row
     */
    /**
     * Data mapping object used to allow any data set to render in the pre-configured setup regardless of naming
     * @type {rowDataMappingOverride}
     * @property {string} rowDataMappingOverride.rowTitle What key is passed as the 'rowTitle' for this row
     * @property {string} rowDataMappingOverride.rowDescription What key is passed as the 'rowDescription' for this row
     */
    export let rowDataMappingOverride = {
        rowTitle: "rowTitle",
        rowDescription: "rowDescription",
    };

    /**
     * The default row data mapping. Overridden by rowDataMappingOverride key by key
     * @type {Object}
     */
    let rowDataMapping = {
        rowTitle: "rowTitle",
        rowDescription: "rowDescription",
    };

    export let clickableRow = true;
    export let showLoadingState = false;

    // Used to style rows according to where they are in the list
    // e.g. dropup/down based on proximity to end of list
    export let rowIndex; // E.g. 0,1,2,3
    export let listLength; // E.g 10

    const dispatch = createEventDispatcher();

    let initComplete = false;
    beforeUpdate(async () => {
        if (!initComplete) {
            initComplete = true;
            await initConfig();
        }
    });

    const initConfig = async () => {
        Object.keys(rowDataMappingOverride).forEach((defaultRowDataAttribute) => {
            if (rowDataMapping.hasOwnProperty(defaultRowDataAttribute)) {
                rowDataMapping[defaultRowDataAttribute] = rowDataMappingOverride[defaultRowDataAttribute];
            }
        });
    };

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
            <div class="w-full overflow-x-hidden overflow-ellipsis text-lg font-bold ">
                {rowData[rowDataMapping.rowTitle]}
            </div>
            <div class="w-full overflow-x-hidden overflow-ellipsis">
                {rowData[rowDataMapping.rowDescription]}
            </div>
        </div>

        <!-- Row Actions -->
        <div class="flex items-center justify-center">
            <slot {rowData} {rowActionTriggered} />
        </div>
    </li>
{/if}
