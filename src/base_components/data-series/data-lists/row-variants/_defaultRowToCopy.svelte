<script>
    import { beforeUpdate, createEventDispatcher } from "svelte";
    import { errorAlert } from "$src/lib/js/utilities/swalMixins.utilities.js";
    throw new Error(
        "This component should not be used as is! Copy it out of base_components, customise it and remove this line. Refer to the README.md"
    );

    export let rowData = {};

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

    const dispatch = createEventDispatcher();

    let initComplete = false;
    beforeUpdate(async () => {
        if (!initComplete) {
            initComplete = true;
            if (showLoadingState) {
                return;
            }
        }
    });

    /**
     * Handle row actions and bubble up event
     * Perform some action based on event, and if needed, bubble up the event on success/failure
     * Works with events fire from the 'dataListRowAction' component
     * i.e. "view_clicked", "edit_clicked", "duplicate_clicked", "delete_clicked"
     * @param event
     */
    const rowActionTriggered = async (event) => {
        switch (event.detail.clickEvent) {
            case "action_clicked":
                await handleAction(event.detail);
                break;
        }
    };

    const handleAction = async (eventDetail) => {
        const result = await errorAlert.fire({
            html: "Are you sure?",
            confirmButtonText: "OK",
            timer: 0,
        });

        if (!result.isConfirmed) {
            return;
        }

        if (await soHandlerFunction(rowData.id, rowData.propertyName)) {
            dispatch("actionTriggered", eventDetail);
        }
    };

    // If this is CRUD operations, this function may be abstracted to a entityName.js file
    const soHandlerFunction = async (id, other) => {
        return true;
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
        class="relative flex flex-col items-start justify-between py-2 px-4 hover:bg-base-200
        {clickableRow ? 'hover:cursor-pointer' : ''}"
        on:click={() => {
            if (clickableRow) {
                dispatch("actionTriggered", {
                    clickEvent: "row_clicked",
                    rowId: rowData.id,
                    projectId: rowData.project.id,
                });
            }
        }}>
        <!-- Divider between rows -->
        {#if rowIndex !== 0}
            <span class="absolute left-0 top-0 h-[1px] w-full bg-base-200" />
        {/if}

        <!-- Row Data Content -->
        <div class="w-full overflow-x-hidden rounded">
            <div class="mb-2 w-full overflow-x-hidden overflow-ellipsis pr-3 text-sm font-bold">
                {rowData.propertyName}
            </div>
        </div>

        <!-- Row Actions -->
        <div class="absolute top-2 right-1">
            <slot {rowData} {rowActionTriggered} />
        </div>
    </li>
{/if}
