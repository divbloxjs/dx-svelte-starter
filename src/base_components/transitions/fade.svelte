<script>
    import { fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let displayClass = "hidden";
    let isHidden = true;

    const startOutro = () => {
        displayClass = "hidden";
        isHidden = true;
    };

    const endOutro = () => {
        displayClass = "";
        isHidden = false;
    };

    const startIntro = () => {
        displayClass = "hidden";
        isHidden = true;
    };

    const endIntro = () => {
        displayClass = "";
        isHidden = false;
        dispatch("endedFadeIn");
    };

    export let duration = 200;
    export let classes = "";
</script>

<div
    class="{classes} {displayClass}"
    in:fade={{ duration: duration, delay: duration }}
    out:fade={{ duration: duration, delay: 0 }}
    on:outrostart={startOutro}
    on:introstart={startIntro}
    on:introend={endIntro}
    on:outroend={endOutro}>
    <slot />
</div>
