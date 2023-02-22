<script>
    import RoutingExampleNav from "../navigation/routingExampleNav.svelte";
    import { fade } from "svelte/transition";
    import PageTransitionFade from "../page_transitions/pageTransitionFade.svelte";
    import ValidatedInput from "../forms/validatedInput.svelte";
    import ValidatedSelectInput from "../forms/validatedSelectInput.svelte";
    import DataTable from "$src/base_components/data-series/dataTable.svelte";
    import { faFileExcel, faFileCsv, faFileText, faTrash } from "@fortawesome/free-solid-svg-icons";
    import QuickActionModal from "$src/base_components/modals/quickActionModal.svelte";

    import DataList from "$src/base_components/data-series/data-lists/dataListWrapper.svelte";
    import ListRowOne from "$src/base_components/data-series/data-lists/row-variants/stockholm.svelte";
    import ListRowTwo from "$src/base_components/data-series/data-lists/row-variants/toronto.svelte";
    import ListRowThree from "$src/base_components/data-series/data-lists/row-variants/sofia.svelte";
    import ListRowFour from "$src/base_components/data-series/data-lists/row-variants/geneva.svelte";
    import RowAction from "$src/base_components/data-series/data-lists/dataListRowAction.svelte";
    import BaseForm from "../../../dx_tools/form_generation/baseForm.svelte";
    import TestFromCreate from "../../../forms/testForm/testFromCreate.svelte";
    import TestFormUpdate from "../../../forms/testForm/testFormUpdate.svelte";
    import { INPUT_TYPES } from "$src/lib/js/constants/formConstants";

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
            notSelected: INPUT_TYPES.SELECT.DEFAULT_VALUE,
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
    <div class="w-[400px] mx-auto">
        <TestFromCreate
            on:actionTriggered={(event) => {
                console.log(event.detail);
            }} />
        <hr />
        <hr />
        <hr />
        <TestFormUpdate />
    </div>
</PageTransitionFade>
