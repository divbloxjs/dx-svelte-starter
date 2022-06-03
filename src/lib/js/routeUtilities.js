import { push, pop, replace } from "svelte-spa-router";

export const routeUtilities = {
    goBack: () => {
        pop();
    }
}