<script>
    import { getToken, onMessage } from "firebase/messaging";
    import { onMount } from "svelte";
    import {
        checkUserNotificationPreferences,
        initFirebase,
        setUserNotificationPreferences,
    } from "$src/lib/js/stores/firebase";
    import { serviceWorkerRegistration } from "$src/lib/js/stores/serviceWorker";
    import { get } from "svelte/store";
    import { routeUtilities } from "$src/lib/js/utilities/routeUtilities";

    let debugData = "";

    let firebase;
    let firebaseReady = false;
    let userNotificationPreferences;

    $: $serviceWorkerRegistration, startFirebase();

    const startFirebase = async () => {
        firebase = await initFirebase();
        console.log(firebase);
        firebaseReady = firebase.initComplete;

        onMessage(firebase.messaging, (payload) => {
            console.log("Message received. ", payload);
            // ...
        });
    };

    const requestPermission = () => {
        console.log("Requesting permission...");
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                console.log("Notification permission granted.");
            }
        });
    };

    onMount(async () => {
        userNotificationPreferences = checkUserNotificationPreferences();

        if (!isPushApiSupported || userNotificationPreferences.rejected || userNotificationPreferences.accepted) {
            leavePage();
        }
    });

    const showLocalNotification = (title, body, swRegistration) => {
        const options = {
            body,
            // here you can add more properties like icon, image, vibrate, etc.
        };
        swRegistration.showNotification(title, options);
    };

    const onAllowNotificationsClicked = () => {
        getToken(firebase.messaging, firebase.fcmOptions)
            .then((currentToken) => {
                if (currentToken) {
                    // Send the token to your server and update the UI if necessary
                    // ...
                    console.log("Current token:" + currentToken);

                    setUserNotificationPreferences({ ignored: false, accepted: true, rejected: false });

                    navigator.serviceWorker.controller.postMessage({ action: "storePushSubscription" });

                    /*showLocalNotification(
                        "Thank you!",
                        "This is how your notifications will look when they arrive",
                        get(serviceWorkerRegistration)
                    );*/

                    routeUtilities.goToPage("home");
                } else {
                    // Show permission request UI
                    console.log("No registration token available. Request permission to generate one.");
                    requestPermission();
                    setUserNotificationPreferences({ ignored: true, accepted: false, rejected: false });
                    routeUtilities.goToPage("home");
                }
            })
            .catch((err) => {
                console.log("An error occurred while retrieving token. ", err);
                setUserNotificationPreferences({ ignored: false, accepted: false, rejected: true });
                routeUtilities.goToPage("home");
            });
    };

    const onRejectNotificationsClicked = () => {
        setUserNotificationPreferences({ ignored: false, accepted: false, rejected: true });
        routeUtilities.goToPage("home");
    };

    const isPushApiSupported = () => {
        return "PushManager" in window;
    };

    const leavePage = () => {
        // We set it again to ensure that ignored is false to avoid a loop back to this page
        setUserNotificationPreferences({
            ignored: false,
            accepted: userNotificationPreferences.accepted,
            rejected: userNotificationPreferences.rejected,
        });
        routeUtilities.goBack();
    };
</script>

{#if firebaseReady}
    <main class="mt-5 mb-16 pl-5 pr-5">
        <div class="hero h-96 max-h-screen bg-base-200">
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <h1 class="text-5xl font-bold">Heads up!</h1>
                    <p class="py-6">
                        We'd like to send you a notification from time to time to provide a better experience with our
                        app. We promise not to spam you.
                    </p>
                    <button class="btn btn-primary" on:click={onAllowNotificationsClicked}>
                        Ok, allow notifications
                    </button>
                    <button class="btn btn-default" on:click={onRejectNotificationsClicked}> No thanks. </button>
                </div>
            </div>
        </div>
    </main>
{/if}
