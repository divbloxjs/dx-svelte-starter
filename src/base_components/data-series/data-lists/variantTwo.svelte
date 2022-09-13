<script>
    import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { createEventDispatcher, onMount } from "svelte";
    import { sleep } from "$src/lib/js/utilities/helpers.js";
    import DataListHeader from "$src/base_components/data-series/data-lists/headers/variantOne.svelte";
    import Dropdown from "$src/base_components/data-series/ui-elements/dropdown.svelte";
    import { errorToast, successToast } from "$src/lib/js/utilities/swalMixins.js";

    export let httpRequestType = "POST";
    export let dataSource;
    export let categoryUpdateEndpoint;
    export let dataSourceDelaySimulation = 0; // ms
    export let dataSourceReturnProp = "data";
    export let dataSourceCountReturnProp = "count";
    export let dataSourcePossibleCategoriesProp = "possibleCategories";
    export let dataSourceIncludeCredentials = "include";

    export let dataListMaxHeight = "400px";
    export let rowTitle = "name";
    export let rowSubTitle = "emailAddress";
    export let imageUrl = "imageUrl";
    export let category = "roleName";
    export let additionalCategoryParams = {};

    let possibleCategories = [];

    export let rowsPerPage = 3;
    let pageNumber = 1;

    export let enableSearch = true;
    export let enableCreate = true;
    export let enableRefresh = true;
    export let searchValue = "";
    export let clickableRow = true;

    export let actions = [
        {
            type: "edit",
            faIcon: "faEdit",
            btnClasses: "btn-link text-base-content hover:text-success",
            // displayLabel: "Edit",
            clickEvent: "edit_clicked",
        },
        {
            type: "delete",
            faIcon: "faTrash",
            // displayLabel: "Delete",
            btnClasses: "btn-link text-base-content hover:text-error",
            clickEvent: "delete_clicked",
        },
    ];

    let totalRowCount = 0;
    let currentPage = [];
    let rowStates = {};
    let globalLoading = false; // TODO convert to store if becoming more complicated with state management of subcomponents
    let initialLoading = true;
    let noResultsFound = false;

    onMount(async () => {
        await resetDataList();
    });

    /**
     * Handles refreshing the data list with the latest search and display configuration
     */
    export const loadData = async () => {
        globalLoading = true;

        if (dataSourceDelaySimulation > 0) {
            await sleep(() => {}, dataSourceDelaySimulation);
        }

        let postBody = {
            offset: rowsPerPage * (pageNumber - 1),
            limit: rowsPerPage,
            searchValue: searchValue,
        };

        let response;
        if (httpRequestType === "GET") {
            let encodedPostBody = encodeURIComponent(JSON.stringify(postBody));

            response = await fetch(dataSource + "?encodedPostBody=" + encodedPostBody, {
                method: httpRequestType,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: dataSourceIncludeCredentials ? "include" : "omit",
            });
        } else if (httpRequestType === "POST") {
            response = await fetch(dataSource, {
                method: httpRequestType,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: dataSourceIncludeCredentials ? "include" : "omit",
                body: JSON.stringify(postBody),
            });
        } else {
            throw Error("Allowed HTTP request types are only 'POST' and 'GET'. Provided: " + httpRequestType);
        }

        let data = await response.json();

        if (typeof data[dataSourceReturnProp] === "undefined") {
            throw new Error("dataSourceReturnProp '" + dataSourceReturnProp + "' is not defined on the fetch result");
        }

        if (typeof data[dataSourceCountReturnProp] === "undefined") {
            throw new Error(
                "dataSourceCountReturnProp '" + dataSourceCountReturnProp + "' is not defined on the fetch result"
            );
        }

        if (typeof data[dataSourcePossibleCategoriesProp] === "undefined") {
            throw new Error(
                "dataSourcePossibleCategoriesProp '" +
                    dataSourcePossibleCategoriesProp +
                    "' is not defined on the fetch result"
            );
        }

        currentPage.push(...data[dataSourceReturnProp]);
        currentPage.forEach((row) => {
            rowStates[row.id] = { id: row.id, loading: false, category: row[category] };
        });

        possibleCategories = [];
        data[dataSourcePossibleCategoriesProp].forEach((category) => {
            possibleCategories.push({
                params: { id: category.id, name: category.name },
                displayLabel: category.name,
                clickEvent: "category_change_clicked",
            });
        });

        if (currentPage.length < 1) {
            noResultsFound = true;
        } else {
            noResultsFound = false;
        }

        totalRowCount = data[dataSourceCountReturnProp];

        currentPage = currentPage;
        globalLoading = false;
        initialLoading = false;
    };

    export const resetDataList = async () => {
        initialLoading = true;
        pageNumber = 1;
        currentPage = [];
        loadData();
        initialLoading = false;
    };

    const updateCategory = async (id, category) => {
        if (dataSourceDelaySimulation > 0) {
            await sleep(() => {}, dataSourceDelaySimulation);
        }

        let postBody = {
            category: category,
        };

        let additionalUrlParms = "";
        for (const [name, value] of Object.entries(additionalCategoryParams)) {
            additionalUrlParms += "&" + name + "=" + value;
        }

        let response = await fetch(categoryUpdateEndpoint + "?id=" + id + additionalUrlParms, {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            credentials: dataSourceIncludeCredentials ? "include" : "omit",
            body: JSON.stringify(postBody),
        });

        if (response.status !== 200) {
            errorToast.fire({ title: "Could not save changes. Please try again" });
            return false;
        }

        successToast.fire({ title: "Successfully saved changes" });
        return true;
    };

    const handleCategoryChange = async (rowId, categoryInfo) => {
        rowStates[rowId].loading = true;
        if (await updateCategory(rowId, categoryInfo.id)) {
            rowStates[rowId].category = categoryInfo.name;
        }

        rowStates[rowId].loading = false;
    };

    //region Event handlers
    const dispatch = createEventDispatcher();
    const actionTriggered = (params) => {
        dispatch("actionTriggered", params);
    };

    /**
     * Handles clicks on any of the custom actions, passing an event up to the parent component
     * @param event - The JS event of the click, used to prevent default click on the row behind it.
     * @param customAction - The custom action event name to be referenced by parent component
     * @param  rowId - ID of the row the custom action was called on ]
     */
    const handleCustomActionClick = (event, customAction, rowId) => {
        actionTriggered({ clickEvent: customAction, rowId: rowId });
        event.stopPropagation(); // Stops the click on table row element
    };

    /**
     * Propagates actions from subcomponents of the datalist to the parent
     * @param {object} params - Whatever parameters where sent from the subcomponent
     */
    const propagateActionTriggered = async (params) => {
        switch (params.detail.clickEvent) {
            case "search_clicked":
                searchValue = params.detail.searchValue;
            case "refresh_clicked":
                resetDataList();
                break;
            case "create_clicked":
                dispatch("actionTriggered", params.detail);
                break;
        }
    };

    /**
     * Handles clicks on the row itself, passing an event up to the parent component
     * @param event - clickEvent name to be referenced by parent
     * @param rowId - ID of the row clicked
     */
    const handleRowClick = (event, rowId) => {
        actionTriggered({ clickEvent: "row_clicked", rowId: rowId });
    };
    //endregion

    let listWidth;
    let widthSmall = 500;
    let widthMedium = 800;
</script>

<div class="static w-full">
    <div class="my-3 w-full">
        <DataListHeader
            {enableRefresh}
            {enableSearch}
            {enableCreate}
            {searchValue}
            {globalLoading}
            on:actionTriggered={(params) => propagateActionTriggered(params)} />
    </div>

    <div bind:clientWidth={listWidth}>
        <ul
            class="minimal-scrollbar w-full divide-y-2 divide-gray-200 overflow-y-auto rounded-lg border-2 border-gray-200"
            style="max-height: {dataListMaxHeight}; max-width: 100%;">
            {#if initialLoading}
                {#each Array(2) as index}
                    <li
                        class:p-4={listWidth < widthSmall}
                        class="flex w-full items-center justify-between bg-transparent p-4 hover:bg-gray-200 {clickableRow
                            ? 'hover:cursor-pointer'
                            : ''}">
                        <div class="flex flex-row items-center">
                            <div class="avatar">
                                <div
                                    class:w-24={listWidth < widthSmall}
                                    class="w-12 animate-pulse rounded-full bg-base-200  text-transparent" />
                            </div>
                            <div class:text-base={listWidth < widthSmall} class="ml-3 text-sm">
                                <div
                                    class:text-xl={listWidth < widthSmall}
                                    class="w-24 animate-pulse rounded-lg bg-base-200  text-lg text-transparent">
                                    Loading...
                                </div>
                                <div
                                    class="mt-2 w-40 max-w-[18ch] animate-pulse bg-base-200 {listWidth < widthSmall
                                        ? 'max-w-[40ch]'
                                        : ''}
                                overflow-x-hidden overflow-ellipsis rounded-lg italic text-transparent">
                                    Loading....................
                                </div>
                            </div>
                        </div>
                    </li>
                {/each}
            {:else}
                {#each currentPage as row, index}
                    <li
                        class="flex w-full items-center justify-between bg-transparent p-4 hover:bg-gray-200
                    {clickableRow ? 'hover:cursor-pointer' : ''}"
                        class:py-2={listWidth < widthSmall}
                        on:click={(event) => {
                            if (clickableRow) {
                                handleRowClick(event, row.id);
                            }
                        }}>
                        <div class="flex flex-row items-center {listWidth < widthSmall ? 'w-9/12' : 'w-6/12'}">
                            <div class="avatar  justify-center {listWidth < widthSmall ? 'w-3/12' : 'w-2/12'}">
                                <div class="w-24 rounded-full">
                                    <img src={row[imageUrl]} alt="User Profile Picture " />
                                </div>
                            </div>
                            <div
                                class:text-base={listWidth < widthSmall}
                                class="ml-3 text-sm {listWidth < widthSmall ? 'w-9/12' : 'w-10/12'}">
                                <div class:text-xl={listWidth < widthSmall} class="text-lg">
                                    {row[rowTitle]}
                                </div>
                                <div
                                    class="overflow-x-hidden overflow-ellipsis italic {listWidth < widthSmall
                                        ? ''
                                        : ''}">
                                    {row[rowSubTitle]}
                                </div>
                                <div class:hidden={listWidth > widthSmall}>
                                    {#if row.enableEdit}
                                        <Dropdown
                                            dropDownText={rowStates[row.id].category}
                                            dropDownTextClasses="overflow-hidden overflow-ellipsis max-w-[9ch] whitespace-nowrap"
                                            dropDownOptions={possibleCategories}
                                            dropdownClasses="z-100 {index > currentPage.length - 2 && index > 3
                                                ? ''
                                                : ''}"
                                            btnClasses="btn-xs mt-2 capitalize text-right"
                                            loading={rowStates[row.id].loading}
                                            includeDropDownChevron={true}
                                            on:optionSelected={async (params) => {
                                                await handleCategoryChange(row.id, params.detail.params);
                                            }} />
                                    {:else}
                                        <button class="btn btn-link btn-xs pl-0 text-base-content">
                                            {rowStates[row.id].category}
                                        </button>
                                    {/if}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-end {listWidth < widthSmall ? 'w-3/12' : 'w-6/12'}">
                            <div class:hidden={listWidth < widthSmall}>
                                {#if row.enableEdit}
                                    <Dropdown
                                        dropDownText={rowStates[row.id].category}
                                        dropDownTextClasses="overflow-hidden overflow-ellipsis  {listWidth > widthMedium
                                            ? 'max-w-[20ch]'
                                            : 'max-w-[11ch]'} whitespace-nowrap"
                                        dropDownOptions={possibleCategories}
                                        dropdownClasses="dropdown-end mr-2"
                                        btnClasses="text-right"
                                        includeDropDownChevron={true}
                                        loading={rowStates[row.id].loading}
                                        on:optionSelected={async (params) => {
                                            console.log("params", params);
                                            console.log(params.detail.params);

                                            await handleCategoryChange(row.id, params.detail.params);
                                        }} />
                                {:else}
                                    <button class="btn disabled btn-link text-base-content">
                                        {rowStates[row.id].category}
                                    </button>
                                {/if}
                            </div>

                            {#each actions as action}
                                {#if (action.type === "edit" && row.enableEdit) || (action.type === "delete" && row.enableDelete)}
                                    <button
                                        class="btn btn-xs mr-1 flex-nowrap {action.btnClasses}"
                                        on:click={(event) => handleCustomActionClick(event, action.clickEvent, row.id)}>
                                        {#if action.faIcon === "faEye"}
                                            <Fa icon={faEye} size="1.1x" />
                                        {:else if action.faIcon === "faTrash"}
                                            <Fa icon={faTrash} size="1.1x" />
                                        {:else if action.faIcon === "faEdit"}
                                            <Fa icon={faEdit} size="1.1x" />
                                        {/if}

                                        {#if action.hasOwnProperty("displayLabel")}
                                            <span
                                                class="ml-1 {action.faIcon === 'faEdit' ? 'mt-[3px]' : ''}
                                {action.faIcon === 'faTrash' ? 'mt-[2px]' : ''}">{action.displayLabel}</span>
                                        {/if}
                                    </button>
                                {:else}
                                    <button
                                        class="btn btn-xs mr-1 flex-nowrap {action.btnClasses} hover:cursor:default cursor-default border-transparent bg-transparent text-transparent hover:border-transparent hover:bg-transparent hover:text-transparent">
                                        {#if action.faIcon === "faEye"}
                                            <Fa icon={faEye} size="1.1x" />
                                        {:else if action.faIcon === "faTrash"}
                                            <Fa icon={faTrash} size="1.1x" />
                                        {:else if action.faIcon === "faEdit"}
                                            <Fa icon={faEdit} size="1.1x" />
                                        {/if}

                                        {#if action.hasOwnProperty("displayLabel")}
                                            <span
                                                class="ml-1 {action.faIcon === 'faEdit' ? 'mt-[3px]' : ''}
                                {action.faIcon === 'faTrash' ? 'mt-[2px]' : ''}">{action.displayLabel}</span>
                                        {/if}
                                    </button>
                                {/if}
                            {/each}
                        </div>
                    </li>
                {/each}
            {/if}

            {#if noResultsFound && !globalLoading}
                <li class="flex items-center justify-between rounded-lg bg-gray-100 py-4 px-4">
                    <div class="mx-auto text-center">No Results</div>
                </li>
            {/if}
        </ul>
    </div>

    {#if currentPage.length < totalRowCount && !noResultsFound}
        <div class="mt-2 w-full text-center">
            <button
                class="btn btn-link"
                class:loading={globalLoading}
                on:click={async () => {
                    pageNumber++;
                    await loadData();
                }}>
                {#if globalLoading}
                    Loading...
                {:else}
                    Load More
                {/if}
            </button>
        </div>
    {/if}
</div>
