<script>
    import MainFooter from "$src/lib/navigation/mainFooter.svelte";
    import { domainRoot, appLogo, appName, defaultLandingPage } from "$src/lib/js/stores/configurations";
    import { checkAuthentication, authenticate, isAuthenticated } from "$src/lib/js/stores/authentication";
    import { onMount } from "svelte";
    import PageTransitionFade from "$src/base_components/page_transitions/pageTransitionFade.svelte";
    import { successToast, errorAlert, errorToast } from "$src/lib/js/utilities/swalMixins";
    import ValidatedInput from "$src/base_components/forms/validatedInput.svelte";
    import { get, writable } from "svelte/store";

    export let params = {};

    let username = "";
    let password = "";
    let isProcessingAuthentication = false;
    let redirectPath = defaultLandingPage;

    const loginUrlParams = writable(JSON.parse(localStorage.getItem("loginUrlParams")) || {});
    loginUrlParams.subscribe((val) => {
        if (Object.keys(val).length === 0) {
            // When authenticated, this is unset
            localStorage.removeItem("loginUrlParams");
            return;
        }

        localStorage.setItem("loginUrlParams", JSON.stringify(val));
    });

    let validatedInputArray = [];

    const validateForm = () => {
        let formIsValid = 1;
        validatedInputArray.forEach((inputComponent) => {
            formIsValid &= inputComponent.validate(true);
        });

        return formIsValid;
    };

    onMount(async () => {
        if (params.message !== undefined) {
            for (const [key, value] of Object.entries(params)) {
                params[key] = decodeURIComponent(value);
            }
            loginUrlParams.set(params);
        }

        if (get(loginUrlParams).message !== undefined) {
            switch (get(loginUrlParams).message) {
                case "registration-success":
                    displayPostRegistrationMessage(true);
                    break;
                case "registration-failed":
                    displayPostRegistrationMessage(false);
                    break;
                case "password-reset-success":
                    displayPostPasswordResetMessage(true);
                    break;
                case "password-reset-failed":
                    displayPostPasswordResetMessage(false);
                    break;
                case "account-verification-authentication-failed":
                    redirectPath = "/" + get(loginUrlParams).redirect;
                    displayRedirectReasonMessage("Please login before confirming email address");
                    break;
                default:
                    break;
            }
        }

        if (await checkAuthentication(null, redirectPath)) {
            localStorage.removeItem("loginUrlParams");
        }
    });

    const doAuthentication = async () => {
        isProcessingAuthentication = true;
        if (!validateForm()) {
            isProcessingAuthentication = false;
            return;
        }

        if (await authenticate(username, password, redirectPath)) {
            localStorage.removeItem("loginUrlParams");
        }

        isProcessingAuthentication = false;
    };

    const displayPostRegistrationMessage = (isSuccess = false) => {
        isSuccess
            ? successToast.fire({ title: "Registration successful" })
            : errorAlert.fire({
                  icon: "error",
                  html: "Something went wrong with your registration. <br>Please try again.",
                  confirmButtonText: "OK",
              });
    };

    const displayPostPasswordResetMessage = (isSuccess = true) => {
        isSuccess
            ? successToast.fire({ title: "Password reset successfully" })
            : errorAlert.fire({
                  icon: "error",
                  html: "Something went wrong while resetting your password. <br>Please try again.",
                  confirmButtonText: "OK",
              });
    };

    const displayRedirectReasonMessage = (message) => {
        errorToast.fire({ title: message, timer: 5000 });
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
                        <a
                            href="#/forgot-password"
                            class="btn btn-link pl-0 text-gray-600"
                            class:hidden={isProcessingAuthentication}>
                            Forgot Password?
                        </a>
                        <button
                            class:mx-auto={isProcessingAuthentication}
                            class:mr-0={!isProcessingAuthentication}
                            class:loading={isProcessingAuthentication}
                            class="btn btn-primary"
                            on:click={doAuthentication}>
                            {#if isProcessingAuthentication}
                                Working...
                            {:else}
                                Sign in
                            {/if}
                        </button>
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
