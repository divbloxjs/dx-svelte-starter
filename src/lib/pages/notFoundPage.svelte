<script>
    import MainNav from "../navigation/mainNav.svelte";
    import MainFooter from "../navigation/mainFooter.svelte";
    import {push, pop, replace} from "svelte-spa-router";

    const returnToPreviousPage = () => {
        pop();
    }
</script>

<MainNav></MainNav>
<main class="mt-5 mb-16 pl-5 pr-5">
    <div class="hero max-h-screen h-96 bg-base-200 w-9/12 mx-auto">
        <div class="text-center hero-content">
          <div class="max-w-md">
            <h1 class="text-5xl font-bold">404</h1>
            <p class="py-6">We could not find the page you are looking for.</p>
            <button class="btn btn-primary" on:click={returnToPreviousPage}>Go back</button>
          </div>
        </div>
      </div>
</main>

<MainFooter/>