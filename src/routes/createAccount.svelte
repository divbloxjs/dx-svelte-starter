<script>
  import MainFooter from "../lib/navigation/mainFooter.svelte";
  import {
    domainRoot,
    isAuthenticated,
    appLogo,
    appName,
    defaultLandingPage,
  } from "../lib/js/stores";
  import { checkAuthentication, authenticate } from "../lib/js/authentication";
  import { routeUtilities } from "../lib/js/routeUtilities";
  import { onMount } from "svelte";
  import PageTransitionFade from "../base_components/page_transitions/pageTransitionFade.svelte";

  let username = "";
  let password = "";
  let passwordConfirm = "";

  onMount(async () => {
    checkAuthentication(null, null, null, "/");
  });

  const doCreateAccount = () => {
    alert("Coming soon...");
  };
</script>

<PageTransitionFade>
  <main class="">
    <div
      class="card w-11/12 max-w-md bg-base-200 shadow-2xl mr-auto ml-auto mt-10"
    >
      <figure>
        <a href={domainRoot} class="w-3/12 mt-10 mb-0"
          ><img src={appLogo} alt="{appName} Logo" /></a
        >
      </figure>
      <div class="card-body">
        <h2 class="text-xl font-bold text-center">
          Create your {appName} account
        </h2>
        <input
          type="email"
          placeholder="Email Address"
          class="input input-bordered w-full"
          value={username}
        />
        <input
          type="password"
          placeholder="Password"
          class="input input-bordered w-full"
          value={password}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          class="input input-bordered w-full"
          value={passwordConfirm}
        />

        <div class="card-actions justify-between">
          <button
            on:click={routeUtilities.goBack}
            class="btn btn-link text-gray-600 pl-0">Cancel</button
          >
          <button class="btn btn-primary mr-0" on:click={doCreateAccount}
            >Register</button
          >
        </div>
      </div>
    </div>
  </main>
</PageTransitionFade>

<MainFooter />
