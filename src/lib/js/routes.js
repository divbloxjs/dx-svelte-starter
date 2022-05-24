import Home from "../pages/homePage.svelte";
import RoutingExample from "../../base_components/pages/routingExamplePage.svelte";
import ComponentLibrary from "../../base_components/pages/componentLibraryPage.svelte";
import NotFound from "../pages/notFoundPage.svelte";

const routes = {
    "/": Home,
    "/home": Home,
    "/routing-example": RoutingExample,
    "/routing-example/:id": RoutingExample,
    "/component-library": ComponentLibrary,

    "*": NotFound
}
export default routes;