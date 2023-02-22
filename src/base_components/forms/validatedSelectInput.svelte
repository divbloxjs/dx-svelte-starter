<script>
    import { INPUT_TYPES } from "$src/lib/js/constants/formConstants";
    import { createEventDispatcher, onMount } from "svelte";

    export let disabled = false;
    export let validateAsRequired = false;
    export let isValidated = false;
    export let isValid = false;

    export let label = null;
    export let addLabelClass = "";
    export let requiredLabel = "";
    export let addRequiredLabelClass = "";

    let initValue = "";
    export let selectedValue = "";

    // Options should be of format {value: displayedText}
    export let values = {
        defaultValue: { notSelected: INPUT_TYPES.SELECT.DEFAULT_VALUE },
        options: {},
    };

    export let name = null;
    export let addInputClass = "";
    export let validationMessage = "Invalid value";
    export let hideValidation = false;

    const dispatch = createEventDispatcher();

    onMount(async () => {
        // If a label is provided without a name ('name' attribute is used to match the label to it's
        // corresponding input), the label name is set to the label.
        if (label !== null && name === null) {
            name = label;
        }

        selectedValue = values.defaultValue.notSelected;
        initValue = values.defaultValue.notSelected;
    });

    /**
     * Resets the state to the component to "unvalidated"
     */
    export const resetValidation = () => {
        isValid = false;
        isValidated = false;
    };

    export const resetInput = () => {
        resetValidation();
        selectedValue = INPUT_TYPES.SELECT.DEFAULT_VALUE;
    };

    export const isValidValue = () => {
        return selectedValue !== INPUT_TYPES.SELECT.DEFAULT_VALUE;
    };

    /**
     * @param {boolean} forceValidate
     * @return {boolean} - True if all validation is passed
     */
    export const validate = (forceValidate = false) => {
        // TODO: When required, add additional logic to be triggered if forceValidate is false
        isValid = false;
        if (!validateAsRequired) {
            // No validation
            isValid = true;
        } else if (selectedValue !== values.defaultValue.notSelected) {
            isValid = true;
        }

        isValidated = true;

        return isValid;
    };
</script>

<div class="form-control w-full">
    <label for={name} class="label mb-1">
        {#if label !== null}
            <span class={addLabelClass}>{label}</span>
        {/if}
        {#if !isValid && isValidated && !hideValidation}
            <span class:-mb-2={label !== null} class="label-text-alt ml-auto  text-xs text-red-500">
                {validationMessage}
            </span>
        {:else if !isValidated && requiredLabel !== null && requiredLabel !== undefined && requiredLabel.length > 0}
            <span
                class:-mb-2={label !== null}
                class="label-text-alt ml-auto  text-xs text-red-500 {addRequiredLabelClass}">
                {requiredLabel}
            </span>
        {/if}
    </label>
    <select
        bind:value={selectedValue}
        {name}
        {disabled}
        class="select select-bordered w-full {addInputClass}"
        class:select-error={!isValid && isValidated && !hideValidation}
        class:select-success={isValid && isValidated && !hideValidation}
        {...$$restProps}
        on:change={() => {
            dispatch("change");
            validate(false);
        }}>
        <option disabled={validateAsRequired} value={initValue}> {Object.values(values.defaultValue)[0]}</option>
        {#each Object.entries(values.options) as [value, displayedText]}
            <option {value}>{displayedText}</option>
        {/each}
    </select>
</div>
