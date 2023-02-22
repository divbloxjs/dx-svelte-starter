<button on:click={() => ((action))()} class="btn-((btnType)) btn" class:loading={isSubmitting}>
    {#if !isSubmitting}
        ((btnText))
    {:else}
        ((loadingText))
    {/if}
</button>