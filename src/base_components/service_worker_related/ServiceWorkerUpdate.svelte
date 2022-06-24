<script>
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";

    let newServiceWorker;
    let mustShowAppUpdateAvailable = false;
    let serviceWorkerRegistration;

    const updateApp = () => {
        newServiceWorker.postMessage({ action: "skipWaiting" });
        window.location.reload();
    };

    onMount(async () => {
        if ("serviceWorker" in navigator) {
            try {
                serviceWorkerRegistration =
                    await navigator.serviceWorker.register(
                        "/serviceWorker.js",
                        {
                            scope: "/",
                        }
                    );
            } catch (error) {
                console.error(
                    `Service working registration failed with ${error}`
                );
                return;
            }

            serviceWorkerRegistration.addEventListener("updatefound", () => {
                console.log("Update found");
                newServiceWorker = serviceWorkerRegistration.installing;

                newServiceWorker.addEventListener("statechange", () => {
                    switch (newServiceWorker.state) {
                        case "installed":
                            if (navigator.serviceWorker.controller) {
                                mustShowAppUpdateAvailable = true;
                            }
                            // No update available
                            break;
                    }
                });
            });
        }
    });
</script>

<main>
    {#if mustShowAppUpdateAvailable}
        <div
            transition:fly={{ y: 50, duration: 200 }}
            class="bg-base-200 shadow-2xl fixed bottom-20 right-0 md:right-5 p-3 px-5 rounded-lg">
            A new version of the app is available. <button
                class="btn btn-link px-1 btn-sm leading-none text-violet-700 dark:text-violet-400"
                on:click={updateApp}>
                REFRESH
            </button>
            <button
                class="btn btn-link text-base-content px-0"
                on:click={() => {
                    mustShowAppUpdateAvailable = false;
                }}>x</button>
        </div>
    {/if}
</main>
