<script>
    import { onMount, createEventDispatcher } from "svelte";
    import ValidatedInput from "$src/base_components/forms/validatedInput.svelte";
    import Swal from "sweetalert2";

    export let modalTitle = "Quick Action";
    export let openOnLoad = false;
    export let type = "text";
    export let inputLabel = "";
    export let inputValue = "";
    export let inputPlaceholder = "";
    export let buttonText = "Add";
    export let buttonSubmittingText = "Adding...";
    export let introText = "";
    export let validateAs = "required";
    export let introClasses = "alert-success"; // Can include any classes - but expects at least alert-[theme-color]
    export let buttonClasses = "btn-primary"; // Can include any classes - but expects at least btn-[theme-color]
    export let mustConfirm = false;
    export let swalConfig = {
        customClass: {
            popup: "dark:bg-red-100",
            icon: "p-1 my-1",
            confirmButton: "btn btn-error ml-2",
            cancelButton: "btn btn-info",
        },
        padding: "1rem",
        buttonsStyling: false,
        iconColor: "#FF1717",
        icon: "error",
        html: "Are you sure?",
        confirmButtonText: "OK",
        timer: 5000,
        showCancelButton: true,
        reverseButtons: true,
    };

    let quickActionInput;

    let isOpen = false;

    export let isSubmitting = false;

    export const toggleModal = (forceOpen = false) => {
        isOpen = !isOpen;
        if (forceOpen) {
            isOpen = true;
        }

        inputValue = "";
        quickActionInput.resetValidation();

        if (isOpen) {
            isSubmitting = false;
            setTimeout(() => {
                quickActionInput.focus();
            }, 200);
        }
    };

    onMount(() => {
        if (openOnLoad) {
            toggleModal(true);
        }
    });

    const validateForm = () => {
        return quickActionInput.validate(true);
    };

    const dispatch = createEventDispatcher();
    const submit = async () => {
        if (!validateForm()) {
            isSubmitting = false;
            return;
        }

        if (!mustConfirm) {
            isSubmitting = true;
            dispatch("submitted");
            return;
        }

        const result = await Swal.fire(swalConfig);

        if (result.isConfirmed) {
            isSubmitting = true;
            dispatch("submitted");
        }
    };

    $: keypress = null;
    $: keypress, handleKeypress();
    const handleKeypress = async () => {
        if (keypress === 13) {
            await submit();
        }
    };
</script>

<div class="modal" class:modal-open={isOpen}>
    <div class="modal-box relative max-w-xs">
        <button
            on:click={() => {
                toggleModal(false);
            }}
            class="btn btn-circle btn-sm absolute right-2 top-2"
            >✕
        </button>
        <h3 class="text-lg font-bold">{modalTitle}</h3>
        {#if introText.length > 0}
            <div class="alert {introClasses} mt-2">{@html introText}</div>
        {/if}
        <div class="form-control mt-2">
            <ValidatedInput
                bind:value={inputValue}
                label={inputLabel}
                {validateAs}
                {type}
                bind:this={quickActionInput}
                bind:keypress
                validationMessage="Required"
                name="Quick Action Input"
                placeholder={inputPlaceholder} />
            <button on:click={async () => await submit()} class="btn {buttonClasses}" class:loading={isSubmitting}>
                {#if !isSubmitting}
                    {buttonText}
                {:else}
                    {buttonSubmittingText}
                {/if}
            </button>
        </div>
    </div>
</div>
