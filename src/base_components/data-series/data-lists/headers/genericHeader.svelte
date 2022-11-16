<script>
    import Fa from "svelte-fa";
    import { faMagnifyingGlass, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
    import { fly } from "svelte/transition";
    import { createEventDispatcher } from "svelte";

    export let loading = false; // TODO convert to store if becoming more complicated with state management of subcomponents
    export let enableSearch = true;
    export let enableRefresh = true;
    export let enableCreate = true;

    export let createButtonOptions = {
        btnClasses: "",
        faIcon: faPlus,
        displayLabel: "New",
        faClasses: "xs:pr-2",
        clickEvent: "create_clicked",
    };

    export let searchValue = "";
    export let searchPlaceholder = "Search...";

    export const setGlobalLoading = (newLoading) => {
        loading = newLoading;

        if (!loading) {
            resetPendingStates();
        }
    };

    const resetPendingStates = async () => {
        if (!loading) {
            for (const [type, pendingStateInfo] of Object.entries(requestPendingStates)) {
                requestPendingStates[type].visible = false;
                requestPendingStates[type].loading = false;
            }
        }
    };

    const dispatch = createEventDispatcher();

    const actionTriggered = async (type) => {
        loading = true;
        requestPendingStates[type].visible = true;
        requestPendingStates[type].loading = true;
        let params;
        switch (type) {
            case "search":
                params = { clickEvent: "search_clicked", searchValue: searchValue };
                break;
            case "refresh":
                searchValue = "";
                params = { clickEvent: "refresh_clicked" };
                break;
            case "create":
                params = { clickEvent: "create_clicked" };
                break;
        }

        dispatch("actionTriggered", params);
        // Return state change handled by calling setGlobalLoading()
    };

    let requestPendingStates = {
        search: {
            visible: false,
            loading: false,
        },
        refresh: {
            visible: false,
            loading: false,
        },
        create: {
            visible: false,
            loading: false,
        },
    };
</script>

<div class="w-full">
    <div class="flex">
        <div class="grow">
            <div class="relative">
                {#if enableSearch === true}
                    <div class="form-control my-auto">
                        <div class="relative -mb-2">
                            <input
                                type="text"
                                bind:value={searchValue}
                                on:keypress={async (event) => {
                                    if (loading) {
                                        return;
                                    }
                                    if (event.keyCode === 13) {
                                        await actionTriggered("search");
                                    }
                                }}
                                on:change={async () => {
                                    if (loading) {
                                        return;
                                    }
                                    await actionTriggered("search");
                                }}
                                on:focus={(event) => {
                                    event.target.select();
                                    requestPendingStates.search.visible = true;
                                }}
                                on:blur={(event) => {
                                    if (
                                        !requestPendingStates.search.loading &&
                                        event.relatedTarget !== event.currentTarget.parentNode.lastChild
                                    ) {
                                        requestPendingStates.search.visible = false;
                                    }
                                }}
                                placeholder={searchPlaceholder}
                                class="input input-bordered input-sm w-full pr-16" />
                            {#if requestPendingStates.search.loading || requestPendingStates.search.visible}
                                <button
                                    transition:fly={{ x: 10, duration: 250 }}
                                    class:loading={requestPendingStates.search.loading}
                                    class="custom-btn-loading btn btn-primary btn-sm absolute top-0 right-0 mr-0 rounded-l-none"
                                    on:click={async () => {
                                        if (loading) {
                                            return;
                                        }
                                        requestPendingStates.search.visible = true;
                                        await actionTriggered("search");
                                        requestPendingStates.search.visible = false;
                                    }}>
                                    <span class:hidden={requestPendingStates.search.loading}>
                                        <Fa icon={faMagnifyingGlass} size="1.1x" />
                                    </span>
                                </button>
                            {/if}
                        </div>
                    </div>
                {/if}
            </div>
        </div>
        {#if enableRefresh === true}
            <button
                class="custom-btn-loading btn btn-sm ml-2"
                class:loading={requestPendingStates.refresh.loading}
                on:click={async () => {
                    if (loading) {
                        return;
                    }

                    await actionTriggered("refresh");
                }}>
                <span class:hidden={requestPendingStates.refresh.loading}>
                    <Fa icon={faTimes} size="1.1x" />
                </span>
            </button>
        {/if}
        {#if enableCreate}
            <button
                class="btn btn-primary btn-sm ml-2 {createButtonOptions.hasOwnProperty('btnClasses')
                    ? createButtonOptions.btnClasses
                    : ''}"
                on:click={() => {
                    actionTriggered("create");
                }}>
                {#if createButtonOptions.hasOwnProperty("faIcon")}
                    <Fa
                        icon={createButtonOptions.faIcon}
                        size="1.1x"
                        class={createButtonOptions.hasOwnProperty("faClasses") ? createButtonOptions.faClasses : ""} />
                {/if}
                {#if createButtonOptions.hasOwnProperty("displayLabel")}
                    <span class="hidden xs:flex">{createButtonOptions.displayLabel}</span>
                {/if}
            </button>
        {/if}
    </div>
</div>
