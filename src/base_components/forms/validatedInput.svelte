<script>
    export const validationOptions = {
        email: "email",
        required: "required",
        regex: "regex",
        comparison: "comparison",
        none: "none",
    };

    let isValidated = false;
    let isValid = false;

    export let value = "";
    export let type = "text";
    export let placeholder = "";
    export let inputClass = "input input-bordered w-full mt-2";
    export let validateAs = validationOptions.none;
    export let validationMessage = "Invalid value";
    export let compareValue = "";
    export let hideValidation = false;

    const handleInput = (e) => {
        value = type.match(/^(number|range)$/)
            ? +e.target.value
            : e.target.value;
        validate();
    };

    export const validate = () => {
        switch (validateAs) {
            case validationOptions.email:
                isValid = validateEmail();
                isValidated = true;
                break;
            case validationOptions.required:
                isValid = validateRequired();
                isValidated = true;
                break;
            case validationOptions.regex:
                isValid = validateExpression();
                isValidated = true;
                break;
            case validationOptions.comparison:
                isValid = validateComparison();
                isValidated = true;
                break;
            case validationOptions.none:
            default:
                isValid = true;
                isValidated = true;
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

    const validateExpression = () => {
        const regEx = new RegExp(compareValue, 'gi');
        return !!value.match(regEx);
    };

    const validateComparison = () => {
        console.log("Value: "+value+"; Comp: "+compareValue);
        return value === compareValue;
    };
</script>

<input
    {value}
    {type}
    {placeholder}
    class={inputClass}
    class:input-error={!isValid && isValidated && !hideValidation}
    class:input-success={isValid && isValidated && !hideValidation}
    on:input={handleInput}
/>
{#if !isValid && isValidated && !hideValidation}
    <div class="text-red-500 text-xs w-full text-right mt-1">
        {validationMessage}
    </div>
{/if}
