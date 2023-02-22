<script>
let x = "1"
</script>

<ValidatedInput
    bind:value={((value))}
    label="First Name"
    validateAs={false}
    type={((inputType))}
    bind:this={((thisBinder))}
    bind:keypress
    validationMessage="please add a name"
    name="firstName"
    placeholder="First Name" />
<ValidatedInput
    bind:value={((value))}
    label="Gender"
    validateAs={false}
    type={((inputType))}
    bind:this={((thisBinder))}
    bind:keypress
    validationMessage="((validationMessage))"
    name="gender"
    placeholder="-Please Select-" />
<button on:click={() => post()} class="btn-primary btn" class:loading={isSubmitting}>
    {#if !isSubmitting}
        Create
    {:else}
        Creating...
    {/if}
</button>
<button on:click={() => put()} class="btn-primary btn" class:loading={isSubmitting}>
    {#if !isSubmitting}
        Update
    {:else}
        Updating...
    {/if}
</button>
<button on:click={() => delete()} class="btn-danger btn" class:loading={isSubmitting}>
    {#if !isSubmitting}
        Delete
    {:else}
        Deleting...
    {/if}
</button>