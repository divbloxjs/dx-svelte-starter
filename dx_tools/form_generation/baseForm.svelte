<script>
    import ValidatedInput from "$src/base_components/forms/validatedInput.svelte";

    export let firstInputValue = "First Name";
    export let firstInputLabel = "First Name";
    export let firstInputPlaceholder = "First NAme";
    export let validateFirstInputAs;
    export let firstInputType;
    export let firstInputComp;

    $: keypress = null;
    $: keypress, handleKeypress();
    const handleKeypress = async () => {
        if (keypress === 13) {
            // await submit();
        }
    };

    export let formData = {
        firstName: "",
    };
    let isSubmitting = false;
</script>

<form>
    <ValidatedInput
        bind:value={formData.firstName}
        bind:this={firstInputComp}
        name="Quick Action Input"
        bind:keypress
        label={firstInputLabel}
        validateAs={validateFirstInputAs}
        {firstInputType}
        validationMessage="Required"
        placeholder={firstInputPlaceholder} />
</form>

<button class="btn-primary btn-sm btn ml-2" on:click={() => {}}> ((displayLabel)) </button>

<button on:click={() => {}} class="btn-primary btn" class:loading={isSubmitting}>
    {#if !isSubmitting}
        Create
    {:else}
        Creating...
    {/if}
</button>
