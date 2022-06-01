<script>
  import MainFooter from "../lib/navigation/mainFooter.svelte";
  import { push, pop, replace } from "svelte-spa-router";
  import PageTransitionFade from "../base_components/page_transitions/pageTransitionFade.svelte";

  const returnToPreviousPage = () => {
    pop();
  };
</script>

<PageTransitionFade>
  <main class="flex h-screen">
    <div class="hero max-h-screen h-96 bg-base-200 w-9/12 m-auto">
      <div class="text-center hero-content">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold">404</h1>
          <p class="py-6">We could not find the page you are looking for.</p>
          <button class="btn btn-primary" on:click={returnToPreviousPage}
            >Go back</button
          >
        </div>
      </div>
    </div>
  </main>
</PageTransitionFade>
<MainFooter />
