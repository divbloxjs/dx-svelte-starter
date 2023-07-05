import { push, pop, replace } from "svelte-spa-router";

export const routeUtilities = {
    /**
     *
     * @param {String} page Name of page to redirect to (As specified in router in App.svelte)
     * @param {String[]|null} params Array of parameters (As specified for given page
     * in router in App.svelte)
     */
    goToPage: (page, params = null) => {
        if (params === null) {
            push("/" + page);
            return;
        }

        params.forEach((param, index) => {
            params[index] = encodeURIComponent(param);
        });

        push("/" + page + "/" + params.join("/"));
    },
    goBack: () => {
        pop();
    },
    /**
     *
     * @param {String} message Pre-configured message the login page performs actions based on
     * @param {String[]} redirectParams Redirect parameters to be redirected to on successful login
     *                      (e.g. [page-name, param-one, param-two])
     * @returns {void}
     */
    goToLogin: (message = null, redirectParams = null) => {
        if (message === null) {
            push("/login");
            return;
        }

        if (redirectParams === null) {
            push("/login/" + encodeURIComponent(message));
            return;
        }

        push("/login/" + encodeURIComponent(message) + "/" + encodeURIComponent(redirectParams.join("/")));
    },
};
