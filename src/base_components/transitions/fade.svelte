<script>
    import { fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let displayClass = "hidden";
    let isHidden = true;

    const startOutro = () => {
        displayClass = "hidden";
        isHidden = true;
        // document.body.classList.add("no-scrollbar");
    };

    const endOutro = () => {
        displayClass = "";
        isHidden = false;
        // document.body.classList.remove("no-scrollbar");
        // dispatch("endedFadeIn");
    };

    const startIntro = () => {
        displayClass = "hidden";
        isHidden = true;
        // document.body.classList.add("no-scrollbar");
    };

    const endIntro = () => {
        displayClass = "";
        isHidden = false;
        // document.body.classList.remove("no-scrollbar");
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
