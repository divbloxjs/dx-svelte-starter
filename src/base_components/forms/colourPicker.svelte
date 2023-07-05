<script>
    import { checkIfValidHexCode, getColourCombinationCss, isIos } from "$src/lib/js/utilities/helper.utilities.js";
    import { errorToast } from "$src/lib/js/utilities/swalMixins.utilities.js";
    import { createEventDispatcher, onMount } from "svelte";

    export let colourHexCode = "";

    // Needs to be unique on page to prevent duplicate input IDs - used for label/input clicks
    export let uniqueInputName;

    const dispatch = createEventDispatcher();

    onMount(() => {
        if (!uniqueInputName) {
            throw Error("No input name given for colour input");
            return;
        }
    });

    let previousColourHexCode = "";
    let labelClasses = "alert cursor-pointer justify-center py-1 font-bold inline-block text-center";
    $: labelStyle = getColourCombinationCss(colourHexCode);
    const handleOnChangeEvent = () => {
        if (!checkIfValidHexCode(colourHexCode)) {
            errorToast.fire({
                title: "Please select a darker colour. This improves readability on most screens",
                timer: 5000,
            });

            colourHexCode = previousColourHexCode;
            return;
        }

        previousColourHexCode = colourHexCode;
        dispatch("colourChanged");
    };

    let colourInput;
</script>

<div class="flex">
    {#if isIos()}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <label
            class={labelClasses}
            for={uniqueInputName}
            style={labelStyle}
            on:click={() => {
                colourInput.click();
            }}>
            <input
                tabindex="0"
                bind:this={colourInput}
                type="color"
                class="absolute -left-80 inline-block"
                id={uniqueInputName}
                name={uniqueInputName}
                bind:value={colourHexCode}
                on:change={handleOnChangeEvent} />
            Select Colour
        </label>
    {:else}
        <label class={labelClasses} for={uniqueInputName} style={labelStyle}> Select Colour </label>
        <input
            tabindex="0"
            role="button"
            type="color"
            class="invisible absolute inline-block"
            id={uniqueInputName}
            name={uniqueInputName}
            bind:value={colourHexCode}
            on:change={handleOnChangeEvent} />
    {/if}
</div>
