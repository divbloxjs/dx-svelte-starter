<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { sleep } from "$src/lib/js/utilities/helpers.js";
    import DataListHeader from "$src/base_components/data-series/data-lists/headers/genericHeader.svelte";
    import { errorToast } from "$src/lib/js/utilities/swalMixins";

    export let httpRequestType = "POST";
    export let dataSource;
    export let dataSourceDelaySimulation = 0; // ms
    export let dataSourceReturnProp = "data";
    export let dataSourceCountReturnProp = "count";
    export let dataSourceIncludeCredentials = "include";
    export let dataListMaxHeight = "none";
    export let additionalPostBodyParams = {};

    export let rowComponent; // Pass custom component to load rowData
    export let additionalRowProps = {}; // Any further component props needed for the row
    export let rowActions = []; // Array of actions objects - refer to your custom row compoent for structure
    export let clickableRow = true;

    export let rowsPerPage = 3;
    let pageNumber = 1;

    // Header Component settings
    let dataListHeader;
    export let enableSearch = true;
    export let enableCreate = true;
    export let enableRefresh = true;
    export let searchValue = "";

    let totalRowCount = 0;
    let currentPage = [];
    let loading = false; // TODO convert to store if becoming more complicated with state management of subcomponents
    let loadingMore = false; // Seperate state control for the "Load More" button after initial load
    let initialLoading = true;
    let noResultsFound = false;

    let listWidth;
    let overflowType = dataListMaxHeight === "none" ? "" : "overflow-y-auto";

    onMount(async () => {
        await resetDataList();
        initialLoading = false;
    });

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
            actionTriggered({ clickEvent: "no_results_found" });
            noResultsFound = true;
        }

        totalRowCount = data[dataSourceCountReturnProp];

        currentPage = currentPage;
    };

    //region Event handlers
    const dispatch = createEventDispatcher();
    const actionTriggered = (params) => {
        dispatch("actionTriggered", params);
    };

    /**
     * Propagates actions from subcomponents of the datalist to the parent
     * @param {object} params - Whatever parameters where sent from the subcomponent
     */
    const propagateActionTriggered = async (params) => {
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
    };
    //endregion
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
            on:actionTriggered={(params) => propagateActionTriggered(params)} />
    </div>

    <!-- List body -->
    <div bind:clientWidth={listWidth}>
        <ul
            class="minimal-scrollbar w-full {overflowType} rounded-lg border border-base-200"
            style="max-height: {dataListMaxHeight}; max-width: 100%;">
            {#if loading}
                <!-- Loading State -->
                {#each Array(2) as value, index}
                    <svelte:component
                        this={rowComponent}
                        showLoadingState={true}
                        rowWidth={listWidth}
                        rowIndex={index} />
                {/each}
            {:else}
                <!-- Actual List -->
                {#each currentPage as rowData, index}
                    <svelte:component
                        this={rowComponent}
                        {rowData}
                        {rowActions}
                        {clickableRow}
                        {additionalRowProps}
                        rowWidth={listWidth}
                        on:actionTriggered={(params) => {
                            actionTriggered(params.detail);
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
