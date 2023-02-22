<script>
    import ValidatedInput from "$src/base_components/forms/validatedInput.svelte";
    import ValidatedInputDate from "$src/base_components/forms/validatedInputDate.svelte";
    import ValidatedSelectInput from "$src/base_components/forms/validatedSelectInput.svelte";
    import {
        getPlanningTeamsForOrganisations,
        getPlanningCategories,
        getPlanningProjectsForOrganisations,
        deleteTask,
        getAssignedProjectRoles,
        getTask,
        updateTask,
    } from "./testForm";
    import { errorAlert, errorToast } from "$src/lib/js/utilities/swalMixins";
    import { createEventDispatcher, onMount } from "svelte";

    let assignedProjectRoles = [{ label: "Loading...", id: -1 }];
    let selectedAssignedProjectRoles = [];
    let disabled = true;

    let formInputs = {
        taskName: {
            component: null,
            isValid: null,
        },
        category: {
            component: null,
            isValid: null,
        },
        team: {
            component: null,
            isValid: null,
        },
        startDate: {
            component: null,
            isValid: null,
        },
        endDate: {
            component: null,
            isValid: null,
        },
        project: {
            component: null,
            isValid: null,
        },
    };

    let formData = {};
    export let taskId;
    export let isSubmitting = false;
    export let isDeleting = false;

    let projectId;

    let previousPlanningCategoryId = -1; // Used to refresh both category lists if a change occurs
    let previousPlanningCategoryName = ""; // Used to refresh both category lists if a change occurs
    let previousTeamId = -1; // Used to refresh both category lists if a change occurs
    let previousTeamName = "";

    let previousUserAccountIds = [];

    let teamOptions = {
        defaultValue: {
            notSelected: "-Please Select-",
        },
        options: {},
    };

    let planningCategoryOptions = {
        defaultValue: {
            notSelected: "-Please Select-",
        },
        options: {},
    };

    export const resetForm = async (newTaskId = -1, newProjectId = -1, repopulateOptions = false) => {
        let projectId = newProjectId.toString();
        taskId = newTaskId;
        disabled = true;

        console.log("projectId", projectId);

        formData = {
            taskName: "",
            description: "",
            startDate: "",
            endDate: "",
            teamId: "-Please Select-",
            assignedProjectRoleIds: [],
            planningCategoryId: "-Please Select-",
        };

        selectedAssignedProjectRoles = [];

        for (const [inputName, inputData] of Object.entries(formInputs)) {
            formInputs[inputName].component.resetValidation();
        }

        if (repopulateOptions) {
            await getPossibleProjects();
            await getPossibleTeams();
            await getPossiblePlanningCategories();
            await getPossibleAssignedProjectRoles();
            const getTaskResult = await getTask(taskId, projectId);

            if (getTaskResult === null) {
                console.error("Error retrieving task data");
                return;
            }

            const taskData = getTaskResult.data;
            console.log(taskData);
            formData.taskName = taskData.taskName;
            formData.description = taskData.description;
            formData.startDate = new Date(taskData.startDate).toISOString().split("T")[0];
            formData.endDate = new Date(taskData.endDate).toISOString().split("T")[0];
            formData.teamId = taskData.team.id ? taskData.team.id.toString() : "-Please Select-";
            formData.planningCategoryId = taskData.planningCategory.id
                ? taskData.planningCategory.id.toString()
                : "-Please Select-";
            previousPlanningCategoryId = formData.planningCategoryId;
            previousPlanningCategoryName = formData.categoryName;

            previousTeamId = formData.teamId;
            previousTeamName = teamOptions.options[formData.teamId];

            previousUserAccountIds = [];
            selectedAssignedProjectRoles = [];
            taskData.assignedTasks.forEach((assignedTask) => {
                selectedAssignedProjectRoles.push({
                    label:
                        assignedTask.displayName +
                        "<span style='display:none'>" +
                        assignedTask.assignedProjectRoleId +
                        "</span>",
                    id: assignedTask.assignedProjectRoleId,
                });

                previousUserAccountIds.push(assignedTask.userAccountId);
            });

            formData = formData;
        }

        disabled = false;
    };

    onMount(() => {
        resetForm(12, 1, true);
    });

    const getPossibleTeams = async () => {
        const getTeamsResult = await getPlanningTeamsForOrganisations([2]);

        if (getTeamsResult !== null) {
            let options = {};
            getTeamsResult.data.forEach((team) => {
                options[team.id] = team.title;
            });
            teamOptions.options = options;
        }
    };

    let projectOptions = {
        defaultValue: {
            notSelected: "-Please Select-",
        },
        options: {},
    };

    const getPossibleProjects = async () => {
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

    const getPossiblePlanningCategories = async () => {
        console.log("getPossiblePlanningCategories", projectId);
        projectId = 1;
        const getPlanningCategoriesResult = await getPlanningCategories(projectId);

        if (getPlanningCategoriesResult !== null) {
            let options = {};
            getPlanningCategoriesResult.data.forEach((planningCategory) => {
                options[planningCategory.id] = planningCategory.name;
            });
            planningCategoryOptions.options = options;
        }
    };

    const getPossibleAssignedProjectRoles = async () => {
        const getAssignedProjectRolesResult = await getAssignedProjectRoles(projectId, {
            selectedRoleStatuses: ["Active"],
        });

        assignedProjectRoles = [];
        if (getAssignedProjectRolesResult !== null) {
            getAssignedProjectRolesResult.data.forEach((assignedProjectRole) => {
                assignedProjectRoles.push({
                    label:
                        assignedProjectRole.displayName +
                        "<span style='display:none'>" +
                        assignedProjectRole.id +
                        "</span>",
                    id: assignedProjectRole.id,
                });
            });
        }
    };

    $: keypress = null;
    $: keypress, handleKeypress();
    const handleKeypress = async () => {
        if (keypress === 13) {
            handleSubmitRequest();
        }
    };

    const validateForm = () => {
        let isValid = true;
        // @ts-ignore
        isValid &= formInputs.taskName.component.validate(true);
        // @ts-ignore
        isValid &= formInputs.category.component.validate(true);
        // @ts-ignore
        isValid &= formInputs.startDate.component.validate(true);
        // @ts-ignore
        isValid &= formInputs.endDate.component.validate(true);

        if (formData.endDate !== "" && formData.startDate > formData.endDate) {
            isValid = false;
            errorToast.fire({ title: "End Date cannot be before start date" });
        }
        return isValid;
    };

    const dispatch = createEventDispatcher();

    const handleSubmitRequest = async () => {
        if (!validateForm()) {
            return;
        }

        formData.assignedProjectRoleIds = JSON.stringify(selectedAssignedProjectRoles.map(({ id }) => id));

        let finalFormData = JSON.parse(JSON.stringify(formData));
        for (const key of Object.keys(finalFormData)) {
            if (finalFormData[key] === "-Please Select-") {
                finalFormData[key] = "";
            }
        }

        isSubmitting = true;
        const updateResult = await updateTask(taskId, finalFormData, projectId);
        if (updateResult) {
            dispatch("submitted", {
                planningCategoryId: formData.planningCategoryId,
                previousPlanningCategoryId: previousPlanningCategoryId,
                planningCategoryName: planningCategoryOptions.options[formData.planningCategoryId],
                previousPlanningCategoryName: previousPlanningCategoryName,

                teamName: teamOptions.options[formData.teamId],
                previousTeamName: previousTeamName,

                userAccountIds: selectedAssignedProjectRoles.map(({ userAccountId }) => userAccountId),
                previousUserAccountIds: previousUserAccountIds,
            });
        }

        isSubmitting = false;
    };

    const handleDeleteRequest = async () => {
        const alertResult = await errorAlert.fire({
            html: "Are you sure?",
            confirmButtonText: "OK",
            timer: 0,
        });

        if (!alertResult.isConfirmed) {
            return;
        }

        isDeleting = true;

        const deleteResult = await deleteTask(taskId, projectId);
        if (deleteResult) {
            // TODO change event to deleted to distinguish if different behaviour needed
            dispatch("submitted", {
                planningCategoryId: formData.planningCategoryId,
                previousPlanningCategoryId: previousPlanningCategoryId,
                planningCategoryName: planningCategoryOptions.options[formData.planningCategoryId],
                previousPlanningCategoryName: previousPlanningCategoryName,

                teamName: teamOptions.options[formData.teamId],
                previousTeamName: previousTeamName,

                userAccountIds: selectedAssignedProjectRoles.map(({ userAccountId }) => userAccountId),
                previousUserAccountIds: previousUserAccountIds,
            });
        }

        isDeleting = false;
    };

    let disableOptions = false;
    const updateOptions = async () => {
        disableOptions = true;
        await getPossibleTeams();
        await getPossiblePlanningCategories();
        await getPossibleAssignedProjectRoles();
        disableOptions = false;
    };
</script>

<div class="mt-2 flex flex-row">
    <div class="w-1/2 pr-2">
        <ValidatedInput
            bind:value={formData.taskName}
            label="Name"
            validateAs="required"
            type="text"
            bind:this={formInputs.taskName.component}
            bind:keypress
            validationMessage="Required"
            name="Category Name"
            placeholder="Planning" />
        <ValidatedInputDate
            label="Start Date"
            placeholder="Start Date"
            bind:value={formData.startDate}
            validateAs="required"
            validationMessage="Required"
            bind:keypress
            bind:this={formInputs.startDate.component} />
        <ValidatedInputDate
            label="End Date"
            placeholder="End Date"
            bind:value={formData.endDate}
            validateAs="required"
            validationMessage="Required"
            bind:keypress
            bind:this={formInputs.endDate.component} />
    </div>
    <div class="w-1/2 pl-2">
        <ValidatedSelectInput
            bind:values={projectOptions}
            bind:selectedValue={projectId}
            validationMessage="Invalid selection"
            label="Project"
            on:change={async () => await updateOptions()}
            bind:isValid={formInputs.project.isValid}
            disabled={true}
            bind:this={formInputs.project.component} />
        <ValidatedSelectInput
            bind:values={teamOptions}
            bind:selectedValue={formData.teamId}
            validationMessage="Invalid selection"
            label="Team"
            disabled={disableOptions}
            bind:isValid={formInputs.team.isValid}
            bind:this={formInputs.team.component} />
        <ValidatedSelectInput
            disabled={disableOptions}
            bind:values={planningCategoryOptions}
            bind:selectedValue={formData.planningCategoryId}
            validationMessage="Invalid selection"
            label="Category"
            bind:isValid={formInputs.category.isValid}
            bind:this={formInputs.category.component} />
    </div>
</div>

<label class="label mb-1" for="description">
    <span class="">Description</span>
</label>
<textarea
    name="description"
    bind:value={formData.description}
    {disabled}
    class="input-bordered input textarea h-36 w-full"
    placeholder="" />
<div class="flex w-full justify-between">
    <button
        on:click={() => handleDeleteRequest()}
        class="btn-link btn text-error"
        class:loading={isDeleting || disabled || isSubmitting}>
        {#if !isDeleting}
            Delete
        {:else}
            Deleting...
        {/if}
    </button>
    <button
        on:click={() => handleSubmitRequest()}
        class="btn-primary btn mr-2"
        class:loading={isSubmitting || disabled || isDeleting}>
        {#if !isSubmitting}
            Update
        {:else}
            Updating...
        {/if}
    </button>
</div>
