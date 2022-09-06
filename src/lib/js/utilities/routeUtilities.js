import { push, pop, replace } from "svelte-spa-router";

export const routeUtilities = {
    goToPage: (page = null, params = null) => {
        if (params !== null) {
            push("/" + page + "/" + params.join("/"));
        } else {
            push("/" + page);
        }
    },
    goBack: () => {
        pop();
    },
    goToLogin: (message = null) => {
        if (message !== null) {
            push("/login/" + message);
        } else {
            push("/login");
        }
    },
};
