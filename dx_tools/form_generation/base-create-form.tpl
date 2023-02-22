<script>

    import { onMount } from "svelte";
    import { createEventDispatcher } from "svelte";

    import ValidatedInput from "$src/base_components/forms/validatedInput.svelte";
    import ValidatedInputDate from "$src/base_components/forms/validatedInputDate.svelte";
    import ValidatedSelectInput from "$src/base_components/forms/validatedSelectInput.svelte";
    import { handleKeypress, resetForm, validateForm } from "../formHelpers";

    import { create((entityName)), getPlanningProjectsForOrganisations } from "./testForm";
    import { sleep } from "$src/lib/js/utilities/helpers";
    import { INPUT_TYPES } from "$src/lib/js/constants/formConstants";

    let isCreating = false;

    const dispatch = createEventDispatcher();

    const doCreate((entityName)) = async () => {
        if (!(await validateForm(formInputs))) {
            return;
        }

        isCreating = true;

        let formData = {};
        Object.entries(formInputs).forEach(([attributeName, formInput]) => {
            if (formInput.value !== INPUT_TYPES.SELECT.DEFAULT_VALUE) {
                formData[attributeName] = formInput.value;
            }
        });

        const createResult = await create((entityName))();
        isCreating = false;

        if (createResult === -1) {
            dispatch("actionTriggered", { event: "create-fail", formData: formData });
            return;
        }

        resetForm(formInputs);
        formInputs = formInputs;
        dispatch("actionTriggered", { event: "create-success", formData: formData });
    };

    $: keypress = null;
    $: keypress, handleKeypress(keypress);

    export let formInputs = {
        project: {
            component: null,
            isValid: null,
            value: INPUT_TYPES.SELECT.DEFAULT_VALUE,
        },
        startDate: {
            component: null,
            isValid: null,
            value: "",
        },
        taskName: {
            component: null,
            isValid: null,
            value: "asdasd",
        },
    };

    let isLoading = false;
    onMount(async () => {
        isLoading = true;
        await getPossible((selectOption))Options();
        isLoading = false;
    });

    let ((selectOption))Options = {
        defaultValue: {
            notSelected: INPUT_TYPES.SELECT.DEFAULT_VALUE,
        },
        options: {},
    };

    const getPossible((selectOption))Options = async () => {
        const get((selectOption))Result = await getPlanningProjectsForOrganisations([2]);

        if (get((selectOption))Result === null) {
            return;
        }

        let options = {};
        get((selectOption))Result.forEach((project) => {
            options[((selectKey))] = ((selectOption)).((selectDisplayValue));
        });

        ((selectOption))Options.options = options;
    };
</script>
