<script>
    import { faCopy, faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
    import { beforeUpdate, createEventDispatcher, onMount } from "svelte";
    import Fa from "svelte-fa";

    export let rowData = {};

    /**
     * Data mapping object used to allow any data set to render in the preconfigured setup regardless of naming
     * @type {Object}
     */
    export let rowDataMappingOverride = {};

    /**
     * The default row data mapping. Overridden by rowDataMappingOverride key by key
     * @type {Object}
     */
    let rowDataMapping = {
        rowTitle: "rowTitle",
    };

    export let rowActions = [];
    export let clickableRow = true;
    export let showLoadingState = false;

    // Used to style rows according to where they are in the list
    // e.g. dropup/down based on proximity to end of list
    export let rowIndex; // E.g. 0,1,2,3
    export let listLength; // E.g 10

    let configuredActions = {
        view: {
            faIcon: faEye, // Icon to display
            backendFlag: "enableView", // Allows backend to hide action based on business logic
        },
        edit: {
            faIcon: faEdit,
            backendFlag: "enableEdit",
        },
        duplicate: {
            faIcon: faCopy,
            backendFlag: "enableDuplicate",
        },
        delete: {
            faIcon: faTrash,
            backendFlag: "enableDelete",
        },
    };

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

        rowActions.forEach((rowAction) => {
            if (!Object.keys(configuredActions).includes(rowAction.type)) {
                console.error("Unconfigured row action type provided: " + rowAction.type);
            }
        });
    };
</script>

{#if showLoadingState}
    <li
        class="relative flex w-full items-center justify-between bg-transparent py-2 px-4 hover:bg-base-200 
        {clickableRow ? 'hover:cursor-pointer' : ''}">
        {#if rowIndex !== 0}
            <span class="absolute left-0 top-0 h-[1px] w-full bg-base-200" />
        {/if}
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
        <div class="rounded pl-2">
            <div class="text-lg font-bold">
                {rowData[rowDataMapping.rowTitle]}
            </div>
        </div>

        <!-- Row Actions -->
        <div class="flex items-center justify-center">
            {#each rowActions as action}
                {#if Object.keys(configuredActions).includes(action.type)}
                    {#if configuredActions[action.type].backendFlag}
                        <button
                            class="btn btn-xs ml-1 flex-nowrap {action.btnClasses}"
                            on:click={(event) => {
                                event.stopPropagation(); // Stops the click on table row element behind it
                                dispatch("actionTriggered", { clickEvent: action.clickEvent, rowId: rowData.id });
                            }}>
                            <Fa icon={configuredActions[action.type].faIcon} size="1.1x" />

                            {#if action.hasOwnProperty("displayLabel")}
                                <span
                                    class="ml-1 {action.type === 'edit' ? 'mt-[3px]' : ''}
                            {action.type === 'delete' ? 'mt-[2px]' : ''}">
                                    {action.displayLabel}
                                </span>
                            {/if}
                        </button>
                    {/if}
                {/if}
            {/each}
        </div>
    </li>
{/if}
