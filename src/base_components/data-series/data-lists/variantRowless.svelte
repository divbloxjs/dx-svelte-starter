<script>
    import { createEventDispatcher, onMount, SvelteComponent } from "svelte";
    import { sleep } from "$src/lib/js/utilities/helpers.js";
    import { errorToast } from "$src/lib/js/utilities/swalMixins";
    import DataListHeader from "$src/base_components/data-series/data-lists/headers/genericHeader.svelte";
    import { faCopy, faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";

    const dispatch = createEventDispatcher();

    //region Exports
    /**
     * @param {string} httpRequestType The type of HTTP request being sent
     * @type {"POST"|"GET"}
     */
    export let httpRequestType = "POST";

    /**
     * Full URL to dataSource to query data from
     * @type {string}
     */
    export let dataSource;

    /**
     * Optional parameter to simulate network latency (measured in ms)
     * @type {number}
     */
    export let dataSourceDelaySimulation = 0; // ms

    /**
     * The property of the return object to use to construct data rows
     * @type {string}
     */
    export let dataSourceReturnProp = "data";

    /**
     * The property of the return object to use as the total count of data set
     * @type {string}
     */
    export let dataSourceCountReturnProp = "count";

    /**
     * Whether or not to include credentials in the HTTP request
     * @type {"include"|"omit"}
     */
    export let dataSourceIncludeCredentials = "include";

    /**
     * Maximum allowed height for the data list (in px)
     * @type {number|"none"}
     */
    export let dataListMaxHeight = "none";

    /**
     * Any additional post body params needed for your HTTP request
     * @type {{}}
     */
    export let additionalPostBodyParams = {};

    /**
     * Number of rows to display per load
     * @type {number}
     */
    export let rowsPerPage = 3;

    /**
     * Initial page number to load (updated as "load more" is clicked)
     */
    export let pageNumber = 1;

    //endregion

    //region Header Component settings
    let dataListHeader;

    /**
     * Render the top searchbar
     * @type {boolean}
     */
    export let enableSearch = true;
    /**
     * Render the top create button
     * @type {boolean}
     */
    export let enableCreate = true;
    /**
     * Render the top refresh button
     * @type {boolean}
     */
    export let enableRefresh = true;
    /**
     * The default search value
     * @type {string}
     */
    export let searchValue = "";

    //endregion

    //region Row Component settings
    /**
     * Custom svelte row component to load rowData
     * @type {import("svelte").ComponentType}
     */
    export let rowComponent;

    /**
     * Key Value pair in the form of {"defaultRowKey": "overrideKey", ...}
     * Used to map data coming from backend to naming used in default row components.
     * Can be ignored if row is custom to implementation
     * @type {Object}
     */
    export let rowDataMappingOverride = {};

    /**
     * Object of parameters needed specifically for the row component
     * @type {object}
     */
    export let additionalRowProps = {}; // Any further component props needed for the row

    /**
     * @typedef rowAction
     * @type {object}
     * @property {"view"|"edit"|"duplicate"|"delete"} type Type of row action
     * @property {string} btnClasses Custom classes to add to the action button
     * @property {string} clickEvent click event to fire off on triggering of the action
     */

    /**
     * Array of rowAction configuration objects
     * @type {rowAction[]}
     * @param {{type: number, btnClasses: string, clickEvent: string}[]} rowAction Specific row action object
     * @param {"view"|"edit"|"duplicate"|"delete"} rowAction.type Type of row action
     * @param {string} rowAction.btnClasses Custom classes to add to the action button
     * @param {string} rowAction.clickEvent click event to fire off on triggering of the action
     */
    export let rowActions = [];

    /**
     * Flag whether or not to allow row clicks - handled by rowComponent
     * @type {boolean}
     */
    export let clickableRow = true;

    //endregion

    /**
     * The total number of items in the dataset returned
     * @type {number}
     */
    let totalRowCount = 0;
    /**
     * Currently viewable subset of the entire dataset
     * @type {Array}
     */
    let currentPage = [];

    /**
     * Keeps track of whether data is being loaded or not.
     * Used to disabled actions, and visualise loading states as data is being fetched
     * @type {boolean}
     * TODO convert to store if becoming more complicated with state management of subcomponents
     */
    let loading = false;

    /**
     * Seperate state control (from loading) for the "Load More" button after initial load
     * @type {boolean}
     */
    let loadingMore = false;

    /**
     * Flag for whether or not no results were found.
     * Used to display "No results" if needed
     * @type {boolean}
     */
    let noResultsFound = false;

    /**
     *  Sets the overflow of the list to 'auto' if a maxHeight is provided
     */
    let overflowType = dataListMaxHeight === "none" ? "" : "overflow-y-auto";

    /**
     * Object defined what row actions are caterered for.
     * @type {Object}
     */
    let allowedRowActions = {
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

    onMount(async () => {
        await resetDataList();
    });

    /**
     * Resets the data list with initial params
     */
    export const resetDataList = async () => {
        loading = true;
        pageNumber = 1;
        currentPage = [];
        await loadData();
        loading = false;
        if (dataListHeader) {
            dataListHeader.setGlobalLoading(false);
        }
    };

    /**
     * Handles refreshing the data list with the latest search and display configuration
     */
    const loadData = async () => {
        if (dataSourceDelaySimulation > 0) {
            await sleep(() => {}, dataSourceDelaySimulation);
        }

        let postBody = {
            offset: rowsPerPage * (pageNumber - 1),
            limit: rowsPerPage,
            searchValue: searchValue,
        };

        for (const [paramName, paramValue] of Object.entries(additionalPostBodyParams)) {
            postBody[paramName] = paramValue;
        }

        let response;
        if (httpRequestType === "GET") {
            let encodedPostBody = encodeURIComponent(JSON.stringify(postBody));

            response = await fetch(dataSource + "?encodedPostBody=" + encodedPostBody, {
                method: httpRequestType,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                credentials: dataSourceIncludeCredentials,
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
        if (data.error) {
            errorToast.fire({
                title: data.message,
                confirmButtonText: "OK",
                timer: 5000,
            });
            return;
        }

        if (typeof data[dataSourceReturnProp] === "undefined") {
            throw new Error("dataSourceReturnProp '" + dataSourceReturnProp + "' is not defined on the fetch result");
        }

        if (typeof data[dataSourceCountReturnProp] === "undefined") {
            throw new Error(
                "dataSourceCountReturnProp '" + dataSourceCountReturnProp + "' is not defined on the fetch result"
            );
        }

        currentPage.push(...data[dataSourceReturnProp]);

        noResultsFound = false;
        if (currentPage.length < 1) {
            dispatch("actionTriggered", { clickEvent: "no_results_found" });
            noResultsFound = true;
        }

        totalRowCount = data[dataSourceCountReturnProp];

        currentPage = currentPage;
    };
</script>

<div class="static w-full" style="max-height:{dataListMaxHeight}">
    <!-- List Header -->
    <div class="my-3 w-full">
        <DataListHeader
            bind:this={dataListHeader}
            {enableRefresh}
            {enableSearch}
            {enableCreate}
            {searchValue}
            on:actionTriggered={async (params) => {
                switch (params.detail.clickEvent) {
                    case "refresh_clicked":
                        searchValue = "";
                        await resetDataList();
                        break;
                    case "search_clicked":
                        searchValue = params.detail.searchValue;
                        await resetDataList();
                        break;
                    case "create_clicked":
                        dispatch("actionTriggered", params.detail);
                        dataListHeader.setGlobalLoading(false);
                        break;
                }
            }} />
    </div>

    <!-- List body -->
    <div>
        <ul
            class="minimal-scrollbar w-full {overflowType} rounded-lg border border-base-200"
            style="max-height: {dataListMaxHeight}; max-width: 100%;">
            {#if loading}
                <!-- Loading State -->
                {#each Array(2) as value, index}
                    <svelte:component this={rowComponent} showLoadingState={true} rowIndex={index} />
                {/each}
            {:else}
                <!-- Actual List -->
                {#each currentPage as rowData, index}
                    <svelte:component
                        this={rowComponent}
                        {rowData}
                        {rowActions}
                        {allowedRowActions}
                        {clickableRow}
                        {additionalRowProps}
                        rowDataMappingOverride={rowDataMappingOverride ?? rowDataMappingOverride}
                        on:actionTriggered={(params) => {
                            dispatch("actionTriggered", params.detail);
                        }}
                        on:resetDataList={() => resetDataList()}
                        rowIndex={index}
                        listLength={currentPage.length} />
                {/each}
            {/if}
            <!-- Custom row for no results found -->
            {#if noResultsFound && !loading}
                <li class="flex items-center justify-between rounded-lg bg-base-100 py-4 px-4">
                    <div class="mx-auto text-center">No Results</div>
                </li>
            {/if}
        </ul>
    </div>
    <!-- Loading Bar -->
    {#if (currentPage.length < totalRowCount && !noResultsFound) || loading}
        <div class="mt-2 w-full text-center">
            <button
                class="btn btn-link"
                on:click={async () => {
                    if (loading || loadingMore) {
                        return;
                    }

                    pageNumber++;
                    loadingMore = true;
                    await loadData();
                    loadingMore = false;
                }}>
                {#if loading || loadingMore}
                    Loading...
                {:else}
                    Load More
                {/if}
            </button>
        </div>
    {/if}
</div>

<style>
    ul {
        overflow: hidden;
    }
</style>
