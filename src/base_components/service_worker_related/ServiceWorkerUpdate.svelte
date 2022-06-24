<script>
    import { fade } from "svelte/transition";
    let newServiceWorker;
    let mustShowAppUpdateAvailable = false;
    const updateApp = () => {
        newServiceWorker.postMessage({ action: "skipWaiting" });
    };

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/serviceWorker.js").then((reg) => {
            reg.addEventListener("updatefound", () => {
                // A wild service worker has appeared in reg.installing!
                newServiceWorker = reg.installing;

                newServiceWorker.addEventListener("statechange", () => {
                    // Has network.state changed?
                    switch (newServiceWorker.state) {
                        case "installed":
                            if (navigator.serviceWorker.controller) {
                                // new update available
                                mustShowAppUpdateAvailable = true;
                            }
                            // No update available
                            break;
                    }
                });
            });
        });

        let refreshing;
        navigator.serviceWorker.addEventListener(
            "controllerchange",
            function () {
                if (refreshing) return;
                window.location.reload();
                refreshing = true;
            }
        );
    }
</script>

<main>
    {#if mustShowAppUpdateAvailable}
        <div
            in:fade={{ duration: 500 }}
            class="bg-base-200 shadow-2xl fixed bottom-20 right-0 md:right-5 p-3 px-5 rounded-lg">
            A new version of the app is available. Click <button
                class="btn btn-link px-1 text-lg btn-sm leading-none text-base-content underline"
                on:click={updateApp}>
                here
            </button> to update.
        </div>
    {/if}
</main>
