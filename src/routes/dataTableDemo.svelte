<script>
    import PageTransitionFade from "$base_components/page_transitions/pageTransitionFade.svelte";
    import DataTable from "$src/base_components/data-series/dataTable.svelte";
    import MainNav from "$src/lib/navigation/mainNav.svelte";
    import QuickActionsMenu from "$src/lib/navigation/quickActionsMenu.svelte";
    import { faFileExcel, faFileCsv, faFileText, faTrash } from "@fortawesome/free-solid-svg-icons/index.es";

    let columns = {
        name: {
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
        age: {
            width: 15,
            sortBy: false,
            isSortAscending: true,
            filterBy: {
                filterNumber: { userInput: "", placeholder: "Age is just a number", defaultValue: "" },
            },
        },
        date: {
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
        category: {
            width: 30,
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
</script>

<PageTransitionFade>
    <MainNav />

    <div class="container mx-auto mt-10">
        <DataTable
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
