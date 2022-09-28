<script>
    import { onMount, createEventDispatcher } from "svelte";
    import ValidatedInput from "$src/base_components/forms/validatedInput.svelte";
    import Swal from "sweetalert2";

    export let modalTitle = "Quick Action";
    export let openOnLoad = false;

    export let firstInputType = "text";
    export let firstInputLabel = "";
    export let firstInputValue = "";
    export let firstInputPlaceholder = "";
    export let validateFirstInputAs = "required";

    export let secondInputLabel = "";
    export let secondInputValue = "";
    export let secondInputPlaceholder = "";

    export let buttonText = "Add";
    export let buttonSubmittingText = "Adding...";
    export let introText = "";
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

    let firstInputComp;
    let secondInputComp;

    let isOpen = false;

    export let isSubmitting = false;

    export const toggleModal = (forceOpen = false, resetValidation = true, resetValues = true) => {
        isOpen = !isOpen;
        if (forceOpen) {
            isOpen = true;
        }

        if (resetValidation) {
            firstInputComp.resetValidation();
        }

        if (resetValues) {
            firstInputValue = "";
            secondInputValue = "";
        }

        if (isOpen) {
            isSubmitting = false;
            setTimeout(() => {
                firstInputComp.focus();
            }, 200);
        }
    };

    onMount(() => {
        if (openOnLoad) {
            toggleModal(true);
        }
    });

    const validateForm = () => {
        return firstInputComp.validate(true);
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
                dispatch("closed");
                toggleModal(false);
            }}
            class="btn btn-link btn-sm absolute right-2 top-2 text-base-content"
            >✕
        </button>
        <h3 class="text-lg font-bold">{modalTitle}</h3>
        {#if introText.length > 0}
            <div class="alert {introClasses} mt-2">{@html introText}</div>
        {/if}
        <div class="form-control mt-2">
            <ValidatedInput
                bind:value={firstInputValue}
                label={firstInputLabel}
                validateAs={validateFirstInputAs}
                {firstInputType}
                bind:this={firstInputComp}
                bind:keypress
                validationMessage="Required"
                name="Quick Action Input"
                placeholder={firstInputPlaceholder} />
            <div class="form-control">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label class="label mb-1">
                    <span class="">{secondInputLabel}</span>
                </label>
                <textarea
                    bind:value={secondInputValue}
                    on:keypress={async (event) => {
                        if (event.keyCode === 13) {
                            await submit();
                        }
                    }}
                    class="input textarea input-bordered h-24 w-full"
                    placeholder={secondInputPlaceholder} />
            </div>
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
