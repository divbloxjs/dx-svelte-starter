<script>
    import MainFooter from "../lib/navigation/mainFooter.svelte";
    import { domainRoot, appLogo, appName, defaultLandingPage } from "../lib/js/stores/configurations";
    import { checkAuthentication, authenticate, isAuthenticated } from "../lib/js/stores/authentication";
    import { routeUtilities } from "../lib/js/utilities/routeUtilities";
    import { onMount } from "svelte";
    import PageTransitionFade from "../base_components/page_transitions/pageTransitionFade.svelte";
    import ValidatedInput from "../base_components/forms/validatedInput.svelte";

    let isValid = false;
    let isSubmitting = false;

    let passwordValue = "";
    let validatedInputArray = [];

    onMount(async () => {
        //TODO: Check url parameter for valid token
    });

    const validateForm = () => {
        let formIsValid = 1;
        validatedInputArray.forEach((inputComponent) => {
            formIsValid &= inputComponent.validate(true);
        });

        return formIsValid;
    };

    const doResetPassword = () => {
        //TODO: Check url parameter for valid token before proceeding
        isSubmitting = true;

        if (validateForm()) {
            alert("Coming soon...");
        } else {
            alert("Coming soon but validation failed...");
        }

        isSubmitting = false;
    };

    $: keypress = null;
    $: keypress, handleKeypress();
    const handleKeypress = () => {
        if (keypress === 13) {
            doResetPassword();
        }
    };
</script>

<PageTransitionFade>
    <main class="">
        <div class="card mr-auto ml-auto mt-10 w-11/12 max-w-md bg-base-200 shadow-2xl">
            <figure>
                <a href={domainRoot} class="mt-10 mb-0 w-3/12">
                    <img src={appLogo} alt="{appName} Logo" />
                </a>
            </figure>
            <div class="card-body">
                <h2 class="text-center text-xl font-bold">
                    Reset your {appName} password
                </h2>
                <ValidatedInput
                    bind:keypress
                    placeholder="Password"
                    bind:value={passwordValue}
                    type="password"
                    validateAs="password"
                    label="Password"
                    passwordValidationOption="strong"
                    validationMessage="Password too weak"
                    bind:this={validatedInputArray[1]} />
                <ValidatedInput
                    bind:keypress
                    placeholder="Confirm Password"
                    value=""
                    type="password"
                    validateAs="comparison"
                    label="Confirm Password"
                    compareValue={passwordValue}
                    validationMessage="Passwords do not match"
                    bind:this={validatedInputArray[2]} />

                <div class="card-actions justify-between">
                    <button on:click={routeUtilities.goBack} class="btn btn-link pl-0 text-gray-600"> Cancel </button>
                    <button class="btn btn-primary mr-0" on:click={doResetPassword}> Reset Password </button>
                </div>
            </div>
        </div>
    </main>
</PageTransitionFade>

<MainFooter />
