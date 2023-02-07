<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { sleep } from "$src/lib/js/utilities/helpers.js";
    import { errorToast } from "$src/lib/js/utilities/swalMixins";
    import DataListHeader from "$src/base_components/data-series/data-lists/header-variants/genericHeader.svelte";

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
     * Maximum allowed height for the data list
     * @type {string|"none"}
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
    export let rowsPerPage = 10;

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

<div class="static w-full">
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
    <ul
        class="minimal-scrollbar w-full {overflowType} rounded-lg border border-base-200"
        style="max-height: {dataListMaxHeight}; max-width: 100%;">
        {#if loading}
            <!-- Loading State -->
            {#each Array(2) as value, rowIndex}
                <slot showLoadingState={true} {rowIndex} rowData={{}} listLength={2} />
            {/each}
        {:else}
            <!-- Actual List -->
            {#each currentPage as rowData, rowIndex}
                <slot showLoadingState={false} {rowData} {clickableRow} {rowIndex} listLength={currentPage.length} />
            {/each}
        {/if}
        <!-- Custom row for no results found -->
        {#if noResultsFound && !loading}
            <li class="flex items-center justify-between rounded-lg bg-base-100 py-4 px-4">
                <div class="mx-auto text-center">No Results</div>
            </li>
        {/if}
    </ul>
    <!-- Loading Bar -->
    {#if (currentPage.length < totalRowCount && !noResultsFound) || loading}
        <div class="mt-2 w-full text-center">
            <button
                class="btn-link btn"
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
