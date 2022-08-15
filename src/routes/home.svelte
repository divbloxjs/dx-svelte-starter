<script>
    import MainNav from "$src/lib/navigation/mainNav.svelte";
    import { push, pop, replace } from "svelte-spa-router";
    import QuickActionsMenu from "$src/lib/navigation/quickActionsMenu.svelte";
    import { checkAuthentication } from "$src/lib/js/stores/authentication";
    import { onMount } from "svelte";
    import PageTransitionFade from "$src/base_components/page_transitions/pageTransitionFade.svelte";

    const openComponentLibrary = () => {
        push("/component-library");
    };

    onMount(async () => {
        await checkAuthentication();
    });
</script>

<PageTransitionFade>
    <MainNav />
    <main class="mt-5 mb-16 pl-5 pr-5">
        <div class="hero h-96 max-h-screen bg-base-200">
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <h1 class="text-5xl font-bold">Welcome</h1>
                    <p class="py-6">This is a "blank" home page to get you started. Go nuts!</p>
                    <button class="btn btn-primary" on:click={openComponentLibrary}> See Component Library </button>
                </div>
            </div>
        </div>
    </main>
    <QuickActionsMenu />
</PageTransitionFade>
