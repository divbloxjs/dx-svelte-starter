<script>
    const validationOptions = {
        email: "email",
        required: "required",
        comparison: "comparison",
        password: "password",
        none: "none",
    };

    const passwordValidationOptions = {
        "default": /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        //TODO: Figure out why these don't work
        //Minimum eight characters, at least one letter and one number
        0: /^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$/,
        //Minimum eight characters, at least one letter, one number and one special character
        1: /^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,}$/,
        //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
        2: /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)[a-zA-Zd]{8,}$/,
        //Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
        3: /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$/,
        //Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character
        4: /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,10}$/,
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
    export let passwordValidationOption = "default";

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
            case validationOptions.password:
                isValid = validatePassword();
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

    const validateComparison = () => {
        return value === compareValue;
    };

    const validatePassword = () => {
        console.log("Matching on2: "+passwordValidationOptions[passwordValidationOption].toString());
        return !!value.match(passwordValidationOptions[passwordValidationOption]);
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
    on:change={handleInput}
/>
{#if !isValid && isValidated && !hideValidation}
    <div class="text-red-500 text-xs w-full text-right mt-1">
        {validationMessage}
    </div>
{/if}
