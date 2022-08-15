<script>
    import Fa from "svelte-fa";
    import { fly } from "svelte/transition";
    import {
        faAngleDown,
        faEdit,
        faEye,
        faTrash,
        faCheck,
        faMagnifyingGlass,
        faRefresh,
        faTimes,
        faFileCsv,
        faFileExcel,
        faFileText,
        faBars,
    } from "@fortawesome/free-solid-svg-icons/index.es";
    import { onMount, beforeUpdate } from "svelte";
    import { disableNonNumericInput, sleep } from "$src/lib/js/utilities/helpers";
    import Dropdown from "$base_components/data-series/ui-elements/dropdown.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    const actionTriggered = (params) => {
        dispatch("actionTriggered", params);
    };

    export let dataSource;
    export let itemsPerPage = 10;
    export let pageNumber = 0;
    export let enableMultiSelect = true;
    export let enableGlobalSearch = true;
    export let clickableColumn = undefined;
    export let enableRefresh = true;
    export let enableFilters = false;
    export let tableMinWidth = "1400px";

    export let multiActionsColumnWidth = 3;
    export let customActionsColumnWidth = 9;

    export let columns = undefined;
    export let customActions = {};
    export let multiSelectActions = [];

    let postBody = {};

    // TODO figure out how to add filterStates here dynamically
    const requestPendingStates = {
        globalSearch: {
            loading: false,
            visible: false,
        },
        editLimit: {
            loading: false,
            visible: false,
        },
        refresh: {
            loading: false,
            visible: false,
        },
        filters: {}, // Populated dynamically based on incoming data
    };

    const handleGeneralStates = async (type) => {
        requestPendingStates[type].loading = true;
        await refreshDataTable();
        requestPendingStates[type].loading = false;
    };

    const handleSortBy = async (columnName) => {
        if (isLoading) {
            return;
        }
        sortBy = columnName;
        isSortAscending = !isSortAscending;

        postBody.columns[columnName].sortBy = true;
        postBody.columns[columnName].isSortAscending = isSortAscending;

        await refreshDataTable();
    };

    const handleFilterBy = async (columnName, filterName) => {
        if (isLoading) {
            return;
        }
        requestPendingStates.filters[columnName][filterName].loading = true;
        await refreshDataTable();
        requestPendingStates.filters[columnName][filterName].loading = false;
    };

    let isLoading = false;
    const refreshDataTable = async () => {
        isLoading = true;
        await sleep(() => {}, 1000);
        postBody.limit = itemsPerPage;
        postBody.offset = (totalPagesCount - 1) * itemsPerPage;
        const response = await fetch(dataSource, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postBody),
        });

        let data = await response.json();

        currentPage = data.data;

        //TODO: remove - Simulating server-side pagination
        currentPage = currentPage.splice(postBody.pageNumber * postBody.itemsPerPage, postBody.itemsPerPage);
        currentPage.forEach((row) => {
            selectedRows[row.id] = false;
        });

        totalCount = data.count;
        totalPagesCount = Math.ceil(totalCount / postBody.itemsPerPage);

        paginationOptions = buildPaginationOptions();
        isLoading = false;
    };

    export let showFilters = false;
    let editingLimit = false;

    let sortBy;
    let isSortAscending = true;
    let rotateDegrees = [0, 180];

    let currentPage = [];
    let totalCount;

    let paginationOptions = [];

    let selectedRows = {};
    let allSelected = false;
    const updateSelected = (allSelected) => {
        Object.keys(selectedRows).forEach((key) => {
            selectedRows[key] = allSelected;
        });
    };

    onMount(async () => {
        await refreshDataTable();
    });

    let initComplete = false;
    beforeUpdate(async () => {
        if (!initComplete) {
            initComplete = true;
            await initPostBody();
            await handleColWidths();
        }
    });

    const resetPostBody = async () => {
        sortBy = undefined;
        isSortAscending = true;

        for (const [columnName, columnInfo] of Object.entries(columns)) {
            postBody.columns[columnName].isSortAscending = columnInfo.isSortAscending;
            postBody.columns[columnName].sortBy = columnInfo.sortBy;

            for (const [filterByName, filterByInfo] of Object.entries(columnInfo.filterBy)) {
                postBody.columns[columnName].filterBy[filterByName] = filterByInfo.userInput;
            }
        }
    };

    const initPostBody = async () => {
        if (dataSource === undefined) {
            throw Error("dataSource has not been provided");
        }
        if (columns === undefined) {
            throw Error("columns have not been provided");
        }

        postBody.itemsPerPage = itemsPerPage;
        postBody.pageNumber = pageNumber;
        postBody.columns = {};

        for (const [columnName, columnInfo] of Object.entries(columns)) {
            postBody.columns[columnName] = {};
            postBody.columns[columnName].isSortAscending = columnInfo.isSortAscending;
            postBody.columns[columnName].sortBy = columnInfo.sortBy;

            requestPendingStates.filters[columnName] = {};

            postBody.columns[columnName].filterBy = {};
            if (columnInfo.hasOwnProperty("filterBy")) {
                for (const [filterName, filterByInfo] of Object.entries(columnInfo.filterBy)) {
                    postBody.columns[columnName].filterBy[filterName] = filterByInfo.userInput;

                    requestPendingStates.filters[columnName][filterName] = {};
                    requestPendingStates.filters[columnName][filterName].loading = false;
                    requestPendingStates.filters[columnName][filterName].visible = false;
                }
            }
        }

        if (!enableFilters) {
            showFilters = false;
        }
    };

    //#region Pagination
    let totalPagesCount;
    const buildPaginationOptions = () => {
        const options = Array.from(Array(totalPagesCount).keys()).map((_, index) => {
            const optionInfo = {
                params: { pageNumber: index },
                displayLabel: "Page " + (index + 1).toString(),
                clickEvent: "page_clicked",
            };
            return optionInfo;
        });

        return options;
    };

    const handlePaginate = async (pageNumber) => {
        if (isLoading) {
            return;
        }
        paginationOptions = [];
        postBody.pageNumber = pageNumber;
        await refreshDataTable();
    };
    //#endregion

    //#region Clicks
    const handleRowClick = (event, rowId) => {
        actionTriggered({ clickEvent: "row_clicked", rowId: rowId });
        console.log("row clicked: ", rowId);
    };

    const handleCustomActionClick = (event, customAction, rowId) => {
        actionTriggered({ clickEvent: customAction, rowId: rowId });
        event.stopPropagation(); // Stops the click on table row element
        console.log(`${customAction} clicked: `, rowId);
    };

    const handleMultiSelect = (event) => {
        let selectedRowIds = Object.keys(selectedRows).filter((key) => {
            return selectedRows[key];
        });

        actionTriggered({ clickEvent: event.detail.clickEvent, rowIds: selectedRowIds });
        console.log(`${event.detail.clickEvent}: `, selectedRowIds);
    };
    //endregion

    //#region Column Widths
    const multiActionsColumnMinWidth = multiActionsColumnWidth;
    const customActionsColumnMinWidth = customActionsColumnWidth;

    // Handles dynamic scaling of data columns bases on provided widths, or defaults to generic auto HTML table scaling
    const handleColWidths = async () => {
        let takenUpWidth = 0;

        if (enableMultiSelect) {
            takenUpWidth += multiActionsColumnWidth;
        }

        if (Object.keys(customActions).length > 0) {
            takenUpWidth += customActionsColumnWidth;
        }

        let definedColWidths = {};
        for (const [columnName, columnInfo] of Object.entries(columns)) {
            if (columnInfo.hasOwnProperty("width")) {
                definedColWidths[columnName] = columnInfo.width;
            }

            columns[columnName].minWidth = "1px";
            columns[columnName].maxWidth = "1px";
        }

        // Set all undefined column widths to the minimum defined width
        for (const [columnName, columnInfo] of Object.entries(columns)) {
            if (!columnInfo.hasOwnProperty("width")) {
                columns[columnName].width = Math.min(...Object.values(definedColWidths));
            }
        }

        let sumOfColumnDataColumnWidths = Object.values(columns).reduce(function (acc, column) {
            return acc + column.width;
        }, 0);

        let allocatedDataColumnWidth = 100 - takenUpWidth;
        // Create widths according to ratio of defined width entries, constrained into defined data column width allocation
        for (const [columnName, columnInfo] of Object.entries(columns)) {
            columns[columnName].width =
                (allocatedDataColumnWidth * columns[columnName].width) / sumOfColumnDataColumnWidths;
            takenUpWidth += columns[columnName].width;
            console.log(columnName + ": " + columns[columnName].width);
        }
    };
    //#endregion
</script>

<div class="px-2">
    <!-- #region Top Buttons -->
    <div class="mb-2 flex w-full lg:hidden">
        {#if enableFilters}
            <div class="my-auto">
                <button on:click={() => (showFilters = !showFilters)} class="btn btn-link btn-xs my-auto mr-2 pl-0">
                    <span class:hidden={showFilters}>Show Filters</span>
                    <span class:hidden={!showFilters}>Hide Filters</span>
                </button>
            </div>
        {/if}
        <div class="my-auto ml-auto flex flex-row">
            <span class="badge my-auto border-base-300 bg-base-300 text-base-content"
                >{totalCount !== undefined ? totalCount : "... "} items</span>

            <div class="btn-group ml-2 hidden sm:flex">
                <button
                    class="btn btn-sm"
                    on:click={async () => {
                        if (postBody.pageNumber >= 1 && !isLoading) {
                            await handlePaginate(postBody.pageNumber - 1);
                        }
                    }}
                    >«
                </button>
                <Dropdown
                    dropDownText="Page {postBody.pageNumber + 1}"
                    dropDownOptions={paginationOptions}
                    btnClasses="rounded-none"
                    on:optionSelected={async (params) =>
                        await handlePaginate(parseInt(params.detail.params.pageNumber))} />
                <button
                    class="btn btn-sm"
                    on:click={async () => {
                        if (postBody.pageNumber < totalPagesCount - 1 && !isLoading) {
                            await handlePaginate(postBody.pageNumber + 1);
                        }
                    }}
                    >»
                </button>
            </div>
        </div>
    </div>
    <div class="mb-2 flex w-full">
        {#if enableGlobalSearch === true}
            <div class="form-control my-auto mr-2 w-80 lg:w-80">
                <div class="relative -mb-2">
                    <input
                        type="text"
                        bind:value={postBody.globalSearchText}
                        on:keypress={async (event) => {
                            if (isLoading) {
                                return;
                            }
                            if (event.keyCode === 13) {
                                await handleGeneralStates("globalSearch");
                            }
                        }}
                        on:change={async () => {
                            if (isLoading) {
                                return;
                            }
                            await handleGeneralStates("globalSearch");
                        }}
                        on:focus={(event) => {
                            event.target.select();
                            requestPendingStates.globalSearch.visible = true;
                        }}
                        on:blur={(event) => {
                            if (event.relatedTarget !== null && event.relatedTarget.id === "btnGlobalSearchId") {
                                return;
                            }

                            requestPendingStates.globalSearch.visible = false;
                        }}
                        placeholder="Search..."
                        class="input input-bordered input-sm w-full pr-16" />
                    {#if requestPendingStates.globalSearch.loading || requestPendingStates.globalSearch.visible}
                        <button
                            id="btnGlobalSearchId"
                            transition:fly={{ x: 10, duration: 250 }}
                            class:loading={requestPendingStates.globalSearch.loading}
                            class="btn btn-primary btn-sm absolute top-0 right-0 mr-0 rounded-l-none"
                            on:click={async () => {
                                if (isLoading) {
                                    return;
                                }
                                requestPendingStates.globalSearch.visible = true;
                                await handleGeneralStates("globalSearch");
                                requestPendingStates.globalSearch.visible = false;
                            }}>
                            <span class:hidden={requestPendingStates.globalSearch.loading}>
                                <Fa icon={faMagnifyingGlass} size="1.1x" />
                            </span>
                        </button>
                    {/if}
                </div>
            </div>
        {/if}
        {#if enableRefresh === true}
            <button
                class="btn btn-sm my-auto ml-auto mt-[1px] before:mr-0 lg:ml-0"
                class:loading={requestPendingStates.refresh.loading}
                on:click={async () => {
                    if (isLoading) {
                        return;
                    }
                    await resetPostBody();
                    await handleGeneralStates("refresh");
                }}>
                <span class:hidden={requestPendingStates.refresh.loading}>
                    <Fa icon={faTimes} size="1.1x" />
                </span>
            </button>
        {/if}
        <div class="hidden lg:ml-auto lg:flex">
            {#if Object.keys(multiSelectActions).length > 0 && Object.values(selectedRows).some((value) => value === true)}
                <span class="mr-2 ">
                    <Dropdown
                        dropDownText="Options"
                        dropDownOptions={multiSelectActions}
                        on:optionSelected={(params) => handleMultiSelect(params)} />
                </span>
            {/if}
            {#if enableFilters}
                <button on:click={() => (showFilters = !showFilters)} class="btn btn-link btn-xs my-auto mr-2">
                    <span class:hidden={showFilters}>Show Filters</span>
                    <span class:hidden={!showFilters}>Hide Filters</span>
                </button>
            {/if}
            <div class="my-auto ml-auto flex flex-row">
                <span class="badge my-auto mr-2 border-base-300 bg-base-300 text-base-content"
                    >{totalCount !== undefined ? totalCount : "Loading"} items</span>

                <div class="btn-group">
                    <button
                        class="btn btn-sm"
                        on:click={async () => {
                            if (postBody.pageNumber >= 1 && !isLoading) {
                                await handlePaginate(postBody.pageNumber - 1);
                            }
                        }}
                        >«
                    </button>
                    <Dropdown
                        dropDownText="Page {postBody.pageNumber + 1}"
                        dropDownOptions={paginationOptions}
                        btnClasses="rounded-none"
                        on:optionSelected={async (params) =>
                            await handlePaginate(parseInt(params.detail.params.pageNumber))} />
                    <button
                        class="btn btn-sm"
                        on:click={async () => {
                            if (postBody.pageNumber < totalPagesCount - 1 && !isLoading) {
                                await handlePaginate(postBody.pageNumber + 1);
                            }
                        }}
                        >»
                    </button>
                </div>
            </div>
        </div>
        <div class="relative top-[-1px] lg:hidden">
            {#if Object.keys(multiSelectActions).length > 0 && Object.values(selectedRows).some((value) => value === true)}
                <Dropdown
                    dropDownIcon={faBars}
                    dropDownText=""
                    dropDownOptions={multiSelectActions}
                    dropdownClasses={"ml-2"}
                    on:optionSelected={(params) => handleMultiSelect(params)} />
            {/if}
        </div>
    </div>
    <!-- #endregion -->

    <!-- #region Table -->
    <div class="w-full overflow-x-auto">
        <table class="table-zebra table w-full border-base-300" style="min-width: {tableMinWidth};">
            <thead>
                <tr class="child:bg-base-300">
                    {#if enableMultiSelect === true}
                        <th
                            class="text-center align-middle"
                            style="width:{multiActionsColumnWidth}%; min-width:{multiActionsColumnMinWidth}%;">
                            <label>
                                <input
                                    bind:checked={allSelected}
                                    disabled={isLoading}
                                    on:change={(event) => updateSelected(event.target.checked)}
                                    type="checkbox"
                                    class="checkbox checkbox-sm relative top-[-1px]" />
                            </label>
                        </th>
                    {/if}

                    {#each Object.entries(columns) as [columnName, columnInfo]}
                        <th
                            class="align-top"
                            style="width: {columns[columnName].width}%; 
                                min-width: {columns[columnName].minWidth}; 
                                max-width:calc({columns[columnName].maxWidth} - 2rem);">
                            <button
                                on:click={async () => handleSortBy(columnName)}
                                class="btn btn-link  btn-xs pl-0 text-base-content"
                                class:py-0={!showFilters}
                                class:text-success={sortBy === columnName}>
                                <span class="inline-block align-middle" class:mr-2={sortBy === columnName}>
                                    {columnName}
                                </span>
                                <span class="inline-block align-middle" class:hidden={sortBy !== columnName}>
                                    <Fa
                                        icon={faAngleDown}
                                        size="1.4x"
                                        rotate={rotateDegrees[postBody.columns[columnName].isSortAscending ? 1 : 0]} />
                                </span>
                            </button>

                            {#if columnInfo.hasOwnProperty("filterBy")}
                                {#each Object.entries(columnInfo.filterBy) as [filterName, filterInfo]}
                                    <div class:hidden={!showFilters} class="mt-1 transition-all">
                                        <div class="form-control my-auto">
                                            <div class="relative flex">
                                                {#if filterInfo.hasOwnProperty("label")}
                                                    <span class="mt-1 w-9 capitalize">
                                                        {filterInfo.label}
                                                    </span>
                                                {/if}
                                                {#if filterName === "filterText"}
                                                    <input
                                                        type="text"
                                                        bind:value={postBody.columns[columnName].filterBy[filterName]}
                                                        on:keypress={async (event) => {
                                                            if (event.keyCode === 13) {
                                                                await handleFilterBy(columnName, filterName);
                                                            }
                                                        }}
                                                        on:change={async () => {
                                                            await handleFilterBy(columnName, filterName);
                                                        }}
                                                        on:focus={(event) => {
                                                            event.target.select();
                                                            requestPendingStates.filters[columnName][
                                                                filterName
                                                            ].visible = true;
                                                        }}
                                                        on:blur={(event) => {
                                                            if (
                                                                event.relatedTarget !== null &&
                                                                event.relatedTarget.id ===
                                                                    "btn" + columnName + filterName + "Id"
                                                            ) {
                                                                return;
                                                            }

                                                            requestPendingStates.filters[columnName][
                                                                filterName
                                                            ].visible = false;
                                                        }}
                                                        placeholder={filterInfo.placeholder}
                                                        class="input input-bordered input-xs mb-0 w-full grow " />
                                                {:else if filterName === "filterNumber"}
                                                    <input
                                                        type="text"
                                                        bind:value={postBody.columns[columnName].filterBy[filterName]}
                                                        on:keypress={async (event) => {
                                                            disableNonNumericInput(event);
                                                            if (event.keyCode === 13) {
                                                                await handleFilterBy(columnName, filterName);
                                                            }
                                                        }}
                                                        on:change={async () => {
                                                            await handleFilterBy(columnName, filterName);
                                                        }}
                                                        on:focus={(event) => {
                                                            event.target.select();
                                                            requestPendingStates.filters[columnName][
                                                                filterName
                                                            ].visible = true;
                                                        }}
                                                        on:blur={(event) => {
                                                            if (
                                                                event.relatedTarget !== null &&
                                                                event.relatedTarget.id ===
                                                                    "btn" + columnName + filterName + "Id"
                                                            ) {
                                                                return;
                                                            }

                                                            requestPendingStates.filters[columnName][
                                                                filterName
                                                            ].visible = false;
                                                        }}
                                                        placeholder={filterInfo.placeholder}
                                                        class="input input-bordered input-xs mb-0 w-full grow" />
                                                {:else if filterName === "filterDropdown"}
                                                    <select
                                                        bind:value={postBody.columns[columnName].filterBy[filterName]}
                                                        on:change={async () => {
                                                            await handleFilterBy(columnName, filterName);
                                                        }}
                                                        class="select select-bordered select-xs mb-0 grow pr-8">
                                                        <option selected>{filterInfo.placeholder}</option>
                                                        {#each filterInfo.defaultOptions as value}
                                                            <option {value}>{value}</option>
                                                        {/each}
                                                    </select>
                                                {:else if filterName === "fromDate" || filterName === "toDate"}
                                                    <input
                                                        type="date"
                                                        bind:value={postBody.columns[columnName].filterBy[filterName]}
                                                        on:change={async () => {
                                                            await handleFilterBy(columnName, filterName);
                                                        }}
                                                        on:focus={(event) => {
                                                            event.target.select();
                                                            requestPendingStates.filters[columnName][
                                                                filterName
                                                            ].visible = true;
                                                        }}
                                                        class="input input-xs mb-0 grow"
                                                        placeholder={filterInfo.placeholder} />{/if}
                                                {#if ["fromDate", "toDate", "filterDropdown"].includes(filterName)}
                                                    {#if requestPendingStates.filters[columnName][filterName].loading}
                                                        <button
                                                            id="btn{columnName + filterName}Id"
                                                            transition:fly={{ x: 8, duration: 250 }}
                                                            class:loading={requestPendingStates.filters[columnName][
                                                                filterName
                                                            ].loading}
                                                            class="btn btn-primary btn-xs absolute top-0 right-0 mr-0 rounded-l-none before:mr-0"
                                                            on:click={async () => {
                                                                requestPendingStates.filters[columnName][
                                                                    filterName
                                                                ].visible = true;
                                                                await handleFilterBy(columnName, filterName);
                                                                requestPendingStates.filters[columnName][
                                                                    filterName
                                                                ].visible = false;
                                                            }}>
                                                            <span
                                                                class:hidden={requestPendingStates.filters[columnName][
                                                                    filterName
                                                                ].loading}>
                                                                <Fa icon={faCheck} size="1.1x" />
                                                            </span>
                                                        </button>
                                                    {/if}
                                                {:else if requestPendingStates.filters[columnName][filterName].visible}
                                                    <button
                                                        id="btn{columnName + filterName}Id"
                                                        transition:fly={{ x: 8, duration: 250 }}
                                                        class:loading={requestPendingStates.filters[columnName][
                                                            filterName
                                                        ].loading}
                                                        class="btn btn-primary btn-xs absolute top-0 right-0 mr-0 rounded-l-none before:mr-0"
                                                        on:click={async () => {
                                                            requestPendingStates.filters[columnName][
                                                                filterName
                                                            ].visible = true;
                                                            await handleFilterBy(columnName, filterName);
                                                            requestPendingStates.filters[columnName][
                                                                filterName
                                                            ].visible = false;
                                                        }}>
                                                        <span
                                                            class:hidden={requestPendingStates.filters[columnName][
                                                                filterName
                                                            ].loading}>
                                                            <Fa icon={faCheck} size="1.1x" />
                                                        </span>
                                                    </button>
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            {/if}
                        </th>
                    {/each}

                    {#if Object.keys(customActions).length > 1}
                        <th
                            class="text-center align-top"
                            style="width:{customActionsColumnWidth}%; min-width:{customActionsColumnMinWidth}%;">
                            <span class="inline-block">
                                <span class="mr-2 inline-block align-middle">
                                    {customActions.columnHeading}
                                </span>
                            </span>
                        </th>
                    {/if}
                </tr>
            </thead>

            <tbody>
                {#if !isLoading}
                    {#each currentPage as row}
                        <tr
                            class="group"
                            on:click={(event) => {
                                if (clickableColumn === undefined) {
                                    handleRowClick(event, row.id);
                                }
                            }}>
                            {#if enableMultiSelect === true}
                                <th
                                    class="text-center align-middle group-hover:bg-base-300 {clickableColumn ===
                                    undefined
                                        ? 'group-hover:cursor-pointer'
                                        : ''}"
                                    style="width:{multiActionsColumnWidth}%; min-width:{multiActionsColumnMinWidth}%;">
                                    <label>
                                        <input
                                            on:click={(event) => {
                                                event.stopPropagation();
                                            }}
                                            on:change={(event) => {
                                                if (!event.target.checked) {
                                                    allSelected = false;
                                                }
                                            }}
                                            bind:checked={selectedRows[row.id]}
                                            type="checkbox"
                                            class="checkbox checkbox-sm relative top-[-1px] align-middle" />
                                    </label>
                                </th>
                            {/if}
                            {#each Object.entries(row) as [columnName, columnValue]}
                                {#if columnName !== "id"}
                                    {#if columnName === clickableColumn}
                                        <td
                                            class="overflow-hidden group-hover:bg-base-300 {clickableColumn ===
                                            undefined
                                                ? 'group-hover:cursor-pointer'
                                                : ''}"
                                            style="width: {columns[columnName].width}%; 
                                                min-width: {columns[columnName].minWidth}; 
                                                max-width: calc({columns[columnName].maxWidth});">
                                            <span
                                                class="text-nowrap inline-block overflow-hidden overflow-ellipsis"
                                                style="max-width:calc(100% - 2rem);">
                                                <button
                                                    on:click={(event) => handleRowClick(event, row.id)}
                                                    class="btn btn-link btn-xs text-base-content  underline">
                                                    {columnValue}
                                                </button>
                                            </span>
                                        </td>
                                    {:else}
                                        <td
                                            class="overflow-hidden group-hover:bg-base-300 {clickableColumn ===
                                            undefined
                                                ? 'group-hover:cursor-pointer'
                                                : ''}"
                                            style="width: {columns[columnName].width}%; 
                                            min-width: {columns[columnName].minWidth}; 
                                            max-width: calc({columns[columnName].maxWidth});">
                                            <div
                                                class="text-nowrap inline-block  overflow-hidden overflow-ellipsis align-middle"
                                                style="max-width:calc(100% - 2rem);">
                                                {@html columnValue}
                                            </div>
                                        </td>
                                    {/if}
                                {/if}
                            {/each}

                            {#if Object.keys(customActions).length > 1}
                                <td
                                    class="text-center group-hover:bg-base-300 {clickableColumn === undefined
                                        ? 'group-hover:cursor-pointer'
                                        : ''}"
                                    style="width:{customActionsColumnWidth}%; min-width:{customActionsColumnMinWidth}%;">
                                    <div class="flex justify-center align-middle">
                                        {#each customActions.actions as action}
                                            <button
                                                class="btn btn-xs mr-1 flex-nowrap {action.btnClasses}"
                                                on:click={(event) =>
                                                    handleCustomActionClick(event, action.clickEvent, row.id)}>
                                                {#if action.faIcon === "faEye"}
                                                    <Fa icon={faEye} size="1.1x" />
                                                {:else if action.faIcon === "faTrash"}
                                                    <Fa icon={faTrash} size="1.1x" />
                                                {:else if action.faIcon === "faEdit"}
                                                    <Fa icon={faEdit} size="1.1x" />
                                                {/if}

                                                {#if action.hasOwnProperty("displayLabel")}
                                                    <span class="ml-1">{action.displayLabel}</span>
                                                {/if}
                                            </button>
                                        {/each}
                                    </div>
                                </td>
                            {/if}
                        </tr>
                    {/each}
                {:else}
                    {#each Array(parseInt(postBody.itemsPerPage)) as _, index}
                        <tr class="group">
                            {#if enableMultiSelect === true}
                                <th
                                    class="animate-pulse text-center align-middle"
                                    style="width:{multiActionsColumnWidth}%; min-width:{multiActionsColumnMinWidth}%;">
                                    <label>
                                        <input
                                            type="checkbox"
                                            class="checkbox checkbox-sm relative top-[-1px] align-middle"
                                            disabled />
                                    </label>
                                </th>
                            {/if}

                            {#each Object.entries(columns) as [columnName, columnValue]}
                                {#if columnName !== "id"}
                                    {#if clickableColumn !== undefined && columnName === clickableColumn}
                                        <td
                                            class="animate-pulse"
                                            style="width: {columns[columnName].width}%; 
                                                min-width: {columns[columnName].minWidth}; 
                                                max-width: calc({columns[columnName].maxWidth} - 2rem);">
                                            <button
                                                class="btn btn-link btn-xs bg-opacity-100 text-base-content text-opacity-50 underline hover:cursor-default" />
                                        </td>
                                    {:else}
                                        <td
                                            class="animate-pulse text-center text-base-content text-opacity-50"
                                            style="width: {columns[columnName].width}%; 
                                                min-width: {columns[columnName].minWidth}; 
                                                max-width: calc({columns[columnName].maxWidth} - 2rem);">
                                            <div
                                                class="text-nowrap inline-block overflow-hidden rounded-lg border-opacity-50 bg-base-300 bg-opacity-100 align-middle text-transparent"
                                                style="width: calc(100%);">
                                                Loading...
                                            </div>
                                        </td>
                                    {/if}
                                {/if}
                            {/each}

                            {#if Object.keys(customActions).length > 1}
                                <td
                                    class="animate-pulse text-center"
                                    style="width:{customActionsColumnWidth}%; min-width:{customActionsColumnMinWidth}%;">
                                    <div class="flex justify-center align-middle">
                                        {#each customActions.actions as action}
                                            <button
                                                class="btn btn-ghost btn-xs relative mr-1 flex-nowrap justify-center bg-base-300 bg-opacity-100 text-transparent">
                                                {#if action.faIcon === "faEye"}
                                                    <Fa icon={faEye} size="1.1x" />
                                                {:else if action.faIcon === "faTrash"}
                                                    <Fa icon={faTrash} size="1.1x" />
                                                {:else if action.faIcon === "faEdit"}
                                                    <Fa icon={faEdit} size="1.1x" />
                                                {/if}

                                                {#if action.hasOwnProperty("displayLabel")}
                                                    <span class="ml-1">{action.displayLabel}</span>
                                                {/if}
                                            </button>
                                        {/each}
                                    </div>
                                </td>
                            {/if}
                        </tr>
                    {/each}
                {/if}
            </tbody>

            {#if Object.keys(columns).length !== 0}
                <tfoot>
                    <tr class="child:bg-base-300">
                        {#if enableMultiSelect}
                            <th />
                        {/if}
                        {#each Object.entries(columns) as [columnName, columnValue]}
                            <th>{columnName}</th>
                        {/each}
                        {#if Object.keys(customActions).length > 1}
                            <th class="text-center"> {customActions.columnHeading} </th>
                        {/if}
                    </tr>
                </tfoot>
            {/if}
        </table>
    </div>
    <!-- #endregion -->

    <!-- #region Bottom Buttons -->
    <div class="xs:hidden">
        <div class="mx-auto mt-2">
            <div class="btn-group justify-center">
                <button
                    class="btn btn-sm"
                    on:click={async () => {
                        if (postBody.pageNumber >= 1) {
                            await handlePaginate(postBody.pageNumber - 1);
                        }
                    }}
                    >«
                </button>
                <Dropdown
                    dropDownText="Page {postBody.pageNumber + 1}"
                    dropDownOptions={paginationOptions}
                    dropdownClasses="dropdown-top"
                    btnClasses="rounded-none"
                    on:optionSelected={async (params) =>
                        await handlePaginate(parseInt(params.detail.params.pageNumber))} />
                <button
                    class="btn btn-sm"
                    on:click={async () => {
                        if (postBody.pageNumber < totalPagesCount - 1) {
                            await handlePaginate(postBody.pageNumber + 1);
                        }
                    }}
                    >»
                </button>
            </div>
        </div>
        <div class="mx-auto mt-2">
            <div class="flex justify-center">
                <div class="btn btn-sm" class:hidden={editingLimit} on:click={() => (editingLimit = true)}>
                    Items per Page: {postBody.itemsPerPage}
                </div>
                <div class="form-control w-36" class:hidden={!editingLimit}>
                    <div class="relative">
                        <input
                            bind:value={postBody.itemsPerPage}
                            on:keypress={async (event) => {
                                disableNonNumericInput(event);
                                if (event.keyCode === 13) {
                                    await handleGeneralStates("editLimit");
                                }
                            }}
                            on:blur={(event) => {
                                if (event.relatedTarget !== null && event.relatedTarget.id === "btnEditLimitId") {
                                    return;
                                }

                                requestPendingStates.editLimit.visible = false;
                            }}
                            type="text"
                            on:focus={(event) => {
                                event.target.select();
                                requestPendingStates.editLimit.visible = true;
                            }}
                            placeholder="25"
                            class="input input-bordered input-sm w-full pr-16" />
                        {#if requestPendingStates.editLimit.loading || requestPendingStates.editLimit.visible}
                            <button
                                id="btnEditLimitId"
                                class="btn btn-primary btn-sm absolute top-0 right-0 rounded-l-none before:mr-0"
                                class:loading={requestPendingStates.editLimit.loading}
                                transition:fly={{ x: 10, duration: 250 }}
                                on:click={async () => {
                                    await handleGeneralStates("editLimit");
                                    editingLimit = false;
                                }}>
                                <span class:hidden={requestPendingStates.editLimit.loading}>
                                    <Fa icon={faCheck} size="1.1x" />
                                </span>
                            </button>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="mt-2 hidden w-full xs:flex xs:justify-between">
        <div class="mr-auto">
            <div class="btn btn-sm" class:hidden={editingLimit} on:click={() => (editingLimit = true)}>
                Items per Page: {postBody.itemsPerPage}
            </div>
            <div class="form-control w-36" class:hidden={!editingLimit}>
                <div class="relative">
                    <input
                        bind:value={postBody.itemsPerPage}
                        on:keypress={async (event) => {
                            disableNonNumericInput(event);
                            if (event.keyCode === 13) {
                                await handleGeneralStates("editLimit");
                            }
                        }}
                        on:blur={(event) => {
                            if (event.relatedTarget !== null && event.relatedTarget.id === "btnEditLimitId") {
                                return;
                            }

                            requestPendingStates.editLimit.visible = false;
                        }}
                        type="text"
                        on:focus={(event) => {
                            event.target.select();
                            requestPendingStates.editLimit.visible = true;
                        }}
                        placeholder="25"
                        class="input input-bordered input-sm w-full pr-16" />
                    {#if requestPendingStates.editLimit.loading || requestPendingStates.editLimit.visible}
                        <button
                            id="btnEditLimitId"
                            class="btn btn-primary btn-sm absolute top-0 right-0 rounded-l-none before:mr-0"
                            class:loading={requestPendingStates.editLimit.loading}
                            transition:fly={{ x: 10, duration: 250 }}
                            on:click={async () => {
                                await handleGeneralStates("editLimit");
                                editingLimit = false;
                            }}>
                            <span class:hidden={requestPendingStates.editLimit.loading}>
                                <Fa icon={faCheck} size="1.1x" />
                            </span>
                        </button>
                    {/if}
                </div>
            </div>
        </div>
        <div class="btn-group ml-auto">
            <button
                class="btn btn-sm"
                on:click={async () => {
                    if (postBody.pageNumber >= 1) {
                        await handlePaginate(postBody.pageNumber - 1);
                    }
                }}
                >«
            </button>
            <Dropdown
                dropDownText="Page {postBody.pageNumber + 1}"
                dropDownOptions={paginationOptions}
                dropdownClasses="dropdown-top"
                btnClasses="rounded-none"
                on:optionSelected={async (params) => await handlePaginate(parseInt(params.detail.params.pageNumber))} />
            <button
                class="btn btn-sm"
                on:click={async () => {
                    if (postBody.pageNumber < totalPagesCount - 1) {
                        await handlePaginate(postBody.pageNumber + 1);
                    }
                }}
                >»
            </button>
        </div>
    </div>
    <!-- #endregion  -->
</div>
