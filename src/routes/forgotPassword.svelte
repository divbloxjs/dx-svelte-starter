<script>
    import MainFooter from "$src/lib/navigation/mainFooter.svelte";
    import { domainRoot, appLogo, appName, defaultLandingPage } from "$src/lib/js/stores/configurations";
    import { checkAuthentication, authenticate, isAuthenticated } from "$src/lib/js/stores/authentication";
    import { routeUtilities } from "$src/lib/js/utilities/routeUtilities";
    import { onMount } from "svelte";
    import PageTransitionFade from "$src/base_components/page_transitions/pageTransitionFade.svelte";
    import ValidatedInput from "$src/base_components/forms/validatedInput.svelte";

    let emailAddress = "";
    let isValid = false;
    let isSubmitting = false;

    const doSendPasswordResetLink = () => {
        isSubmitting = true;
        alert("Coming soon...");
        isSubmitting = false;
    };

    $: keypress = null;
    $: keypress, handleKeypress();
    const handleKeypress = () => {
        if (keypress === 13) {
            doSendPasswordResetLink();
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
                <!-- <p>{isAuthenticatedValue}</p> -->
                <ValidatedInput
                    bind:keypress
                    placeholder="Email address"
                    type="email"
                    validateAs="email"
                    bind:value={emailAddress}
                    validationMessage="Invalid email address"
                    label="Email Address"
                    requiredLabel="(Required)"
                    bind:isValid />

                <div class="card-actions justify-between">
                    <button on:click={routeUtilities.goBack} class="btn btn-link pl-0 text-gray-600"> Cancel </button>
                    <button class="btn btn-primary" on:click={doSendPasswordResetLink}> Confirm </button>
                </div>
            </div>
        </div>
    </main>
</PageTransitionFade>

<MainFooter />
