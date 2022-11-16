<script>
    import { beforeUpdate, createEventDispatcher } from "svelte";
    import Fa from "svelte-fa";
    import Dropdown from "$src/base_components/data-series/ui-elements/dropdown.svelte";
    import { errorToast, successToast } from "$src/lib/js/utilities/swalMixins";
    import noImagePath from "$src/assets/images/no_image.svg";

    /**
     * Path to the default image that will be displayed if imageUrl is invalid
     * @type {string}
     */
    export let defaultImagePath = noImagePath;

    /**
     * The row data obejct to be rendered
     * @type {Object}
     */
    export let rowData = {};

    /**
     * @typedef additionalRowProps
     * @type {object}
     * @property {string} categoryUpdateEndpoint The endpoint needed to update the category value
     * @property {string} additionalCategoryParams Any additional parameters needed for the category update request
     */

    /**
     * @type {additionalRowProps}
     * @param {{categoryUpdateEndpoint: string, additionalCategoryParams: string}} additionalRowProps Specific row action object
     * @param {string} additionalRowProps.categoryUpdateEndpoint Custom classes to add to the action button
     * @param {string} additionalRowProps.additionalCategoryParams click event to fire off on triggering of the action
     */
    export let additionalRowProps = {
        categoryUpdateEndpoint: "",
        additionalCategoryParams: "",
    };

    /**
     * Data mapping object used to allow any data set to render in the preconfigured setup regardless of naming
     * @type {Object}
     */
    export let rowDataMappingOverride = {};

    /**
     * The default row data mapping. Overridden by rowDataMappingOverride key by key
     * @type {Object}
     */
    let rowDataMapping = {
        imageUrl: "imageUrl",
        rowTitle: "rowTitle",
        rowDescription: "rowDescription",
        rowCategoryName: "rowCategoryName",
        rowCategoryId: "rowCategoryId",
        possibleCategories: "possibleCategories",
    };

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
    export let allowedRowActions;

    /**
     * Whether or not to allow row clicks
     * When true, dispatch("actionTriggered", { clickEvent: "row_clicked", rowId: rowData.id });
     */
    export let clickableRow = true;

    /**
     * Used to load the entire row as a loading state
     * @type {boolean}
     */
    export let showLoadingState = false;

    /**
     * Whether or not to include credentials in the HTTP request
     * @type {"include"|"omit"}
     */
    export let dataSourceIncludeCredentials = "include";

    /**
     * Current row index in the list
     * Used to style rows according to where they are in the list
     * e.g. dropup.dropdown based on proximity to end of list
     * @type {number}
     */
    export let rowIndex; // E.g. 0,1,2,3

    /**
     * Currently displayed list's length
     * Used to style rows according to where they are in the list
     * e.g. dropup.dropdown based on proximity to end of list
     * @type {number}
     */
    export let listLength; // E.g 10

    /**
     * Bound value of the row width in px
     * @type {number}
     */
    let rowWidth;
    let widthSmall = 500;
    let widthMedium = 800;

    /**
     * Value tracking whether the category update request is in progress, if so, keeps the dropdown in loading state
     */
    let rowLoading = false;

    /**
     * @typedef dropdownOption
     * @type {object}
     * @property {Object} params Object of parameters passed on click event
     * @property {string} displayLabel The display label of the option
     * @property {string} clickEvent click event to fire off on triggering of the action
     */

    /**
     * Array of rowAction configuration objects
     * @type {dropdownOption[]}
     * @param {{params: Object, displayLabel: string, clickEvent: string}[]} dropdownOption Specific row action object
     * @param {Object} dropdownOption.params Object of parameters passed on click event
     * @param {string} dropdownOption.displayLabel The display label of the option
     * @param {string} dropdownOption.clickEvent click event to fire off on triggering of the action
     */

    /**
     *
     */
    let possibleCategoriesDropdownOptions = [];

    const dispatch = createEventDispatcher();

    /**
     * Base Endpoint url for updating of the category
     */
    let categoryUpdateEndpoint;

    /**
     * Post body for the category update request
     * @type {Object}
     */
    let additionalCategoryParams;

    let initComplete = false;
    beforeUpdate(async () => {
        if (!initComplete) {
            initComplete = true;
            await initialiseConfig();
        }
    });

    /**
     * Runs once before the first DOM mount, sets up necessary variable objects
     */
    const initialiseConfig = async () => {
        // Override data keys with provided overrides
        Object.keys(rowDataMappingOverride).forEach((defaultRowDataAttribute) => {
            if (rowDataMapping.hasOwnProperty(defaultRowDataAttribute)) {
                rowDataMapping[defaultRowDataAttribute] = rowDataMappingOverride[defaultRowDataAttribute];
            }
        });

        // Check if any provided row actions are not allowed
        rowActions.forEach((rowAction) => {
            if (!Object.keys(allowedRowActions).includes(rowAction.type)) {
                console.error("Unconfigured row action type provided: " + rowAction.type);
            }
        });

        // Build the category dropdown
        possibleCategoriesDropdownOptions = [];
        rowData[rowDataMapping.possibleCategories]?.forEach((role) => {
            possibleCategoriesDropdownOptions.push({
                params: { id: role.id, name: role.name },
                displayLabel: role.name,
                clickEvent: "category_change_clicked",
            });
        });

        // Check and set categoryUpdateEndpoint
        if (!additionalRowProps.hasOwnProperty("categoryUpdateEndpoint")) {
            throw new Error("additionalRowProps.categoryUpdateEndpoint not provided");
        }
        categoryUpdateEndpoint = additionalRowProps.categoryUpdateEndpoint;

        // Check and set additionalCategoryParams
        if (!additionalRowProps.hasOwnProperty("additionalCategoryParams")) {
            throw new Error("additionalRowProps.additionalCategoryParams not provided");
        }
        additionalCategoryParams = additionalRowProps.additionalCategoryParams;
    };

    /**
     * Handles sending out the request to update the row's category by id
     * @param {number} categoryId
     */
    const updateCategory = async (categoryId) => {
        let postBody = {};
        postBody[rowDataMapping.rowCategoryId] = categoryId;

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

    /**
     * State handling for the category change event
     * @param {Object} categoryInfo
     */
    const handleCategoryChange = async (categoryInfo) => {
        rowLoading = true;
        if (await updateCategory(categoryInfo.id)) {
            rowData[rowDataMapping.rowCategoryName] = categoryInfo.name;
        }

        rowLoading = false;
    };
</script>

{#if showLoadingState}
    <li
        bind:clientWidth={rowWidth}
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
        bind:clientWidth={rowWidth}
        class="relative flex w-full items-center justify-between bg-transparent p-4 hover:bg-base-200
    {clickableRow ? 'hover:cursor-pointer' : ''}"
        class:py-2={rowWidth < widthSmall}
        on:click={() => {
            if (clickableRow) {
                dispatch("actionTriggered", { clickEvent: "row_clicked", rowId: rowData.id });
            }
        }}>
        <!-- Divider between rows -->
        {#if rowIndex !== 0}
            <span class="absolute left-0 top-0 h-[1px] w-full bg-base-200" />
        {/if}

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
                            dropDownText={rowData[rowDataMapping.rowCategoryName]}
                            dropDownTextClasses="overflow-hidden overflow-ellipsis  {rowWidth > widthMedium
                                ? 'max-w-[20ch]'
                                : 'max-w-[11ch]'} whitespace-nowrap"
                            dropDownOptions={possibleCategoriesDropdownOptions}
                            dropdownClasses="dropdown-end mr-2 {rowIndex > 2 && rowIndex >= listLength - 2
                                ? 'dropdown-top'
                                : ''}"
                            btnClasses="btn-xs mt-2 capitalize text-right"
                            loading={rowLoading}
                            includeDropDownChevron={true}
                            on:optionSelected={async (params) => {
                                await handleCategoryChange(params.detail.params);
                            }} />
                    {:else}
                        <button class="btn btn-link btn-xs pl-0 text-base-content">
                            {rowData[rowDataMapping.rowCategoryName]}
                        </button>
                    {/if}
                </div>
            </div>
        </div>
        <div class="flex items-center justify-end {rowWidth < widthSmall ? 'w-3/12' : 'w-6/12'}">
            <div class:hidden={rowWidth < widthSmall}>
                {#if rowData.enableEdit}
                    <Dropdown
                        dropDownText={rowData[rowDataMapping.rowCategoryName]}
                        dropDownTextClasses="overflow-hidden overflow-ellipsis  {rowWidth > widthMedium
                            ? 'max-w-[20ch]'
                            : 'max-w-[11ch]'} whitespace-nowrap"
                        dropDownOptions={possibleCategoriesDropdownOptions}
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
                        {rowData[rowDataMapping.rowCategoryName]}
                    </button>
                {/if}
            </div>

            <!-- Row Actions -->
            <div class="flex items-center justify-center">
                {#each rowActions as action}
                    {#if Object.keys(allowedRowActions).includes(action.type)}
                        {#if rowData[allowedRowActions[action.type].backendFlag]}
                            <button
                                class="btn btn-xs ml-1 flex-nowrap {action.btnClasses}"
                                on:click={(event) => {
                                    event.stopPropagation(); // Stops the click on table row element behind it
                                    dispatch("actionTriggered", { clickEvent: action.clickEvent, rowId: rowData.id });
                                }}>
                                <Fa icon={allowedRowActions[action.type].faIcon} size="1.1x" />

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
