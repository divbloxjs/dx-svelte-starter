<script>
  import { fade } from "svelte/transition";
  let outTransition = false;
  const startOutro = () => {
    document.body.classList.add("no-scrollbar");
  };
  const endOutro = () => {
    document.body.classList.remove("no-scrollbar");
  };
</script>

<div
  in:fade={{ duration: 200, delay: 250 }}
  out:fade={{ duration: 200, delay: 0 }}
  on:outrostart={startOutro}
  on:outroend={endOutro}
>
  <slot />
</div>
