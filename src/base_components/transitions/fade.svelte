<script>
    import { fade } from "svelte/transition";

    const startOutro = () => {
        document.body.classList.add("no-scrollbar");
    };

    const endOutro = () => {
        document.body.classList.remove("no-scrollbar");
    };

    export const duration = 200;
    export let classes = "";
</script>

<div
    class={classes}
    in:fade={{ duration: duration, delay: duration + 50 }}
    out:fade={{ duration: duration, delay: 0 }}
    on:outrostart={startOutro}
    on:outroend={endOutro}>
    <slot />
</div>
