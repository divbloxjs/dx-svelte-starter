<script>
    import { onMount } from "svelte";

    export let isValidated = false;
    export let isValid = false;

    export let label = null;
    export let addLabelClass = "";
    export let requiredLabel = "";
    export let addRequiredLabelClass = "";

    export let value = "";
    export let name = null;
    export let type = "text";
    export let placeholder = "";

    export let addInputClass = "";
    export let currentValidationValue = "Invalid value";
    export let compareValue = "";
    export let hideValidation = false;
    export let passwordValidationOption = "default";

    onMount(async () => {
        // If a label is provided without a name ('name' attribute is used to match the label to it's
        // corresponding input), the label name is set to the label.
        if (label !== null && name === null) {
            name = label;
        }
    });

    const handleInput = (e) => {
        // in here, you can switch on type and implement
        // whatever behaviour you need
        value = type.match(/^(number|range)$/)
            ? +e.target.value
            : e.target.value;
    };

    export const toggleValidationState = async (
        validationState = false,
        validationMessage = "",
        resetInput = false
    ) => {
        isValidated = true;
        isValid = validationState;
        currentValidationValue = validationMessage;

        if (resetInput) {
            value = "";
        }
    };

    export const resetValidationState = async () => {
        isValidated = false;
        value = "";
    };
</script>

<div class="form-control w-full">
    <label for={name} class="label mb-1">
        {#if label !== null}
            <span class={addLabelClass}>{label}</span>
        {/if}
        {#if isValidated && !hideValidation}
            <span
                class:-mb-2={label !== null}
                class:text-red-500={!isValid}
                class:text-green-500={isValid}
                class="label-text-alt ml-auto text-xs">
                {currentValidationValue}
            </span>
        {:else if !isValidated && requiredLabel !== null && requiredLabel !== undefined && requiredLabel.length > 0}
            <span
                class:-mb-2={label !== null}
                class="label-text-alt ml-auto text-red-500 text-xs {addRequiredLabelClass}">
                {requiredLabel}
            </span>
        {/if}
    </label>
    <input
        {value}
        {name}
        {type}
        {placeholder}
        {...$$restProps}
        class:input-error={!isValid && isValidated && !hideValidation}
        class:input-success={isValid && isValidated && !hideValidation}
        class="input input-bordered w-full {addInputClass}"
        on:change={handleInput} />
</div>
