<script>
    import RoutingExampleNav from "../navigation/routingExampleNav.svelte";
    import { fade } from "svelte/transition";
    import PageTransitionFade from "../page_transitions/pageTransitionFade.svelte";
    import ValidatedInput from "../forms/validatedInput.svelte";
    import ValidatedSelectInput from "../forms/validatedSelectInput.svelte";
    import DataTable from "$src/base_components/data-series/dataTable.svelte";
    import { faFileExcel, faFileCsv, faFileText, faTrash } from "@fortawesome/free-solid-svg-icons";
    import QuickActionModal from "$src/base_components/modals/quickActionModal.svelte";

    import DataList from "../data-series/data-lists/variantRowless.svelte";
    import ListRowOne from "$src/base_components/data-series/data-lists/rows/rowOne.svelte";
    import ListRowTwo from "$src/base_components/data-series/data-lists/rows/rowTwo.svelte";
    import ListRowThree from "$src/base_components/data-series/data-lists/rows/rowThree.svelte";
    import ListRowFour from "$src/base_components/data-series/data-lists/rows/rowFour.svelte";
    import RowAction from "$src/base_components/data-series/data-lists/rows/rowAction.svelte";

    let columns = [
        {
            columnHeading: "Age",
            dataSourceAttributeName: "age",
            width: 15,
            sortBy: false,
            isSortAscending: true,
            filterBy: {
                filterNumber: { userInput: "", placeholder: "Age is just a number", defaultValue: "" },
            },
        },
        {
            columnHeading: "Date",
            dataSourceAttributeName: "date",
            width: 25,
            sortBy: false,
            isSortAscending: true,
            filterBy: {
                fromDate: {
                    userInput: "",
                    label: "From",
                    placeholder: "From",
                    defaultValue: "",
                },
                toDate: { userInput: "", label: "To", placeholder: "To", defaultValue: "" },
            },
        },
        {
            columnHeading: "Name",
            dataSourceAttributeName: "name",
            width: 20,
            sortBy: true,
            isSortAscending: true,
            filterBy: {
                filterText: {
                    userInput: "Joeys",
                    placeholder: "First Name",
                    defaultValue: "Joeys",
                },
            },
        },
        {
            columnHeading: "Category",
            dataSourceAttributeName: "category",
            width: 20,
            sortBy: false,
            isSortAscending: true,
            filterBy: {
                filterDropdown: {
                    userInput: "Miller",
                    placeholder: "-All-",
                    defaultOptions: ["Miller", "Tinkerer", "Hotdog", "Oven"],
                },
            },
        },
    ];

    let multiSelectActions = [
        {
            faIcon: faTrash,
            displayLabel: "Delete",
            optionClasses: "",
            faClasses: "text-error",
            clickEvent: "delete_clicked",
        },
        {
            faIcon: faFileText,
            displayLabel: "Export (Text)",
            optionClasses: "",
            faClasses: "text-success",
            clickEvent: "export_txt_clicked",
        },
        {
            faIcon: faFileExcel,
            displayLabel: "Export (Excel)",
            optionClasses: "",
            faClasses: "text-success",
            clickEvent: "export_excel_clicked",
        },
        {
            faIcon: faFileCsv,
            displayLabel: "Export (CSV)",
            params: {},
            optionClasses: "",
            faClasses: "text-success",
            clickEvent: "export_csv_clicked",
        },
    ];

    let customActions = {
        columnHeading: "Actions",
        actions: [
            {
                faIcon: "faEye",
                btnClasses: "btn-info",
                clickEvent: "open_clicked",
            },
            {
                faIcon: "faEdit",
                btnClasses: "btn-success",
                displayLabel: "Edit",
                clickEvent: "edit_clicked",
            },
            {
                faIcon: "faTrash",
                btnClasses: "btn-error",
                clickEvent: "delete_clicked",
            },
        ],
    };

    const handleActionTriggered = async (params) => {
        console.log(params.detail);
    };

    let validatedInputArray = [];

    let passwordValue = "";
    let isValid = [];
    let validatedInput = [];

    $: activeComponentTab = "dataTableExample";

    const tabToggle = (event, tabToggleId) => {
        event.target.classList.add("tab-active");

        activeComponentTab = tabToggleId;
    };

    const validateForm = () => {
        let isFormValid = true;
        validatedInputArray.forEach((inputComponent) => {
            // @ts-ignore
            isFormValid &= inputComponent.validate(true);
        });

        return isFormValid;
    };

    const pretendSubmit = () => {
        if (validateForm()) {
            console.log("Pretended to submit. Validation passed!");
        } else {
            console.log("Failed to pretend to submit. Validation failed!");
        }
    };

    let values = {
        defaultValue: {
            notSelected: "-Please Select-",
        },
        options: {
            "Star Wars": "Star Wars",
            "Harry Potter": "Harry Potter",
            "Lord of the Rings": "Lord of the Rings",
            "Planet of the Apes": "Planet of the Apes",
            "Star Trek": "Star Trek",
        },
    };

    let quickActionModal;
    let dataLists = {};
</script>

<QuickActionModal
    bind:this={quickActionModal}
    mustConfirm={true}
    introText="Some introduction message here"
    inputLabel="Input Label" />

<PageTransitionFade>
    <RoutingExampleNav />
    <main class="mt-5 mb-16">
        <div class="mx-auto px-5">
            <article class="prose">
                <h1>Component Library & Examples</h1>
                <p>
                    Base components built on <a href="https://daisyui.com/docs/install/" target="blank"> daisyUI </a>
                    and
                    <a href="https://tailwindcss.com/docs/installation" target="blank"> tailwindcss </a>
                </p>
                <p>
                    For a full reference, visit <a href="https://daisyui.com/docs/install/" target="blank"> daisyUI </a>
                </p>
            </article>
            <div class="divider" />

            <div class="tabs tabs-boxed pl-5 pr-5">
                <span
                    class="tab tab-bordered mr-2"
                    class:tab-active={activeComponentTab === "dataTableExample"}
                    on:click={(event) => tabToggle(event, "dataTableExample")}>
                    Data Table
                </span>
                <span
                    class="tab tab-bordered mr-2"
                    class:tab-active={activeComponentTab === "dataListExample"}
                    on:click={(event) => tabToggle(event, "dataListExample")}>
                    Data List
                </span>
                <span
                    class="tab tab-bordered mr-2"
                    class:tab-active={activeComponentTab === "validatedInputs"}
                    on:click={(event) => tabToggle(event, "validatedInputs")}>
                    Validated Inputs
                </span>
                <span
                    class="tab tab-bordered"
                    class:tab-active={activeComponentTab === "modals"}
                    on:click={(event) => tabToggle(event, "modals")}>
                    Modals
                </span>
            </div>

            {#if activeComponentTab == "dataTableExample"}
                <div in:fade={{ duration: 500 }} class="pt-4">
                    <DataTable
                        dataSource="https://assets.divblox.com/example_data/data.json"
                        {columns}
                        enableGlobalSearch={true}
                        enableFilters={true}
                        enableRefresh={true}
                        showFilters={true}
                        itemsPerPage={3}
                        enableMultiSelect={true}
                        pageNumber={0}
                        {customActions}
                        {multiSelectActions}
                        dataSourceDelaySimulation={1000}
                        on:actionTriggered={async (params) => handleActionTriggered(params)} />
                </div>
            {:else if activeComponentTab == "dataListExample"}
                <div in:fade={{ duration: 500 }} class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                        <div class="m-2 rounded-lg bg-info px-4 py-2 text-center">With basic row</div>
                        <DataList
                            bind:this={dataLists.exampleOne}
                            dataSource="src/base_components/data-series/tests/row-two.json"
                            let:rowData
                            let:rowIndex
                            let:listLength
                            on:actionTriggered={async (event) => {
                                switch (event.detail.clickEvent) {
                                    case "create_clicked":
                                        console.log(event.detail);
                                        break;
                                }
                            }}>
                            <ListRowOne
                                {rowData}
                                {rowIndex}
                                {listLength}
                                rowDataMappingOverride={{
                                    rowTitle: "displayName",
                                }}
                                on:actionTriggered={(event) => {
                                    console.log("handled in parent: ", event.detail);
                                }} />
                        </DataList>
                    </div>
                    <div>
                        <div class="m-2 rounded-lg bg-info px-4 py-2 text-center">With advanced row</div>
                        <DataList
                            bind:this={dataLists.exampleOne}
                            dataSource="src/base_components/data-series/tests/row-two.json"
                            on:actionTriggered={async (event) => {
                                console.log("handled in parent: ", event.detail);
                                switch (event.detail.clickEvent) {
                                    case "create_clicked":
                                        console.log(event.detail.clickEvent);
                                        break;
                                }
                            }}
                            let:rowData
                            let:rowIndex
                            let:listLength>
                            <ListRowTwo
                                {rowData}
                                {rowIndex}
                                {listLength}
                                rowDataMappingOverride={{
                                    rowTitle: "displayName",
                                    rowDescription: "emailAddress",
                                    rowCategoryName: "roleName",
                                    imageUrl: "profilePictureUrl",
                                    possibleCategories: "possibleOrganisationRoles",
                                }}
                                let:rowActionTriggered
                                on:actionTriggered={(event) => {
                                    console.log("handled in parent: ", event.detail);
                                }}
                                additionalRowProps={{
                                    categoryUpdateEndpoint: "",
                                    additionalCategoryParams: {},
                                }}>
                                <RowAction
                                    {rowData}
                                    action={{ type: "edit" }}
                                    on:actionTriggered={rowActionTriggered} />
                            </ListRowTwo>
                        </DataList>
                    </div>
                    <div>
                        <div class="m-2 rounded-lg bg-info px-4 py-2 text-center">With Title and Description</div>
                        <DataList
                            bind:this={dataLists.exampleThree}
                            dataSource="src/base_components/data-series/tests/row-two.json"
                            on:actionTriggered={async (event) => {
                                console.log("handled in parent: ", event.detail);
                                switch (event.detail.clickEvent) {
                                    case "create_clicked":
                                        console.log(event.detail.clickEvent);
                                        break;
                                }
                            }}
                            let:rowData
                            let:listLength
                            let:rowIndex
                            let:showLoadingState>
                            <ListRowThree
                                {rowData}
                                {listLength}
                                {rowIndex}
                                {showLoadingState}
                                let:rowData
                                let:rowActionTriggered
                                on:actionTriggered={(event) => {
                                    console.log("handled in parent: ", event.detail);
                                }}
                                rowDataMappingOverride={{
                                    rowTitle: "displayName",
                                    rowDescription: "emailAddress",
                                }}>
                                <RowAction
                                    action={{ type: "edit" }}
                                    {rowData}
                                    on:actionTriggered={rowActionTriggered} />
                                <RowAction
                                    action={{ type: "delete" }}
                                    {rowData}
                                    on:actionTriggered={rowActionTriggered} />
                            </ListRowThree>
                        </DataList>
                    </div>
                    <div>
                        <div class="m-2 rounded-lg bg-info px-4 py-2 text-center">
                            With Title and Description + Colour
                        </div>
                        <DataList
                            bind:this={dataLists.exampleFour}
                            dataSource="src/base_components/data-series/tests/row-two.json"
                            on:actionTriggered={async (event) => {
                                console.log("handled in parent: ", event.detail);
                                switch (event.detail.clickEvent) {
                                    case "create_clicked":
                                        console.log(event.detail.clickEvent);
                                        break;
                                }
                            }}
                            let:rowData
                            let:listLength
                            let:rowIndex
                            let:showLoadingState>
                            <ListRowFour
                                {rowData}
                                {listLength}
                                {rowIndex}
                                {showLoadingState}
                                on:actionTriggered={(event) => {
                                    console.log("handled in parent: ", event.detail);
                                }}
                                rowDataMappingOverride={{
                                    rowTitle: "displayName",
                                    rowDescription: "emailAddress",
                                }} />
                        </DataList>
                    </div>
                </div>
            {:else if activeComponentTab == "validatedInputs"}
                <div in:fade={{ duration: 500 }} class="flex flex-row gap-5 pt-4">
                    <div class="basis-4/12">
                        <h4 class="text-xl font-bold">Validated inputs</h4>
                        <ValidatedSelectInput
                            bind:values
                            validationMessage="Invalid selection"
                            label="Movies"
                            requiredLabel="(Required)"
                            bind:isValid={isValid[3]}
                            bind:this={validatedInputArray[3]} />
                        <ValidatedInput
                            placeholder="Email address"
                            type="email"
                            validateAs="email"
                            validationMessage="Invalid email address"
                            label="Email Address"
                            requiredLabel="(Required)"
                            bind:isValid={isValid[0]}
                            bind:this={validatedInputArray[0]} />
                        <ValidatedInput
                            placeholder="Password"
                            bind:value={passwordValue}
                            type="password"
                            validateAs="password"
                            label="Password"
                            passwordValidationOption="strong"
                            validationMessage="Password too weak"
                            bind:isValid={isValid[1]}
                            bind:this={validatedInputArray[1]} />
                        <ValidatedInput
                            placeholder="Confirm Password"
                            value=""
                            type="password"
                            validateAs="comparison"
                            compareValue={passwordValue}
                            validationMessage="Passwords do not match"
                            bind:isValid={isValid[2]}
                            bind:this={validatedInputArray[2]} />
                        <button class="btn btn-primary float-right mt-2" on:click={pretendSubmit}>Test</button>
                    </div>
                </div>
            {:else if activeComponentTab == "modals"}
                <div in:fade={{ duration: 500 }} class="flex flex-row gap-5 pt-4">
                    <button
                        class="btn btn-primary"
                        on:click={() => {
                            quickActionModal.toggleModal(true);
                        }}
                        >Quick Action Modal
                    </button>
                </div>
            {/if}
        </div>
    </main>
</PageTransitionFade>
