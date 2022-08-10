<script>
    import MainFooter from "../lib/navigation/mainFooter.svelte";
    import { isAuthenticated, checkAuthentication, authenticate } from "$stores/authentication";
    import { domainRoot, appLogo, appName, defaultLandingPage } from "$stores/configurations";
    import { routeUtilities } from "$utilities/routeUtilities";
    import { onMount } from "svelte";
    import PageTransitionFade from "$base_components/page_transitions/pageTransitionFade.svelte";
    import ValidatedInput from "$base_components/forms/validatedInput.svelte";

    let isProcessingRegistration = false;

    let passwordValue = "";
    let validatedInputArray = [];

    onMount(async () => {
        await checkAuthentication(null, "/");
    });

    const validateForm = () => {
        let formIsValid = 1;
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

    $: keypress = null;
    $: keypress, handleKeypress();
    const handleKeypress = () => {
        if (keypress === 13) {
            doCreateAccount();
        }
    };
</script>

<PageTransitionFade>
    <main class="flex h-screen flex-col">
        <div class="divblox-bottom-banner-space flex flex-grow items-center justify-center">
            <div class="card w-11/12 max-w-md bg-base-200 shadow-2xl">
                <figure>
                    <a href={domainRoot} class="mt-10 mb-0 w-3/12">
                        <img src={appLogo} alt="{appName} Logo" />
                    </a>
                </figure>
                <div class="card-body">
                    <h2 class="text-center text-xl font-bold">
                        Create your {appName} account
                    </h2>
                    <ValidatedInput
                        bind:keypress
                        placeholder="Email address"
                        type="email"
                        validateAs="email"
                        label="Email"
                        validationMessage="Invalid email address"
                        bind:this={validatedInputArray[0]} />
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
                        <button on:click={routeUtilities.goBack} class="btn btn-link pl-0 text-gray-600">
                            Cancel
                        </button>
                        <button
                            class:loading={isProcessingRegistration}
                            class="btn btn-primary mr-0"
                            on:click={doCreateAccount}>
                            {#if isProcessingRegistration}
                                Registering...
                            {:else}
                                Register
                            {/if}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</PageTransitionFade>

<MainFooter />
