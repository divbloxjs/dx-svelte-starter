<script>
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { serviceWorkerRegistration } from "$src/lib/js/stores/serviceWorker";
    import { get, writable } from "svelte/store";

    let newServiceWorker;
    let mustShowAppUpdateAvailable = false;

    const updateApp = () => {
        newServiceWorker.postMessage({ action: "skipWaiting" });
        window.location.reload();
    };

    onMount(async () => {
        if ("serviceWorker" in navigator) {
            try {
                serviceWorkerRegistration.set(
                    await navigator.serviceWorker.register("/serviceWorker.js", {
                        scope: "/",
                    })
                );
            } catch (error) {
                console.error(`Service working registration failed with ${error}`);
                return;
            }

            get(serviceWorkerRegistration).addEventListener("updatefound", () => {
                console.log("Update found");
                newServiceWorker = get(serviceWorkerRegistration).installing;

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
            class="app-version-notification fixed bottom-0 right-0 mx-5 my-5 rounded-lg bg-gray-300 px-5 py-3 text-center leading-none text-[#474759] shadow-2xl">
            A new version of the app is available. <span class="inline-block"
                ><button class="btn btn-link btn-sm px-1 leading-none text-violet-700" on:click={updateApp}>
                    REFRESH
                </button>
                <button
                    class="btn btn-link btn-sm p-0 text-[#474759]"
                    on:click={() => {
                        mustShowAppUpdateAvailable = false;
                    }}>x</button
                ></span>
        </div>
    {/if}
</main>
