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
    import { onMount } from "svelte";
    import PageTransitionFade from "../base_components/page_transitions/pageTransitionFade.svelte";

    let username = "";
    let password = "";

    onMount(async () => {
        checkAuthentication(() => {});
    });

    const doAuthentication = () => {
        authenticate(username, password, null, null);
    };
</script>

<PageTransitionFade>
    <main class="flex flex-col h-screen">
        <div
            class="flex flex-grow justify-center items-center divblox-bottom-banner-space"
        >
            <div class="card w-11/12 max-w-md bg-base-200 shadow-2xl">
                <figure>
                    <a href={domainRoot} class="w-3/12 mt-10 mb-0">
                        <img src={appLogo} alt="{appName} Logo" />
                    </a>
                </figure>
                <div class="card-body">
                    <h2 class="text-xl font-bold text-center">
                        Sign in to {appName}
                    </h2>
                    <!-- <p>{isAuthenticatedValue}</p> -->
                    <input
                        type="email"
                        placeholder="Username or email"
                        class="input input-bordered w-full"
                        value={username}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        class="input input-bordered w-full"
                        value={password}
                    />

                    <div class="card-actions justify-between">
                        <a
                            href="#/forgot-password"
                            class="btn btn-link text-gray-600 pl-0"
                        >
                            Forgot Password?
                        </a>
                        <button
                            class="btn btn-primary"
                            on:click={doAuthentication}
                        >
                            Sign in
                        </button>
                        <div class="alert flex-col justify-center">
                            <span class="flex-shrink font-extrabold">
                                New to {appName}?
                            </span>
                            <a
                                href="#/create-account"
                                class="flex-shrink btn btn-outline"
                            >
                                Create your account now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</PageTransitionFade>

<MainFooter />
