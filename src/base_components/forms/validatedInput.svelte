<script>
    // This component is used to provide easy validation for basic input fiends
    import { onMount } from "svelte";

    // Configured validation options
    const validationOptions = {
        email: "email",
        required: "required",
        comparison: "comparison",
        password: "password",
        none: "none",
    };

    const passwordValidationOptions = {
        //Minimum 8 characters, at least 1 lowercase letter, 1 uppercase letter and 1 number
        default: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        //Minimum 8 characters, at least 1 lowercase letter, 1 uppercase letter, 1 special character and 1 number
        strong: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[@$!%*#?&]).{8,}$/,
        //Minimum 6 characters, at least 1 letter and 1 number
        relaxed: /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/,
    };

    export let isValidated = false;
    export let isValid = false;

    export let label = null;
    export let addLabelClass = "";

    export let value = "";
    export let name = null;
    export let type = "text";
    export let placeholder = "";

    export let addInputClass = "";
    export let validateAs = validationOptions.none;
    export let validationMessage = "Invalid value";
    export let compareValue = "";
    export let hideValidation = false;
    export let passwordValidationOption = "default";

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

    /**
     * Credit: Rich Harris
     * @param e - the input event triggered
     */
    const handleInput = (e) => {
        value = type.match(/^(number|range)$/)
            ? +e.target.value
            : e.target.value;

        validate();
    };

    /**
     * Resets the state to the component to "unvalidated"
     */
    const resetValidation = () => {
        isValid = false;
        isValidated = false;
    };

    /**
     * Permorms the validation on the specific input type
     *
     * @param forceValidate - Forces the validation to bypass the default skipping of empty fields
     */
    export const validate = (forceValidate = false) => {
        if (!forceValidate && value.length <= 0) {
            resetValidation();
            return;
        }
        switch (validateAs) {
            case validationOptions.email:
                isValid = validateEmail();
                isValidated = true;
                break;
            case validationOptions.required:
                isValid = validateRequired();
                isValidated = true;
                break;
            case validationOptions.password:
                isValid = validatePassword();
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
    };

    const validateEmail = () => {
        return !!value.match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const validateRequired = () => {
        return value !== undefined && value !== null && value !== "";
    };

    const validateComparison = () => {
        return value === compareValue;
    };

    const validatePassword = () => {
        return !!value.match(
            passwordValidationOptions[passwordValidationOption]
        );
    };

    onMount(async () => {
        // If a label is provided without a name ('name' attribute is used to match the label to it's
        // corresponding input), the label name is set to the label.
        if (label !== null && name === null) {
            name = label;
        }
    });
</script>

<div class="form-control w-full max-w-xs">
    <label for={name} class="label mb-1">
        {#if label !== null}
            <span class={addLabelClass}>{label}</span>
        {/if}
        {#if !isValid && isValidated && !hideValidation}
            <span
                class:-mb-2={label !== null}
                class="label-text-alt text-red-500  ml-auto text-xs">
                {validationMessage}
            </span>
        {/if}
    </label>
    <input
        {value}
        {name}
        {type}
        {placeholder}
        class="input input-bordered w-full {addInputClass}"
        class:input-error={!isValid && isValidated && !hideValidation}
        class:input-success={isValid && isValidated && !hideValidation}
        {...$$restProps}
        on:input={handleInput}
        on:change={handleInput} />
</div>
