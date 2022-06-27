<script>
    import MainFooter from "../lib/navigation/mainFooter.svelte";
    import {
        domainRoot,
        isAuthenticated,
        appLogo,
        appName,
        defaultLandingPage,
    } from "../lib/js/stores";
    import {
        checkAuthentication,
        authenticate,
    } from "../lib/js/authentication";
    import { routeUtilities } from "../lib/js/routeUtilities";
    import { onMount } from "svelte";
    import PageTransitionFade from "../base_components/page_transitions/pageTransitionFade.svelte";
    import ValidatedInput from "../base_components/forms/validatedInput.svelte";

    let isProcessingRegistration = false;

    let passwordValue = "";
    let validatedInputArray = [];

    onMount(async () => {
        checkAuthentication(null, null, null, "/");
    });

    const validateForm = () => {
        let formIsValid = true;
        validatedInputArray.forEach((inputComponent) => {
            formIsValid &= inputComponent.validate(true);
        });

        return formIsValid;
    };

    const doCreateAccount = async () => {
        isProcessingRegistration = true;

        if (validateForm()) {
            alert("Coming soon...");
        } else {
            alert("Coming soon but validation failed...");
        }

        isProcessingRegistration = false;
    };
</script>

<PageTransitionFade>
    <main class="">
        <div
            class="card w-11/12 max-w-md bg-base-200 shadow-2xl mr-auto ml-auto mt-10">
            <figure>
                <a href={domainRoot} class="w-3/12 mt-10 mb-0">
                    <img src={appLogo} alt="{appName} Logo" />
                </a>
            </figure>
            <div class="card-body">
                <h2 class="text-xl font-bold text-center">
                    Create your {appName} account
                </h2>
                <ValidatedInput
                    placeholder="Email address"
                    type="email"
                    validateAs="email"
                    label="Email"
                    validationMessage="Invalid email address"
                    bind:this={validatedInputArray[0]} />
                <ValidatedInput
                    placeholder="Password"
                    bind:value={passwordValue}
                    type="password"
                    validateAs="password"
                    label="Password"
                    passwordValidationOption="strong"
                    validationMessage="Password too weak"
                    bind:this={validatedInputArray[1]} />
                <ValidatedInput
                    placeholder="Confirm password"
                    value=""
                    type="password"
                    validateAs="comparison"
                    label="Confirm Password"
                    compareValue={passwordValue}
                    validationMessage="Passwords do not match"
                    bind:this={validatedInputArray[2]} />

                <div class="card-actions justify-between">
                    <button
                        on:click={routeUtilities.goBack}
                        class="btn btn-link text-gray-600 pl-0">
                        Cancel
                    </button>
                    <button
                        class:btn-disabled={isProcessingRegistration}
                        class:btn-primary={!isProcessingRegistration}
                        class="btn mr-0"
                        on:click={doCreateAccount}>
                        {#if isProcessingRegistration}
                            Working...
                        {:else}
                            Register
                        {/if}
                    </button>
                </div>
            </div>
        </div>
    </main>
</PageTransitionFade>

<MainFooter />
