<script>
    import MainNav from "../lib/navigation/mainNav.svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import QuickActionsMenu from "$navigation/quickActionsMenu.svelte";
    import { checkAuthentication } from "$stores/authentication";
    import { onMount } from "svelte";
    import PageTransitionFade from "$base_components/page_transitions/pageTransitionFade.svelte";
    import DataTable from "$base_components/data-series/data-table.svelte";
    import DataTableTest from "$base_components/data-series/data-table-test.svelte";

    import { faFileExcel, faFileCsv, faFileText, faTrash } from "@fortawesome/free-solid-svg-icons/index.es";
    const openComponentLibrary = () => {
        push("/component-library");
    };

    onMount(async () => {
        await checkAuthentication();
    });
    let columns = {
        name: {
            width: 25,
            minWidth: "100px",
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
        date: {
            width: 25,
            minWidth: "100px",
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
        category: {
            width: 10,
            minWidth: "100px",
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
        age: {
            width: 10,
            minWidth: "100px",
            sortBy: false,
            isSortAscending: true,
            filterBy: {
                filterNumber: { userInput: "", placeholder: "Age", defaultValue: "" },
            },
        },
    };

    let multiSelectActions = [
        {
            faIcon: faTrash,
            displayLabel: "Delete",
            optionClasses: "",
            faClasses: "text-error",
            displayHtml: null,
            clickEvent: "delete_clicked",
        },
        {
            faIcon: faFileText,
            displayLabel: "Export (Text)",
            optionClasses: "",
            faClasses: "text-success",
            displayHtml: null,
            clickEvent: "export_txt_clicked",
        },
        {
            faIcon: faFileExcel,
            displayLabel: "Export (Excel)",
            optionClasses: "",
            faClasses: "text-success",
            displayHtml: null,
            clickEvent: "export_excel_clicked",
        },
        {
            faIcon: faFileCsv,
            displayLabel: "Export (CSV)",
            params: {},
            optionClasses: "",
            faClasses: "text-success",
            displayHtml: null,
            clickEvent: "export_csv_clicked",
        },
    ];

    let customActions = {
        columnHeading: "Actions",
        actions: [
            {
                faIcon: "faEye",
                btnClasses: "btn-info",
                displayHtml: null,
                clickEvent: "open_clicked",
            },
            {
                faIcon: "faEdit",
                btnClasses: "btn-success",
                // displayLabel: "Edit",
                displayHtml: null,
                clickEvent: "edit_clicked",
            },
            {
                faIcon: "faTrash",
                btnClasses: "btn-error",
                displayHtml: null,
                clickEvent: "delete_clicked",
            },
        ],
    };

    const handleActionTriggered = async (params) => {
        console.log(params.detail);
    };

    let cols = 4;
</script>

<PageTransitionFade>
    <MainNav />

    <div class="container mx-auto mt-10">
        <!-- <DataTable -->
        <DataTableTest
            dataSource="data.json"
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
            on:actionTriggered={async (params) => handleActionTriggered(params)} />
    </div>
    <!-- <main class="mt-5 mb-16 pl-5 pr-5">
        <div class="hero h-96 max-h-screen bg-base-200">
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <h1 class="text-5xl font-bold">Welcome</h1>
                    <p class="py-6">This is a "blank" home page to get you started. Go nuts!</p>
                    <button class="btn btn-primary" on:click={openComponentLibrary}> See Component Library </button>
                </div>
            </div>
        </div>
    </main> -->
    <QuickActionsMenu />
</PageTransitionFade>
