<script>
  import Router from "svelte-spa-router";
  import Home from "./routes/home.svelte";
  import RoutingExample from "./routes/routingExample.svelte";
  import ComponentLibrary from "./routes/componentLibrary.svelte";
  import NotFound from "./routes/notFound.svelte";

  const routes = {
    "/": Home,
    "/home": Home,
    "/routing-example": RoutingExample,
    "/routing-example/:id": RoutingExample,
    "/component-library": ComponentLibrary,

    "*": NotFound
  }
</script>

<main>
  <Router {routes} />
</main>