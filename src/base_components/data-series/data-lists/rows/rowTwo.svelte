<script>
    import { faCopy, faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
    import { beforeUpdate, createEventDispatcher, onMount } from "svelte";
    import Fa from "svelte-fa";
    import Dropdown from "$src/base_components/data-series/ui-elements/dropdown.svelte";
    import { errorToast, successToast } from "$src/lib/js/utilities/swalMixins";
    import noImagePath from "$src/assets/images/no_image.svg";

    export let defaultImagePath = noImagePath;

    export let rowData = {};
    export let additionalRowProps = {
        categoryUpdateEndpoint: "",
        additionalCategoryParams: "",
    };
    export let rowDataMappingOverride = {};
    let rowDataMapping = {
        imageUrl: "imageUrl",
        rowTitle: "rowTitle",
        rowDescription: "rowDescription",
        rowCategory: "rowCategory",
        possibleCategories: "possibleCategories",
    };
    export let rowActions = [];
    export let clickableRow = true;
    export let showLoadingState = false;

    export let dataSourceIncludeCredentials = "include";

    // Used to style rows according to where they are in the list
    // e.g. dropup/down based on proximity to end of list
    export let rowIndex; // E.g. 0,1,2,3
    export let listLength; // E.g 10

    export let rowWidth;
    let widthSmall = 500;
    let widthMedium = 800;

    let rowLoading = false;

    export let possibleCategories = [];

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

    let categoryUpdateEndpoint;
    let additionalCategoryParams;

    let initComplete = false;
    beforeUpdate(async () => {
        if (!initComplete) {
            console.log("initComplete", rowData);
            initComplete = true;
            await initialiseConfig();
        }
    });

    const initialiseConfig = async () => {
        // Override data keys with provided overrides
        Object.keys(rowDataMappingOverride).forEach((defaultRowDataAttribute) => {
            if (rowDataMapping.hasOwnProperty(defaultRowDataAttribute)) {
                rowDataMapping[defaultRowDataAttribute] = rowDataMappingOverride[defaultRowDataAttribute];
            }
        });

        console.log("rowData", rowData);
        console.log("additionalRowProps", additionalRowProps);

        if (Object.keys) possibleCategories = [];
        rowData[rowDataMapping.possibleCategories]?.forEach((role) => {
            possibleCategories.push({
                params: { id: role.id, name: role.name },
                displayLabel: role.name,
                clickEvent: "category_change_clicked",
            });
        });

        if (!additionalRowProps.hasOwnProperty("categoryUpdateEndpoint")) {
            throw new Error("additionalRowProps.categoryUpdateEndpoint not provided");
        }
        categoryUpdateEndpoint = additionalRowProps.categoryUpdateEndpoint;

        if (!additionalRowProps.hasOwnProperty("additionalCategoryParams")) {
            throw new Error("additionalRowProps.additionalCategoryParams not provided");
        }
        additionalCategoryParams = additionalRowProps.additionalCategoryParams;
    };

    onMount(async () => {
        console.log("onMount", rowData);
        rowActions.forEach((rowAction) => {
            if (!Object.keys(configuredActions).includes(rowAction.type)) {
                console.error("Unconfigured row action type provided: " + rowAction.type);
            }
        });
    });

    const updateCategory = async (category) => {
        let postBody = {
            category: category,
        };

        console.log("id", rowData.id);
        console.log("category", category);
        let additionalUrlParms = "";
        for (const [name, value] of Object.entries(additionalCategoryParams)) {
            additionalUrlParms += "&" + name + "=" + value;
        }

        let response = await fetch(categoryUpdateEndpoint + "?id=" + rowData.id + additionalUrlParms, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: dataSourceIncludeCredentials,
            body: JSON.stringify(postBody),
        });

        if (response.status !== 200) {
            errorToast.fire({ title: "Could not save changes. Please try again" });
            return false;
        }

        successToast.fire({ title: "Successfully saved changes" });
        return true;
    };

    const handleCategoryChange = async (categoryInfo) => {
        rowLoading = true;
        if (await updateCategory(categoryInfo.id)) {
            rowData[rowDataMapping.rowCategory] = categoryInfo.name;
        }

        rowLoading = false;
    };
</script>

{#if showLoadingState}
    <li
        class="flex w-full items-center justify-between bg-transparent p-4 hover:bg-base-200 {clickableRow
            ? 'hover:cursor-pointer'
            : ''}">
        <div class="flex flex-row items-center">
            <div class="avatar">
                <div
                    class:w-24={rowWidth < widthSmall}
                    class="w-12 animate-pulse rounded-full bg-base-200  text-transparent" />
            </div>
            <div class:text-base={rowWidth < widthSmall} class="ml-3 text-sm">
                <div
                    class:text-xl={rowWidth < widthSmall}
                    class="w-24 animate-pulse rounded-lg bg-base-200  text-lg text-transparent">
                    Loading...
                </div>
                <div
                    class="mt-2 w-40 max-w-[18ch] animate-pulse bg-base-200 {rowWidth < widthSmall
                        ? 'max-w-[40ch]'
                        : ''}
                overflow-x-hidden overflow-ellipsis rounded-lg italic text-transparent">
                    Loading....................
                </div>
            </div>
        </div>
    </li>
{:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <li
        class="flex w-full items-center justify-between bg-transparent p-4 hover:bg-base-200
    {clickableRow ? 'hover:cursor-pointer' : ''}"
        class:py-2={rowWidth < widthSmall}
        on:click={() => {
            if (clickableRow) {
                dispatch("actionTriggered", { clickEvent: "row_clicked", rowId: rowData.id });
            }
        }}>
        <div class="flex flex-row items-center {rowWidth < widthSmall ? 'w-9/12' : 'w-6/12'}">
            <div class="avatar  justify-center {rowWidth < widthSmall ? 'w-3/12' : 'w-2/12'}">
                <div class="w-24 rounded-full">
                    <img
                        src={rowData[rowDataMapping.imageUrl]}
                        alt="User Profile"
                        on:error={() => (rowData[rowDataMapping.imageUrl] = defaultImagePath)} />
                </div>
            </div>
            <div
                class:text-base={rowWidth < widthSmall}
                class="ml-3 text-sm {rowWidth < widthSmall ? 'w-9/12' : 'w-10/12'}">
                <div class:text-xl={rowWidth < widthSmall} class="text-lg">
                    {rowData[rowDataMapping.rowTitle]}
                </div>
                <div class="overflow-x-hidden overflow-ellipsis italic {rowWidth < widthSmall ? '' : ''}">
                    {rowData[rowDataMapping.rowDescription]}
                </div>
                <div class:hidden={rowWidth > widthSmall}>
                    {#if rowData.enableEdit}
                        <Dropdown
                            dropDownText={rowData[rowDataMapping.rowCategory]}
                            dropDownTextClasses="overflow-hidden overflow-ellipsis max-w-[9ch] whitespace-nowrap"
                            dropDownOptions={possibleCategories}
                            dropdownClasses="z-100 {rowIndex > listLength - 2 && rowIndex > 3 ? '' : ''}"
                            btnClasses="btn-xs mt-2 capitalize text-right"
                            loading={rowLoading}
                            includeDropDownChevron={true}
                            on:optionSelected={async (params) => {
                                await handleCategoryChange(params.detail.params);
                            }} />
                    {:else}
                        <button class="btn btn-link btn-xs pl-0 text-base-content">
                            {rowData[rowDataMapping.rowCategory]}
                        </button>
                    {/if}
                </div>
            </div>
        </div>
        <div class="flex items-center justify-end {rowWidth < widthSmall ? 'w-3/12' : 'w-6/12'}">
            <div class:hidden={rowWidth < widthSmall}>
                {#if rowData.enableEdit}
                    <Dropdown
                        dropDownText={rowData[rowDataMapping.rowCategory]}
                        dropDownTextClasses="overflow-hidden overflow-ellipsis  {rowWidth > widthMedium
                            ? 'max-w-[20ch]'
                            : 'max-w-[11ch]'} whitespace-nowrap"
                        dropDownOptions={possibleCategories}
                        dropdownClasses="dropdown-end mr-2 {rowIndex > 2 && rowIndex >= listLength - 2
                            ? 'dropdown-top'
                            : ''}"
                        btnClasses="text-right"
                        includeDropDownChevron={true}
                        loading={rowLoading}
                        on:optionSelected={async (params) => {
                            await handleCategoryChange(params.detail.params);
                        }} />
                {:else}
                    <button class="btn disabled btn-link text-base-content">
                        {rowData[rowDataMapping.rowCategory]}
                    </button>
                {/if}
            </div>

            <!-- Row Actions -->
            <div class="flex items-center justify-center">
                {#each rowActions as action}
                    {#if Object.keys(configuredActions).includes(action.type)}
                        {#if rowData[configuredActions[action.type].backendFlag]}
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
        </div>
    </li>
{/if}
