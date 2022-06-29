<script>
    import MainNav from "../lib/navigation/mainNav.svelte";
    import PageTransitionFade from "../base_components/page_transitions/pageTransitionFade.svelte";
    import MainFooter from "../lib/navigation/mainFooter.svelte";
    import { routeUtilities } from "../lib/js/routeUtilities";
    import ValidatedInput from "../base_components/forms/validatedInput.svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import { logout } from "../lib/js/authentication";
    import * as FilePond from "filepond";
    import { accordion } from "../base_components/animations/accordion";

    let tabs = {
        details: "Details",
        password: "Password",
    };

    onMount(async () => {});

    $: activeTab = Object.keys(tabs)[0];
</script>

<PageTransitionFade>
    <MainNav />
    <div class="card sm:card-side bg-base-100 shadow-xl m-10 hidden sm:flex">
        <div class="tabs tabs-boxed p-2 bg-base-200">
            {#each Object.entries(tabs) as [tabName, tabTitle]}
                <button
                    class="tab mx-auto w-full"
                    class:tab-active={activeTab === tabName}
                    on:click={() => (activeTab = tabName)}
                    >{tabTitle}
                </button>
            {/each}
            <button
                class="tab mx-auto w-full"
                on:click={() => logout(null, null)}>
                Logout
            </button>
        </div>
        {#if activeTab === "details"}
            <div class="card-body" in:fade={{ duration: 500 }}>
                <h2 class="text-xl font-bold text-center">Profile here</h2>
                <div class="card-actions justify-between">
                    <ValidatedInput
                        label="First Name"
                        placeHolder="First Name"
                        type="text" />
                    <ValidatedInput
                        label="Middle Name(s)"
                        placeHolder="Middle Name"
                        type="text" />
                    <ValidatedInput
                        label="Last Name(s)"
                        placeHolder="Last Name"
                        type="text" />
                    <ValidatedInput
                        label="Email Address"
                        placeHolder="Email Address"
                        type="email"
                        validationMessage="Invalid Email"
                        validateAs="email" />
                    <button
                        on:click={routeUtilities.goBack}
                        class="btn btn-link text-gray-400 mt-2 pl-0">
                        Cancel
                    </button>
                    <button class="btn btn-primary mt-2 float-right">
                        Save
                    </button>
                </div>
            </div>
        {:else if activeTab === "password"}
            <div class="card-body" in:fade={{ duration: 500 }}>
                <h2 class="text-xl font-bold text-center">Profile here</h2>
                <div class="card-actions justify-between">
                    <ValidatedInput
                        label="Password"
                        placeHolder="Password"
                        type="password"
                        validationMessage="Password too short"
                        validateAs="password" />
                    <ValidatedInput
                        placeHolder="Confirm Password"
                        type="password"
                        validationMessage="Passwords do not match"
                        validateAs="password" />
                    <button
                        on:click={routeUtilities.goBack}
                        class="btn btn-link text-gray-400 mt-2 pl-0">
                        Cancel
                    </button>
                    <button class="btn btn-primary mt-2 float-right">
                        Save
                    </button>
                </div>
            </div>
        {/if}
    </div>

    <div class="w-100 sm:hidden">
        <div class="text-center mt-4">
            <ul class="menu menu-horizontal bg-base-200 rounded-box">
                <li>
                    <a
                        class:bg-primary={activeTab === "details"}
                        on:click={() => (activeTab = "details")}>
                        Details
                    </a>
                </li>
                <li>
                    <a
                        class:bg-primary={activeTab === "password"}
                        on:click={() => (activeTab = "password")}>
                        Password
                    </a>
                </li>
                <li>
                    <a on:click={() => logout(null, null)}>Logout</a>
                </li>
            </ul>
        </div>
        <div class="container -mt-5">
            {#if activeTab === "details"}
                <div class="card-body" in:fade={{ duration: 500 }}>
                    <div class="card-actions justify-between">
                        <ValidatedInput
                            label="First Name"
                            placeHolder="First Name"
                            type="text" />
                        <ValidatedInput
                            label="Middle Name(s)"
                            placeHolder="Middle Name"
                            type="text" />
                        <ValidatedInput
                            label="Last Name(s)"
                            placeHolder="Last Name"
                            type="text" />
                        <ValidatedInput
                            label="Email Address"
                            placeHolder="Email Address"
                            type="email"
                            validationMessage="Invalid Email"
                            validateAs="email" />
                        <button
                            on:click={routeUtilities.goBack}
                            class="btn btn-link text-gray-400 mt-2 pl-0">
                            Cancel
                        </button>
                        <button class="btn btn-primary mt-2 float-right">
                            Save
                        </button>
                    </div>
                </div>
            {:else if activeTab === "password"}
                <div class="card-body" in:fade={{ duration: 500 }}>
                    <div class="card-actions justify-between">
                        <ValidatedInput
                            label="Password"
                            placeHolder="Password"
                            type="password"
                            validationMessage="Password too short"
                            validateAs="password" />
                        <ValidatedInput
                            placeHolder="Confirm Password"
                            type="password"
                            validationMessage="Passwords do not match"
                            validateAs="password" />
                        <button
                            on:click={routeUtilities.goBack}
                            class="btn btn-link text-gray-400 mt-2 pl-0">
                            Cancel
                        </button>
                        <button class="btn btn-primary mt-2 float-right">
                            Save
                        </button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</PageTransitionFade>

<MainFooter />

<style>
    .tabs {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: flex-start;
    }
</style>
