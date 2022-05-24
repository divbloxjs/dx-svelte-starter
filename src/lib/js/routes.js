import Home from "../pages/homePage.svelte";
import RoutingExample from "../../base_components/pages/routingExamplePage.svelte";
import ComponentLibrary from "../../base_components/pages/componentLibraryPage.svelte";
import NotFound from "../pages/notFoundPage.svelte";
import Login from "../pages/loginPage.svelte";

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