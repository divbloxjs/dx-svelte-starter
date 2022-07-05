<script>
    import profilePictureDefault from "../assets/images/dx_profile_placeholder.svg";

    import MainNav from "../lib/navigation/mainNav.svelte";
    import PageTransitionFade from "../base_components/page_transitions/pageTransitionFade.svelte";
    import MainFooter from "../lib/navigation/mainFooter.svelte";
    import { routeUtilities } from "../lib/js/routeUtilities";
    import ValidatedInput from "../base_components/forms/validatedInput.svelte";
    import { fade } from "svelte/transition";
    import { logout } from "../lib/js/authentication";
    import SingleImageUploader from "../base_components/uploaders/singleImageUploader.svelte";
    import { onMount } from "svelte";

    let validatedDetailInputs = [];
    let validatedPasswordInputs = [];
    let groupedInputComponents = {
        details: validatedDetailInputs,
        password: validatedPasswordInputs,
    };

    const validateInputs = (groupedInputComponents) => {
        let isInputValid = true;
        Object.entries(groupedInputComponents).forEach((entry) => {
            const [sectionName, inputComponent] = entry;
            isInputValid &&= inputComponent.validate(true);
        });

        return isInputValid;
    };

    let tabs = {
        details: "Details",
        password: "Password",
    };

    const updateProfile = (sectionName) => {
        if (validateInputs(groupedInputComponents[sectionName])) {
            console.log("Pretended to submit. Validation passed!");
        } else {
            console.log("Failed to pretend to submit. Validation failed!");
        }
    };

    $: activeTab = Object.keys(tabs)[0];

    let profilePicturePath;

    const loadProfilePicture = async () => {
        //TODO: Update this function to load the profile picture. Here we just simulate a data fetch.
        setTimeout(() => {
            profilePicturePath =
                "https://assets.divblox.com/images/dx-product-overview.jpg";
        }, 2000);
    };

    onMount(async () => {
        await loadProfilePicture();
    });
</script>

<PageTransitionFade>
    <div class="flex flex-col h-screen">
        <MainNav />
        <div
            class="flex flex-grow justify-center content-center items-center divblox-bottom-banner-space"
        >
            <div
                class="card sm:card-side flex flex-col sm:flex-row bg-base-200 shadow-xl m-5 sm:mx-auto max-w-xl align-center justify-center"
            >
                <div
                    class="tabs flex flex-row sm:flex-col tabs-boxed p-2 bg-base-300 rounded-r-none"
                >
                    {#each Object.entries(tabs) as [tabName, tabTitle]}
                        <button
                            class="tab sm:mt-2 mx-auto"
                            class:tab-active={activeTab === tabName}
                            on:click={() => (activeTab = tabName)}
                        >
                            {tabTitle}
                        </button>
                    {/each}
                    <button
                        class="tab sm:mt-2 mx-auto"
                        on:click={() => logout(null, null)}
                    >
                        Logout
                    </button>
                </div>
                {#if activeTab === "details"}
                    <div
                        class="card-body p-5 sm:p-10"
                        in:fade={{ duration: 500 }}
                    >
                        <SingleImageUploader
                            maxHeight="150px"
                            displayAsCircle={true}
                            defaultImagePath={profilePictureDefault}
                            bind:displayImagePath={profilePicturePath}
                        />

                        <div class="card-actions justify-between">
                            <ValidatedInput
                                label="First Name"
                                placeHolder="First Name"
                                type="text"
                                validateAs="required"
                                validationMessage="Please provide a First Name"
                                bind:this={validatedDetailInputs[0]}
                            />
                            <ValidatedInput
                                label="Middle Name(s)"
                                placeHolder="Middle Name"
                                type="text"
                                bind:this={validatedDetailInputs[1]}
                            />
                            <ValidatedInput
                                label="Last Name(s)"
                                placeHolder="Last Name"
                                type="text"
                                validationMessage="Please provide a Last Name"
                                validateAs="required"
                                bind:this={validatedDetailInputs[2]}
                            />
                            <ValidatedInput
                                label="Email Address"
                                placeHolder="Email Address"
                                type="email"
                                validationMessage="Invalid Email"
                                validateAs="email"
                                bind:this={validatedDetailInputs[3]}
                            />
                            <button
                                on:click={routeUtilities.goBack}
                                class="btn btn-link text-base-content mt-2 -ml-1"
                            >
                                Cancel
                            </button>
                            <button
                                class="btn btn-primary mt-2 float-right"
                                on:click={() => updateProfile("details")}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                {:else if activeTab === "password"}
                    <div class="card-body" in:fade={{ duration: 500 }}>
                        <h2 class="text-xl font-bold text-center">
                            Profile here
                        </h2>
                        <div class="card-actions justify-between">
                            <ValidatedInput
                                label="Old Password"
                                placeHolder="Old Password"
                                type="password"
                                validationMessage="Please provide your old password"
                                validateAs="required"
                                bind:this={validatedPasswordInputs[0]}
                            />
                            <ValidatedInput
                                label="Password"
                                placeHolder="Password"
                                type="password"
                                validationMessage="Password too short"
                                validateAs="password"
                                bind:this={validatedPasswordInputs[1]}
                            />
                            <ValidatedInput
                                placeHolder="Confirm Password"
                                type="password"
                                validationMessage="Passwords do not match"
                                validateAs="password"
                                bind:this={validatedPasswordInputs[2]}
                            />
                            <button
                                on:click={routeUtilities.goBack}
                                class="btn btn-link text-base-content mt-2 -ml-1"
                            >
                                Cancel
                            </button>
                            <button
                                class="btn btn-primary mt-2 float-right"
                                on:click={() => updateProfile("password")}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</PageTransitionFade>

<MainFooter />
