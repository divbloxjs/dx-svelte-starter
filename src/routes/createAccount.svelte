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

    let username = "";
    let password = "";
    let passwordConfirm = "";
    let isProcessingRegistration = false;
    let isValid = [];

    onMount(async () => {
        checkAuthentication(null, null, null, "/");
    });

    const doCreateAccount = async () => {
        isProcessingRegistration = true;
        if (testValidation()) {
            alert("Coming soon...");
        } else {
            alert("Coming soon but validation failed...");
        }
        isProcessingRegistration = true;
    };

    const testValidation = () => {
        for (const key of Object.keys(isValid)) {
            if (!isValid[key]) {
                return false;
            }
        }
        return true;
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
                    validationMessage="Invalid email address"
                    bind:isValid={isValid[0]} />
                <ValidatedInput
                    placeholder="Password"
                    bind:value={password}
                    type="password"
                    validateAs="password"
                    passwordValidationOption="strong"
                    validationMessage="Password too weak"
                    bind:isValid={isValid[1]} />
                <ValidatedInput
                    placeholder="Confirm password"
                    bind:value={passwordConfirm}
                    type="password"
                    validateAs="comparison"
                    compareValue={password}
                    validationMessage="Passwords do not match"
                    bind:isValid={isValid[2]} />

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
