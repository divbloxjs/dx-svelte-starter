<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { clickOutsideAction } from "$src/lib/js/actions/clickOutside.action.js";
    import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
    import { horizontalSlide } from "$src/base_components/transitions/slide.js";
    import Fa from "svelte-fa";

    export let modalTitle = "Quick Action";
    export let openOnLoad = false;
    export let crudView = "view";

    let formData;

    export let introText = "";
    export let introClasses = "alert-success"; // Can include any classes - but expects at least alert-[theme-color]
    export let modalClasses = "max-w-sm";

    export let isOpen = false;

    export const toggleModal = (forceOpen = false) => {
        isOpen = !isOpen;
        if (forceOpen) {
            isOpen = true;
        }
    };

    onMount(() => {
        if (openOnLoad) {
            toggleModal(true);
        }
    });

    const dispatch = createEventDispatcher();
</script>

<div class="modal" class:modal-open={isOpen}>
    <div
        class="modal-box relative {modalClasses}"
        use:clickOutsideAction={isOpen}
        on:clickoutside={() => {
            // TODO Add back when we have a way to block clickout from inner components
            // isOpen = false
        }}>
        <button
            on:click={() => {
                dispatch("closed");
                toggleModal(false);
            }}
            class="btn-link btn-sm btn absolute right-2 top-2 text-base-content">
            ✕
        </button>
        <h3 class="flex flex-row items-center text-lg font-bold">
            {#if crudView !== "view"}
                <button
                    transition:horizontalSlide={{ axis: "x", duration: 300, delay: 0 }}
                    class="btn-ghost btn-sm btn mr-2"
                    on:click={() => {
                        crudView = "view";
                    }}>
                    <Fa icon={faArrowLeft} />
                </button>
            {/if}
            {modalTitle}
        </h3>
        {#if introText.length > 0}
            <div class="alert {introClasses} mt-2">{@html introText}</div>
        {/if}
        <slot {formData} />
    </div>
</div>
