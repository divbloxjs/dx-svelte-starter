<script>
    import Fa from "svelte-fa";
    import { faMagnifyingGlass, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
    import { fly } from "svelte/transition";
    import { createEventDispatcher } from "svelte";
    import { sleep } from "$src/lib/js/utilities/helpers.js";

    export let enableSearch = true;
    export let enableRefresh = true;
    export let enableNewButton = true;

    export let newButtonOptions = {
        btnClasses: "",
        faIcon: faPlus,
        displayLabel: "New",
        faClasses: "sm:mr-2",
        clickEvent: "create_clicked"
    };

    export let searchValue = "";
    export let searchPlaceholder = "Search...";
    export let globalLoading = false;

    const dispatch = createEventDispatcher();

    const actionTriggered = async (type) => {
        requestPendingStates[type].visible = true;
        requestPendingStates[type].loading = true;


        let params;
        switch (type) {
            case "search":
                params = { clickEvent: "search_clicked", searchValue: searchValue };
                break;
            case "refresh":
                params = { clickEvent: "refresh_clicked" };
                break;
            case "create":
                params = { clickEvent: "create_clicked" };
                break;
        }

        dispatch("actionTriggered", params);

        await sleep(() => {
        });

        requestPendingStates[type].visible = false;
        requestPendingStates[type].loading = false;


    };

    let requestPendingStates = {
        search: {
            visible: false,
            loading: false
        },
        refresh: {
            visible: false,
            loading: false
        },
        create: {
            visible: false,
            loading: false
        }
    };

</script>

<div class="w-full">
    <div class="flow-root">
        <div class="float-left flex items-end">
            <div class="relative w-40 sm:w-80 md:w-80">
                {#if enableSearch === true}
                    <div class="form-control my-auto mr-2">
                        <div class="relative -mb-2">
                            <input
                                type="text"
                                bind:value={searchValue}
                                on:keypress={async (event) => {
                            if (globalLoading) {
                                return;
                            }
                            if (event.keyCode === 13) {
                                await actionTriggered("search");
                            }
                        }}
                                on:change={async () => {
                            if (globalLoading) {
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
                                if (globalLoading) {
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
            <div class="">
                {#if enableRefresh === true}
                    <button
                        class="custom-btn-loading btn btn-sm"
                        class:loading={requestPendingStates.refresh.loading}
                        on:click={async () => {
                    if (globalLoading) {
                        return;
                    }

                    await actionTriggered("refresh");
                }}>
                <span class:hidden={requestPendingStates.refresh.loading}>
                    <Fa icon={faTimes} size="1.1x" />
                </span>
                    </button>
                {/if}
            </div>
        </div>
        <div class="float-right">
            <div class="">
                {#if enableNewButton}
                    <button
                        class="btn btn-primary btn-sm {newButtonOptions.hasOwnProperty('btnClasses')
                                ? newButtonOptions.btnClasses
                                : ''}"
                        on:click={() => {
                                actionTriggered("create");
                            }}>
                        {#if newButtonOptions.hasOwnProperty("faIcon")}
                            <Fa
                                icon={newButtonOptions.faIcon}
                                size="1.1x"
                                class={newButtonOptions.hasOwnProperty("faClasses")
                                        ? newButtonOptions.faClasses
                                        : ""} />
                        {/if}
                        {#if newButtonOptions.hasOwnProperty("displayLabel")}
                            <span class="hidden xs:flex">{newButtonOptions.displayLabel}</span>
                        {/if}
                    </button>
                {/if}
            </div>
        </div>
    </div>
</div>
