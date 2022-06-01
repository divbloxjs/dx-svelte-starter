<script>
  import { fade } from "svelte/transition";
</script>

<div
  in:fade={{ duration: 100, delay: 200 }}
  out:fade={{ duration: 100, delay: 0 }}
>
  <slot />
</div>
