<script>
    import { beforeUpdate, createEventDispatcher } from "svelte";
    import Fa from "svelte-fa";
    import { faCopy, faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

    /**
     * @typedef rowAction
     * @property {'edit'|'view'|'duplicate'|'delete'} type Preconfigured type of action
     * @property {string} [action.btnClasses] Additional classes ot add to the action button
     * @property {string} [action.displayLabel] Display label to be shown next to the action button
     */

    /**
     * Config option for the row action
     * @type {rowAction}
     * @property {'edit'|'view'|'duplicate'|'delete'} action.type Display label to be shown next to the action button
     * @property {string} [action.btnClasses] Additional classes ot add to the action button
     * @property {string} [action.displayLabel] Display label to be shown next to the action button
     */
    export let action = {
        type: "delete",
    };

    /**
     * Row data object for specific row. Used to pass any necessary data into events triggered by the action
     * @type {Object}
     */
    export let rowData = {};
    const dispatch = createEventDispatcher();

    let initComplete = false;
    beforeUpdate(() => {
        if (!initComplete) {
            initComplete = true;
            if (!Object.keys(configuredActions).includes(action.type)) {
                console.error("Unconfigured row action type provided: " + action.type);
            }
        }
    });

    /**
     * Object defining what row actions are catered for.
     * @type {Object}
     * @property
     */
    const configuredActions = {
        view: {
            faIcon: faEye, // Icon to display
            backendFlag: "enableView", // Allows backend to hide action based on business logic
            clickEvent: "view_clicked", // event passed back up to parents a long with the row ID
            defaultBtnClasses: "text-base-content hover:text-primary",
        },
        edit: {
            faIcon: faEdit,
            backendFlag: "enableEdit",
            clickEvent: "edit_clicked",
            defaultBtnClasses: "text-base-content hover:text-success",
        },
        duplicate: {
            faIcon: faCopy,
            backendFlag: "enableDuplicate",
            clickEvent: "duplicate_clicked",
            defaultBtnClasses: "text-base-content hover:text-warning",
        },
        delete: {
            faIcon: faTrash,
            backendFlag: "enableDelete",
            clickEvent: "delete_clicked",
            defaultBtnClasses: "text-base-content hover:text-error",
        },
    };

    /**
     * Used to bubble the event to the data list as well as the calling component
     * @param event
     */
    const rowActionTriggered = (event) => {
        event.stopPropagation(); // Stops the click on table row element behind it
        dispatch("actionTriggered", {
            clickEvent: configuredActions[action.type].clickEvent,
            rowId: rowData.id,
            rowData: rowData,
        });
    };
</script>

{#if Object.keys(configuredActions).includes(action.type)}
    {#if rowData[configuredActions[action.type].backendFlag] === undefined || rowData[configuredActions[action.type].backendFlag]}
        <button
            class="btn-link btn-xs btn ml-1 flex-nowrap 
            {action.btnClasses}
            {configuredActions[action.type].defaultBtnClasses}"
            on:click={(event) => rowActionTriggered(event)}>
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
