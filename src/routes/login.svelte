<script>
    import MainFooter from "../lib/navigation/mainFooter.svelte";
    import { domainRoot, appLogo, appName, defaultLandingPage } from "../lib/js/stores/configurations";
    import { checkAuthentication, authenticate, isAuthenticated } from "../lib/js/stores/authentication";
    import { onMount } from "svelte";
    import PageTransitionFade from "../base_components/page_transitions/pageTransitionFade.svelte";
    import ValidatedInput from "../base_components/forms/validatedInput.svelte";

    let username = "";
    let password = "";

    onMount(async () => {
        await checkAuthentication();
    });

    let validatedInputArray = [];

    const validateForm = () => {
        let formIsValid = 1;
        validatedInputArray.forEach((inputComponent) => {
            formIsValid &= inputComponent.validate(true);
        });

        return formIsValid;
    };

    const doAuthentication = async () => {
        if (!validateForm()) {
            return;
        }
        await authenticate(username, password);
    };

    $: keypress = null;
    $: keypress, handleKeypress();
    const handleKeypress = () => {
        if (keypress === 13) {
            doAuthentication();
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
                        Sign in to {appName}
                    </h2>
                    <ValidatedInput
                        bind:keypress
                        placeholder="Username or Email"
                        type="text"
                        bind:value={username}
                        validateAs="required"
                        label="Username or Email"
                        validationMessage="Required"
                        bind:this={validatedInputArray[0]} />
                    <ValidatedInput
                        bind:keypress
                        placeholder="Password"
                        bind:value={password}
                        type="password"
                        validateAs="required"
                        label="Password"
                        validationMessage="Required"
                        bind:this={validatedInputArray[1]} />
                    <div class="card-actions justify-between">
                        <a href="#/forgot-password" class="btn btn-link pl-0 text-gray-600"> Forgot Password? </a>
                        <button class="btn btn-primary" on:click={doAuthentication}> Sign in </button>
                        <div class="alert flex-col justify-center">
                            <span class="flex-shrink font-extrabold">
                                New to {appName}?
                            </span>
                            <a href="#/create-account" class="btn btn-outline flex-shrink"> Create your account now </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</PageTransitionFade>

<MainFooter />
