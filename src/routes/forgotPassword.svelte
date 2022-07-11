<script>
    import MainFooter from "../lib/navigation/mainFooter.svelte";
    import {
        domainRoot,
        appLogo,
        appName,
        defaultLandingPage,
    } from "../lib/js/stores/configurations";
    import {
        checkAuthentication,
        authenticate,
        isAuthenticated,
    } from "../lib/js/stores/authentication";
    import { routeUtilities } from "../lib/js/utilities/routeUtilities";
    import { onMount } from "svelte";
    import PageTransitionFade from "../base_components/page_transitions/pageTransitionFade.svelte";

    let username = "";

    const doSendPasswordResetLink = () => {
        alert("Coming soon...");
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
                    Reset your {appName} password
                </h2>
                <!-- <p>{isAuthenticatedValue}</p> -->
                <input
                    type="email"
                    placeholder="Username or email"
                    class="input input-bordered w-full"
                    value={username} />

                <div class="card-actions justify-between">
                    <button
                        on:click={routeUtilities.goBack}
                        class="btn btn-link text-gray-600 pl-0">
                        Cancel
                    </button>
                    <button
                        class="btn btn-primary"
                        on:click={doSendPasswordResetLink}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </main>
</PageTransitionFade>

<MainFooter />
