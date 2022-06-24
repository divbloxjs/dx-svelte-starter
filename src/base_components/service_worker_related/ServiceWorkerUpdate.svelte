<script>
    import { fade } from "svelte/transition";
    let newServiceWorker;
    let mustShowAppUpdateAvailable = true;
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
            class="fixed bottom-5 right-5 w-full h-96">
            A new version of this app is available. Click <button
                class="btn btn-link"
                on:click={updateApp}>
                here
            </button> to update.
        </div>
    {/if}
</main>
