import Home from "../routes/home.svelte";
import RoutingExample from "../../base_components/routes/routingExample.svelte";
import ComponentLibrary from "../../base_components/routes/componentLibrary.svelte";
import NotFound from "../routes/notFound.svelte";
import Login from "./";

/**
 * Update this to suit your needs
 */

const routes = {
    "/": Home,
    "/home": Home,
    "/login": Login,
    "/routing-example": RoutingExample,
    "/routing-example/:id": RoutingExample,
    "/component-library": ComponentLibrary,

    "*": NotFound
}
export default routes;