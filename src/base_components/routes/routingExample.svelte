<script>
    import RoutingExampleNav from "../navigation/routingExampleNav.svelte";
    import validationOptions from "../forms/validatedInput.svelte";
    import ValidatedInput from "../forms/validatedInput.svelte";

    import { push, pop, replace } from "svelte-spa-router";
    import PageTransitionFade from "../page_transitions/pageTransitionFade.svelte";
    export let params = {};

    let inputValue = "";
    let validatedInput = null;

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
        <ValidatedInput
            placeholder="Email address"
            type="email"
            validateAs="email"
            validationMessage="Invalid email address"
            bind:this={validatedInput}
        />
        <ValidatedInput
            placeholder="Password"
            bind:value={inputValue}
            type="password"
            validateAs="required"
        />
        <ValidatedInput
            placeholder="Confirm password"
            value=""
            type="password"
            validateAs="comparison"
            compareValue={inputValue}
            validationMessage="Passwords do not match"
        />
    </main>
</PageTransitionFade>
