<script>
    import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { createEventDispatcher, onMount } from "svelte";
    import { sleep } from "$src/lib/js/utilities/helpers.js";
    import DataListHeader from "$src/base_components/data-series/data-lists/headers/variantOne.svelte";

    export let httpRequestType = "POST";
    export let dataSource;
    export let dataSourceDelaySimulation = 500; // ms
    export let dataSourceReturnProp = "data";
    export let dataSourceCountReturnProp = "count";
    export let dataSourceIncludeCredentials = "include";
    export let dataListMaxHeight = "400px";
    export let rowTitle = "name";

    export let initialNumberOfRows = 4;
    let currentNumberOfRows = initialNumberOfRows;

    export let enableSearch = true;
    export let enableCreate = true;
    export let enableRefresh = true;
    export let searchValue = "";
    export let clickableRow = true;

    export let actions = [
        {
            faIcon: "faEdit",
            btnClasses: "btn-link text-base-content hover:text-success",
            // displayLabel: "Edit",
            clickEvent: "edit_clicked"
        },
        {
            faIcon: "faTrash",
            // displayLabel: "Delete",
            btnClasses: "btn-link text-base-content hover:text-error",
            clickEvent: "delete_clicked"
        }
    ];

    let totalRowCount = 0;
    let rowsLeftCount = 0;
    let currentPage = [];
    let globalLoading = false; // TODO convert to store if becoming more complicated with state management of subcomponents
    let noResultsFound = false;

    onMount(async () => {
        await refreshDataList();
    });


    /**
     * Handles refreshing the data list with the latest search and display configuration
     */
    const refreshDataList = async () => {
        globalLoading = true;

        if (dataSourceDelaySimulation > 0) {
            await sleep(() => {
            }, dataSourceDelaySimulation);
        }

        let postBody = {
            offset: currentNumberOfRows,
            limit: initialNumberOfRows,
            searchValue: searchValue
        };

        let response;
        if (httpRequestType === "GET") {
            let encodedPostBody = encodeURIComponent(JSON.stringify(postBody));

            response = await fetch(dataSource + "?encodedPostBody=" + encodedPostBody, {
                method: httpRequestType,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: dataSourceIncludeCredentials ? "include" : "omit"
            });
        } else if (httpRequestType === "POST") {
            response = await fetch(dataSource, {
                method: httpRequestType,
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: dataSourceIncludeCredentials ? "include" : "omit",
                body: JSON.stringify(postBody)
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

        currentPage.push(...data[dataSourceReturnProp]);

        if (currentPage.length < 1) {
            noResultsFound = true;
        }

        totalRowCount = data[dataSourceCountReturnProp];
        rowsLeftCount = Math.ceil(totalRowCount - currentNumberOfRows);

        currentNumberOfRows = currentPage.length;
        currentPage = currentPage;
        globalLoading = false;
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
            case "refresh_clicked":
            case "search_clicked":
                await refreshDataList();
                break;
            case "create_clicked":
                dispatch("actionTriggered", params);
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

</script>

<div class="w-full" style="max-height:{dataListMaxHeight}">
    <div class="w-full my-3">
        <DataListHeader
            enableRefresh={enableRefresh}
            enableSearch={enableSearch}
            enableCreate={enableCreate}
            searchValue={searchValue}
            globalLoading={globalLoading}
            on:actionTriggered={params => propagateActionTriggered(params)} />
    </div>

    <ul class="divide-y-2 divide-gray-200 min-w-[300px] overflow-y-auto rounded-lg border-2 border-gray-200"
        style="max-height: inherit;">
        {#each currentPage as row}
            <li class="flex justify-between items-center py-4 px-4 bg-transparent
                hover:bg-gray-200 {clickableRow ? 'hover:cursor-pointer' : ''}"
                on:click={(event) => {if (clickableRow) {handleRowClick(event, row.id);}
            }}>
                <div>
                    <div class="text-lg">
                        {row[rowTitle]}
                    </div>
                </div>
                <div class="flex justify-center items-center">
                    {#each actions as action}
                        {#if row.actions}
                            {/if}
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
                                <span class="ml-1 {action.faIcon === 'faEdit' ? 'mt-[3px]': ''}
                                {action.faIcon === 'faTrash' ? 'mt-[2px]': ''}">{action.displayLabel}</span>
                            {/if}
                        </button>
                    {/each}
                </div>
            </li>
        {/each}
        {#if noResultsFound}
            <li class="flex justify-between items-center py-2 px-4 bg-gray-100 rounded-lg">
                <div class="text-center mx-auto">
                    No Results
                </div>
            </li>
        {/if}
    </ul>
    {#if currentPage.length < totalRowCount && !noResultsFound}
        <div class="w-full mt-2 text-center">
            <button class="btn-link"
                    on:click={async () => {await refreshDataList()}}>
                Load More
            </button>
        </div>
    {/if}
</div>