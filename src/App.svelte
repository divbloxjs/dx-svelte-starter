<script>
    import Router from "svelte-spa-router";
    import Home from "./routes/home.svelte";
    import RoutingExample from "./base_components/routes/routingExample.svelte";
    import ComponentLibrary from "./base_components/routes/componentLibrary.svelte";
    import NotFound from "./routes/notFound.svelte";
    import Login from "./routes/login.svelte";
    import CreateAccount from "./routes/createAccount.svelte";
    import ForgotPassword from "./routes/forgotPassword.svelte";
    import ResetPassword from "./routes/resetPassword.svelte";
    import Profile from "./routes/profile.svelte";
    import ServiceWorkerUpdate from "./base_components/service_worker_related/ServiceWorkerUpdate.svelte";

    /**
     * Update this to suit your needs
     */

    const routes = {
        "/": Home,
        "/home": Home,
        "/login": Login,
        "/create-account": CreateAccount,
        "/forgot-password": ForgotPassword,
        "/reset-password/:token": ResetPassword,
        "/routing-example": RoutingExample,
        "/routing-example/:id": RoutingExample,
        "/component-library": ComponentLibrary,
        "/profile": Profile,

        "*": NotFound,
    };
</script>

<main>
    <Router {routes} />
    <ServiceWorkerUpdate />
</main>
