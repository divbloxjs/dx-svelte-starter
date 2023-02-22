<script>
    import ValidatedInput from "$src/base_components/forms/validatedInput.svelte";
    import { backendRoot } from "$src/lib/js/stores/configurations";
    import { handleFetchResponse } from "$src/lib/js/utilities/helpers";
    import { errorAlert, errorToast } from "$src/lib/js/utilities/swalMixins";
    import { beforeUpdate, onMount } from "svelte";

    export let id = -1;
    export let formData = {};

    beforeUpdate(async () => {
        console.log("GHAHAHAHA");
        await loadFormName();

        await formData;
    });

    onMount(async () => {
        if (id < 0) {
            return;
        }
    });

    export const resetForm = async (id) => {};

    const loadFormName = async () => {
        const getResult = await getPlanningCategory(id, 1);

        if (getResult !== null) {
            formData = getResult.data;
            delete formData.id;
        }
    };
    const createFormName = async () => {};
    const updateFormName = async () => {};
    const deleteFormName = async () => {};

    $: keypress = null;
    $: keypress, handleKeypress();
    const handleKeypress = async () => {
        if (keypress === 13) {
            // handleSubmitRequest();
        }
    };

    export const planningCategoryEndpoint = backendRoot + "/api/projects/planningCategory";
    export const getPlanningCategory = async (planningCategoryId = -1, projectId = -1) => {
        try {
            const getResult = await fetch(
                planningCategoryEndpoint + "?id=" + planningCategoryId + "&projectId=" + projectId,
                {
                    method: "GET",
                    credentials: "include",
                }
            );

            handleFetchResponse(getResult.status);

            if (getResult.status !== 200) {
                try {
                    const result = await getResult.json();
                    let title = "Something went wrong. <br>Please try again.";

                    if (result.message !== undefined) {
                        title = result.message;
                    }

                    errorToast.fire({
                        title: title,
                        confirmButtonText: "OK",
                        timer: 5000,
                    });
                } catch (error) {
                    errorToast.fire({
                        title: "Something went wrong. <br>Please try again.",
                        confirmButtonText: "OK",
                        timer: 5000,
                    });

                    return null;
                }

                return null;
            }
            const responseBody = await getResult.json();
            if (responseBody !== undefined) {
                return responseBody;
            }
        } catch (error) {
            console.error("PlanningCategory get error: " + error);
            errorAlert.fire({
                html: "Something went wrong. <br>Please try again.",
                confirmButtonText: "OK",
                timer: 5000,
            });
        }

        return null;
    };

    let categoryNameComp;
</script>

<form>
    <input type="text" name="firstName" />
    <ValidatedInput
        bind:value={formData.categoryName}
        label="Name"
        validateAs="required"
        type="text"
        bind:this={categoryNameComp}
        bind:keypress
        validationMessage="Required"
        name="Category Name"
        placeholder="Planning" />
</form>

<button class="btn btn-primary">Haha</button>
