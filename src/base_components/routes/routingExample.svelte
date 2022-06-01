<script>
    import RoutingExampleNav from "../navigation/routingExampleNav.svelte";

    import { push, pop, replace } from "svelte-spa-router";
    import PageTransitionFade from "../page_transitions/pageTransitionFade.svelte";
    export let params = {};

    const doNavigate = (event, whereTo) => {
        if (whereTo === "back") {
            pop();
        } else if (whereTo === "home") {
            push("/");
        }
    };
</script>

<PageTransitionFade>
    <RoutingExampleNav />
    <main class="p-5">
        <h1>This is the example page</h1>
        <p>Input params are: {JSON.stringify(params)}</p>
        <button class="btn" on:click={(event) => doNavigate(event, "back")}
            >Go back</button
        >
        <button class="btn" on:click={(event) => doNavigate(event, "home")}
            >Go Home</button
        >
    </main>
</PageTransitionFade>
