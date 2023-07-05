<script>
    import { onMount, createEventDispatcher } from "svelte";
    import { clickOutsideAction } from "$src/lib/js/actions/clickOutside.action.js";

    export let modalTitle = "Quick Action";
    export let openOnLoad = false;

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

<div class="modal {modalClasses}" class:modal-open={isOpen}>
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
        <h3 class="text-lg font-bold">{modalTitle}</h3>
        {#if introText.length > 0}
            <div class="alert {introClasses} mt-2">{@html introText}</div>
        {/if}
        <slot {formData} />
    </div>
</div>
