<script>
    import ValidatedInput from "$src/base_components/forms/validatedInput.svelte";
    import { onMount } from "svelte";
    import ValidatedInputDate from "$src/base_components/forms/validatedInputDate.svelte";
    import ValidatedSelectInput from "$src/base_components/forms/validatedSelectInput.svelte";
    import { getPlanningProjectsForOrganisations } from "./testForm";
    import { sleep } from "$src/lib/js/utilities/helpers";
    import { createEventDispatcher } from "svelte";
    import { handleKeypress, resetForm, validateForm } from "../formHelpers";
    import { INPUT_TYPES } from "$src/lib/js/constants/formConstants";

    let isCreating = false;

    const dispatch = createEventDispatcher();

    const doCreateFormName = async () => {
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

        console.log("formData", formData);
        const createResult = await sleep(() => {}, 500);
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
        await getPossibleProjectOptions();
        isLoading = false;
    });

    let projectOptions = {
        defaultValue: {
            notSelected: INPUT_TYPES.SELECT.DEFAULT_VALUE,
        },
        options: {},
    };

    const getPossibleProjectOptions = async () => {
        const projectsResult = await getPlanningProjectsForOrganisations([2]);

        if (projectsResult === null) {
            return;
        }

        let options = {};
        projectsResult.data.forEach((project) => {
            options[project.id] = project.projectName;
        });

        projectOptions.options = options;
    };
</script>

<form on:submit|preventDefault={() => {}}>
    <ValidatedInput
        bind:value={formInputs.taskName.value}
        label="Name"
        validateAs="required"
        type="text"
        bind:keypress
        bind:this={formInputs.taskName.component}
        validationMessage="Required"
        name="Category Name"
        placeholder="Planning" />
    <ValidatedInputDate
        label="Start Date"
        placeholder="Start Date"
        bind:value={formInputs.startDate.value}
        validateAs="required"
        validationMessage="Required"
        bind:keypress
        bind:this={formInputs.startDate.component} />
    <ValidatedSelectInput
        bind:values={projectOptions}
        validateAsRequired={false}
        bind:selectedValue={formInputs.project.value}
        validationMessage="Invalid selection"
        label="Project"
        bind:isValid={formInputs.project.isValid}
        bind:this={formInputs.project.component} />
</form>

<button class="btn btn-primary" class:loading={isCreating} disabled={isLoading} on:click={() => doCreateFormName()}>
    {isLoading ? "Loading..." : isCreating ? "Creating..." : "Create"}
</button>
