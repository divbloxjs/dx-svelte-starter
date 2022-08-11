<script>
    import { onMount, beforeUpdate } from "svelte";
    import { disableNonNumericInput, sleep } from "$src/lib/js/utilities/helpers";
    import Dropdown from "$base_components/data-series/ui-elements/dropdown.svelte";
    import { createEventDispatcher } from "svelte";
    import Fa from "svelte-fa";
    import {
        faAngleDown,
        faEdit,
        faEye,
        faTrash,
        faCheck,
        faMagnifyingGlass,
        faTimes,
        faFileCsv,
        faFileExcel,
        faFileText,
        faBars,
    } from "@fortawesome/free-solid-svg-icons/index.es";

    export let dataSource;
    export let itemsPerPage = 10;
    export let pageNumber = 0;

    export let enableMultiSelect = true;
    export let enableGlobalSearch = true;
    export let enableRefresh = true;
    export let enableFilters = false;
    export let showFilters = false;
    export let clickableColumn = undefined;

    export let columns = undefined;
    export let customActions = {};
    export let multiSelectActions = [];

    const dispatch = createEventDispatcher();
    const actionTriggered = (params) => {
        dispatch("actionTriggered", params);
    };

    let postBody = {};

    const requestPendingStates = {
        globalSearch: false,
        editLimit: false,
        refresh: false,
        filters: {}, // Populated dynamically based on incoming data
    };

    onMount(async () => {
        await refreshDataTable();
    });

    let initComplete = false;
    beforeUpdate(async () => {
        if (!initComplete) {
            initComplete = true;
            await initPostBody();
        }
    });

    const initPostBody = async () => {
        if (dataSource === undefined) {
            throw Error("dataSource has not been provided");
        }
        if (columns === undefined) {
            throw Error("dataSource has not been provided");
        }
        postBody.limit = itemsPerPage;
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

                    requestPendingStates.filters[columnName][filterName] = false;
                }
            }
        }

        if (!enableFilters) {
            showFilters = false;
        }
    };

    onMount(async () => {
        await refreshDataTable();
    });

    const handleGeneralStates = async (type) => {
        if (isLoading) {
            return;
        }
        requestPendingStates[type] = true;
        await refreshDataTable();
        requestPendingStates[type] = false;
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
        requestPendingStates.filters[columnName][filterName] = true;
        await refreshDataTable();
        requestPendingStates.filters[columnName][filterName] = false;
    };

    let isLoading = false;
    const refreshDataTable = async () => {
        isLoading = true;
        await sleep(() => {}, 1000);
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
        currentPage = currentPage.splice(postBody.pageNumber * postBody.limit, postBody.limit);
        currentPage.forEach((row) => {
            selectedRows[row.id] = false;
        });

        totalCount = data.count;
        pageCount = Math.ceil(totalCount / postBody.limit);

        paginationOptions = buildPaginationOptions();
        isLoading = false;
    };

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

    //#region Pagination
    let pageCount;
    const buildPaginationOptions = () => {
        const options = Array.from(Array(pageCount).keys()).map((_, index) => {
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
</script>

<div class="mb-2 mt-10 flex w-full lg:hidden">
    {#if enableFilters}
        <div class="my-auto">
            <button on:click={() => (showFilters = !showFilters)} class="btn btn-link btn-xs my-auto mr-2">
                <span class:hidden={showFilters}>Show Filters</span>
                <span class:hidden={!showFilters}>Hide Filters</span>
            </button>
        </div>
    {/if}
    <div class="my-auto ml-auto flex flex-row">
        <span class="badge my-auto mr-2 border-base-300 bg-base-300 text-base-content"
            >{totalCount !== undefined ? totalCount : "... "} items</span>

        <div class="btn-group mr-2">
            <button
                class="btn btn-sm"
                on:click={async () => {
                    if (postBody.pageNumber >= 1 && !isLoading) {
                        await handlePaginate(postBody.pageNumber - 1);
                    }
                }}>«</button>
            <Dropdown
                dropDownText="Page {postBody.pageNumber + 1}"
                dropDownOptions={paginationOptions}
                btnClasses="rounded-none"
                on:optionSelected={async (params) => await handlePaginate(parseInt(params.detail.params.pageNumber))} />
            <button
                class="btn btn-sm"
                on:click={async () => {
                    if (postBody.pageNumber < pageCount - 1 && !isLoading) {
                        await handlePaginate(postBody.pageNumber + 1);
                    }
                }}>»</button>
        </div>
    </div>
</div>
<div class="mb-2 flex w-full">
    {#if enableGlobalSearch === true}
        <div class="form-control my-auto mx-2 w-80 lg:w-80">
            <div class="relative -mb-2">
                <input
                    type="text"
                    bind:value={postBody.globalSearchText}
                    on:keypress={async (event) => {
                        if (event.keyCode === 13) {
                            await handleGeneralStates("globalSearch");
                        }
                    }}
                    on:change={async () => {
                        await handleGeneralStates("globalSearch");
                    }}
                    on:focus={(event) => event.target.select()}
                    placeholder="Search..."
                    class="input input-bordered input-sm w-full pr-16" />
                <button
                    class:loading={requestPendingStates.globalSearch}
                    class="btn btn-primary btn-sm absolute top-0 right-0 mr-0 rounded-l-none"
                    on:click={async () => {
                        await handleGeneralStates("globalSearch");
                    }}>
                    <span class:hidden={requestPendingStates.globalSearch}>
                        <Fa icon={faMagnifyingGlass} size="1.1x" />
                    </span>
                </button>
            </div>
        </div>
    {/if}
    {#if enableRefresh === true}
        <button
            class="btn btn-sm my-auto ml-auto mr-2 before:mr-0 lg:ml-0 lg:mr-auto"
            class:loading={requestPendingStates.refresh}
            on:click={async () => {
                if (isLoading) {
                    return;
                }
                await resetPostBody();
                await handleGeneralStates("refresh");
            }}>
            <span class:hidden={requestPendingStates.refresh}>
                <Fa icon={faTimes} size="1.1x" />
            </span>
        </button>
    {/if}
    <div class="hidden lg:flex">
        {#if enableFilters}
            <button on:click={() => (showFilters = !showFilters)} class="btn btn-link btn-xs my-auto mr-2">
                <span class:hidden={showFilters}>Show Filters</span>
                <span class:hidden={!showFilters}>Hide Filters</span>
            </button>
        {/if}

        {#if Object.keys(multiSelectActions).length > 0 && Object.values(selectedRows).some((value) => value === true)}
            <span class="mr-2">
                <Dropdown
                    dropDownText="Options"
                    dropDownOptions={multiSelectActions}
                    on:optionSelected={(params) => handleMultiSelect(params)} />
            </span>
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
                    }}>«</button>
                <Dropdown
                    dropDownText="Page {postBody.pageNumber + 1}"
                    dropDownOptions={paginationOptions}
                    btnClasses="rounded-none"
                    on:optionSelected={async (params) =>
                        await handlePaginate(parseInt(params.detail.params.pageNumber))} />
                <button
                    class="btn btn-sm"
                    on:click={async () => {
                        if (postBody.pageNumber < pageCount - 1 && !isLoading) {
                            await handlePaginate(postBody.pageNumber + 1);
                        }
                    }}>»</button>
            </div>
        </div>
    </div>
    <div class="mr-2 lg:hidden">
        {#if Object.keys(multiSelectActions).length > 0 && Object.values(selectedRows).some((value) => value === true)}
            <Dropdown
                dropDownIcon={faBars}
                dropDownText=""
                dropDownOptions={multiSelectActions}
                on:optionSelected={(params) => handleMultiSelect(params)} />
        {/if}
    </div>
</div>

<div class="w-full overflow-x-auto">
    <table class="table-zebra table w-full">
        <thead>
            <tr class="child:bg-base-300">
                {#if enableMultiSelect === true}
                    <th class="align-middle">
                        <label class="text-center">
                            <input
                                bind:checked={allSelected}
                                disabled={isLoading}
                                on:change={(event) => updateSelected(event.target.checked)}
                                type="checkbox"
                                class="checkbox checkbox-sm" />
                        </label>
                    </th>
                {/if}

                {#each Object.entries(columns) as [columnName, columnInfo]}
                    <th class="min-w-[150px] align-top">
                        <button
                            on:click={async () => handleSortBy(columnName)}
                            class="btn btn-ghost btn-xs"
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
                                    <div class="form-control my-auto mr-2">
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
                                                    on:focus={(event) => event.target.select()}
                                                    placeholder={filterInfo.placeholder}
                                                    class="input input-bordered input-xs mb-0 grow pr-8" />
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
                                                    on:focus={(event) => event.target.select()}
                                                    placeholder={filterInfo.placeholder}
                                                    class="input input-bordered input-xs mb-0 grow pr-8" />
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
                                                    class="input input-xs mb-0 grow pr-8 transition-all"
                                                    placeholder={filterInfo.placeholder} />{/if}
                                            <button
                                                class:loading={requestPendingStates.filters[columnName][filterName]}
                                                class="btn btn-primary btn-xs absolute top-0 right-0 mr-0 rounded-l-none before:mr-0"
                                                on:click={async () => {
                                                    await handleFilterBy(columnName, filterName, false);
                                                }}>
                                                <span
                                                    class:hidden={requestPendingStates.filters[columnName][filterName]}>
                                                    <Fa icon={faCheck} size="1.1x" />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        {/if}
                    </th>
                {/each}

                {#if Object.keys(customActions).length > 1}
                    <th class="text-center align-middle">
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
                                class="text-center group-hover:bg-base-300 {clickableColumn === undefined
                                    ? 'group-hover:cursor-pointer'
                                    : ''}">
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
                                        class="checkbox checkbox-sm align-middle" />
                                </label>
                            </th>
                        {/if}
                        {#each Object.entries(row) as [columnName, columnValue]}
                            {#if columnName !== "id"}
                                {#if columnName === clickableColumn}
                                    <td
                                        class="min-w-[150px] group-hover:bg-base-300 {clickableColumn === undefined
                                            ? 'group-hover:cursor-pointer'
                                            : ''}">
                                        <button
                                            on:click={(event) => handleRowClick(event, row.id)}
                                            class="btn btn-link btn-xs text-base-content  underline">
                                            {columnValue}
                                        </button>
                                    </td>
                                {:else}
                                    <td
                                        class="min-w-[150px] group-hover:bg-base-300 {clickableColumn === undefined
                                            ? 'group-hover:cursor-pointer'
                                            : ''}">
                                        {columnValue}
                                    </td>
                                {/if}
                            {/if}
                        {/each}

                        {#if Object.keys(customActions).length > 1}
                            <td
                                class="group-hover:bg-base-300  {clickableColumn === undefined
                                    ? 'group-hover:cursor-pointer'
                                    : ''}">
                                {#each customActions.actions as action}
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
                                            <span class="ml-1">{action.displayLabel}</span>
                                        {/if}
                                    </button>
                                {/each}
                            </td>
                        {/if}
                    </tr>
                {/each}
            {:else}
                {#each Array(postBody.limit) as _, index}
                    <tr class="group">
                        {#if enableMultiSelect === true}
                            <th class="animate-pulse">
                                <label>
                                    <input type="checkbox" class="aling-middle checkbox checkbox-sm" disabled />
                                </label>
                            </th>
                        {/if}
                        {#each Object.entries(columns) as [columnName, columnValue]}
                            {#if columnName !== "id"}
                                {#if clickableColumn !== undefined && columnName === clickableColumn}
                                    <td class="min-w-[150px] animate-pulse">
                                        <button
                                            class="btn btn-link btn-xs animate-pulse bg-opacity-50 text-base-content text-opacity-50 underline hover:cursor-default" />
                                    </td>
                                {:else}
                                    <td class="min-w-[150px] animate-pulse text-base-content text-opacity-50">
                                        <span
                                            class="mr-1 w-[150px] rounded-lg border-opacity-50  bg-base-300 bg-opacity-50 text-transparent"
                                            >Loading...</span>
                                    </td>
                                {/if}
                            {/if}
                        {/each}

                        {#if Object.keys(customActions).length > 1}
                            <td class="animate-pulse">
                                {#each customActions.actions as action}
                                    <span
                                        class="mr-1 rounded-lg border-opacity-50 bg-base-300 bg-opacity-50 text-transparent">
                                        aaa
                                    </span>
                                {/each}
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

<div class="mt-3 flex w-full">
    <div class="mr-auto">
        <div class="btn btn-sm" class:hidden={editingLimit} on:click={() => (editingLimit = true)}>
            Items per Page: {postBody.limit}
        </div>
        <div class="form-control w-36" class:hidden={!editingLimit}>
            <div class="relative mt-[1px]">
                <input
                    on:keypress={async (event) => {
                        disableNonNumericInput(event);
                        if (event.keyCode === 13) {
                            await handleGeneralStates("editLimit");
                        }
                    }}
                    bind:value={postBody.limit}
                    type="text"
                    on:focus={(event) => event.target.select()}
                    placeholder="25"
                    class="input input-bordered input-sm w-full pr-16" />
                <button
                    class="btn btn-primary btn-sm absolute top-0 right-0 rounded-l-none before:mr-0"
                    class:loading={requestPendingStates.editLimit}
                    on:click={async () => {
                        await handleGeneralStates("editLimit");
                        editingLimit = false;
                    }}>
                    <span class:hidden={requestPendingStates.editLimit}>
                        <Fa icon={faCheck} size="1.1x" />
                    </span>
                </button>
            </div>
        </div>
    </div>

    <div class="ml-auto">
        <div class="btn-group">
            <button
                class="btn btn-sm"
                on:click={async () => {
                    if (postBody.pageNumber >= 1) {
                        await handlePaginate(postBody.pageNumber - 1);
                    }
                }}>«</button>
            <Dropdown
                dropDownText="Page {postBody.pageNumber + 1}"
                dropDownOptions={paginationOptions}
                dropdownClasses="dropdown-top"
                btnClasses="rounded-none"
                on:optionSelected={async (params) => await handlePaginate(parseInt(params.detail.params.pageNumber))} />
            <button
                class="btn btn-sm"
                on:click={async () => {
                    if (postBody.pageNumber < pageCount - 1) {
                        await handlePaginate(postBody.pageNumber + 1);
                    }
                }}>»</button>
        </div>
    </div>
</div>

<style>
    thead > tr > th:not(:first-child) {
        vertical-align: top;
    }

    tr td:last-child {
        width: 1%;
        white-space: nowrap;
    }
    tr th:first-child {
        width: 1%;
        white-space: nowrap;
    }
</style>
