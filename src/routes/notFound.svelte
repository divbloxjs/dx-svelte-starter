<script>
    import MainFooter from "$src/lib/navigation/mainFooter.svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import PageTransitionFade from "$src/base_components/page_transitions/pageTransitionFade.svelte";

    const returnToPreviousPage = () => {
        pop();
    };
</script>

<PageTransitionFade>
    <main class="flex h-screen">
        <div class="hero m-auto h-96 max-h-screen w-9/12 bg-base-200">
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <h1 class="text-5xl font-bold">404</h1>
                    <p class="py-6">We could not find the page you are looking for.</p>
                    <button class="btn btn-primary" on:click={returnToPreviousPage}> Go back </button>
                </div>
            </div>
        </div>
    </main>
</PageTransitionFade>
<MainFooter />
