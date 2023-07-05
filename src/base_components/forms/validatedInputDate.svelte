<script>
    // This component is used to provide easy validation for basic input fiends
    import { onMount } from "svelte";

    // Configured validation options
    const validationOptions = {
        required: "required",
        comparison: "comparison",
        none: "none",
    };

    export let isValidated = false;
    export let isValid = false;

    export let label = null;
    export let addLabelClass = "";
    export let requiredLabel = "";
    export let addRequiredLabelClass = "";

    export let value = "";
    export let name = null;
    export let placeholder = "";

    export let addInputClass = "";
    export let validateAs = validationOptions.none;
    export let validationMessage = "Invalid value";
    export let compareValue = "";
    export let hideValidation = false;
    export let keypress = "none";

    export let isDisabled = false;

    let element;

    $: compareValueLocal = compareValue;
    $: compareValueLocal, handleCompareValueChanged();

    /**
     * Triggers when the compareValue is changed, and validates only the comparison value
     */
    const handleCompareValueChanged = () => {
        if (validateAs === validationOptions.comparison) {
            validate();
        }
    };

    const handleInput = (e) => {
        validate();
    };

    /**
     * Resets the state to the component to "unvalidated"
     */
    export const resetValidation = () => {
        isValid = false;
        isValidated = false;
    };

    /**
     * Performs the validation on date type
     *
     * @param forceValidate - Forces the validation to bypass the default skipping of empty fields
     * @return {boolean} - True if all validation is passed
     */
    export const validate = (forceValidate = false) => {
        if (!forceValidate && value.length <= 0) {
            resetValidation();
            return;
        }

        switch (validateAs) {
            case validationOptions.required:
                isValid = validateRequired();
                isValidated = true;
                break;
            case validationOptions.comparison:
                isValid = validateRequired();
                isValid = isValid && validateComparison();
                isValidated = true;
                break;
            case validationOptions.none:
                isValid = true;
                isValidated = true;
                break;
            default:
                throw new Error(
                    `Invalid validation type '${validateAs}' passed. \n\n Allowed types: ` +
                        JSON.stringify(Object.keys(validationOptions), null, 2)
                );
        }

        return isValid;
    };

    const validateRequired = () => {
        return value !== undefined && value !== null && value !== "";
    };

    const validateComparison = () => {
        return value === compareValue;
    };

    const handleKeypress = (event) => {
        keypress = event.keyCode;
    };

    export const focus = () => {
        element.focus();
    };

    onMount(async () => {
        // If a label is provided without a name ('name' attribute is used to match the label to it's
        // corresponding input), the label name is set to the label.
        if (label !== null && name === null) {
            name = label;
        }
    });
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
    <input
        bind:value
        {name}
        type="date"
        {placeholder}
        class="input-bordered input w-full {addInputClass}"
        class:input-error={!isValid && isValidated && !hideValidation}
        class:input-success={isValid && isValidated && !hideValidation}
        {...$$restProps}
        disabled={isDisabled}
        on:input={handleInput}
        on:change={handleInput}
        on:keypress={(event) => handleKeypress(event)}
        bind:this={element} />
</div>
