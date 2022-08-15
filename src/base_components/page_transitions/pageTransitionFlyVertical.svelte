<script>
    import { fly } from "svelte/transition";
</script>

<div in:fly={{ y: -50, duration: 100, delay: 200 }} out:fly={{ y: -50, duration: 100, delay: 0 }}>
    <slot />
</div>
