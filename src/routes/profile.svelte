<script>
    import { profilePicturePath, updateProfilePicturePath } from "$stores/userData";
    import profilePictureDefault from "$assets/images/dx_profile_placeholder.svg";

    import MainNav from "$navigation/mainNav.svelte";
    import PageTransitionFade from "$base_components/page_transitions/pageTransitionFade.svelte";
    import QuickActionsMenu from "$navigation/quickActionsMenu.svelte";
    import { routeUtilities } from "$utilities/routeUtilities";
    import ValidatedInput from "$base_components/forms/validatedInput.svelte";
    import { fade } from "svelte/transition";
    import { checkAuthentication, logout } from "$stores/authentication";
    import SingleImageUploader from "$base_components/uploaders/singleImageUploader.svelte";
    import { onMount } from "svelte";

    let profilePictureUploadResponse = {};
    $: profilePictureUploadResponse, onProfilePictureUploaded();

    let isUpdating = false;

    const onProfilePictureUploaded = () => {
        console.dir(profilePictureUploadResponse);
        if (profilePictureUploadResponse !== {} && profilePictureUploadResponse.uploadError === "undefined") {
            // TODO Interogate profilePictureUploadResponse for file static path or error, if needed
            updateProfilePicturePath();
        }

        if ("uploadError" in profilePictureUploadResponse) {
            // TODO handle error as needed
            console.log(profilePictureUploadResponse.message);
            return;
        }
    };

    let passwordValue;
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
            // @ts-ignore
            isInputValid &= inputComponent.validate(true);
        });

        return isInputValid;
    };

    let tabs = {
        details: "Details",
        password: "Password",
    };

    const updateProfile = () => {
        isUpdating = true;
        if (validateInputs(groupedInputComponents[activeTab])) {
            console.log("Pretended to submit. Validation passed!");
        } else {
            console.log("Failed to pretend to submit. Validation failed!");
        }
        isUpdating = false;
    };

    $: activeTab = Object.keys(tabs)[0];

    onMount(async () => {
        await checkAuthentication("/login", null);
        await updateProfilePicturePath();
    });

    $: keypress = null;
    $: keypress, handleKeypress();
    const handleKeypress = () => {
        if (keypress === 13) {
            updateProfile();
        }
    };
</script>

<PageTransitionFade>
    <div class="flex h-screen flex-col">
        <MainNav />
        <div class="divblox-bottom-banner-space flex flex-grow content-center justify-center">
            <div
                class="align-center card m-5 mb-[calc(1.25rem+54px)] flex max-w-xl flex-col justify-center bg-base-200 shadow-xl sm:card-side sm:mx-auto sm:flex-row md:max-w-2xl">
                <div class="tabs tabs-boxed flex flex-row rounded-r-none bg-base-300 p-2 sm:w-64 sm:flex-col">
                    {#each Object.entries(tabs) as [tabName, tabTitle]}
                        <button
                            class="tab mx-auto sm:mt-2"
                            class:tab-active={activeTab === tabName}
                            on:click={() => (activeTab = tabName)}>
                            {tabTitle}
                        </button>
                    {/each}
                    <button class="tab mx-auto sm:mt-2" on:click={async () => logout()}> Logout </button>
                </div>
                {#if activeTab === "details"}
                    <div class="card-body w-full p-5 sm:p-10" in:fade={{ duration: 500 }}>
                        <SingleImageUploader
                            maxHeight="150px"
                            uploadEndpoint="http://localhost/"
                            displayAsCircle={true}
                            defaultImagePath={profilePictureDefault}
                            bind:uploadResponse={profilePictureUploadResponse}
                            bind:displayImagePath={$profilePicturePath} />

                        <div class="card-actions justify-between">
                            <ValidatedInput
                                bind:keypress
                                label="First Name"
                                placeHolder="First Name"
                                type="text"
                                validateAs="required"
                                validationMessage="Please provide a First Name"
                                bind:this={validatedDetailInputs[0]} />
                            <ValidatedInput
                                bind:keypress
                                label="Middle Name(s)"
                                placeHolder="Middle Name"
                                type="text"
                                bind:this={validatedDetailInputs[1]} />
                            <ValidatedInput
                                bind:keypress
                                label="Last Name(s)"
                                placeHolder="Last Name"
                                type="text"
                                validationMessage="Please provide a Last Name"
                                validateAs="required"
                                bind:this={validatedDetailInputs[2]} />
                            <ValidatedInput
                                bind:keypress
                                label="Email Address"
                                placeHolder="Email Address"
                                type="email"
                                validationMessage="Invalid Email"
                                validateAs="email"
                                bind:this={validatedDetailInputs[3]} />
                            <button on:click={routeUtilities.goBack} class="btn btn-link mt-2 -ml-1 text-base-content">
                                Cancel
                            </button>
                            <button
                                class:loading={isUpdating}
                                class="btn btn-primary float-right mt-2"
                                on:click={() => updateProfile()}>
                                {#if isUpdating}
                                    Saving...
                                {:else}
                                    Save
                                {/if}
                            </button>
                        </div>
                    </div>
                {:else if activeTab === "password"}
                    <div class="card-body w-full p-5 sm:p-10" in:fade={{ duration: 500 }}>
                        <div class="card-actions justify-between">
                            <ValidatedInput
                                bind:keypress
                                placeholder="Password"
                                bind:value={passwordValue}
                                type="password"
                                validateAs="password"
                                label="Password"
                                passwordValidationOption="strong"
                                validationMessage="Password too weak"
                                bind:this={validatedPasswordInputs[0]} />
                            <ValidatedInput
                                bind:keypress
                                placeholder="Confirm Password"
                                value=""
                                type="password"
                                validateAs="comparison"
                                label="Confirm Password"
                                compareValue={passwordValue}
                                validationMessage="Passwords do not match"
                                bind:this={validatedPasswordInputs[1]} />
                            <button on:click={routeUtilities.goBack} class="btn btn-link mt-2 -ml-1 text-base-content">
                                Cancel
                            </button>
                            <button
                                class:loading={isUpdating}
                                class="btn btn-primary float-right mt-2"
                                on:click={() => updateProfile()}>
                                {#if isUpdating}
                                    Saving...
                                {:else}
                                    Save
                                {/if}
                            </button>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
    <QuickActionsMenu />
</PageTransitionFade>
