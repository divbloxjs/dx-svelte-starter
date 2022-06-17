<script>
  import {
    appLogo,
    appName
  } from "../../lib/js/stores";
  import { push, pop, replace } from "svelte-spa-router";

  const doNavigate = (event, page) => {
    push("/" + page);
  };
</script>

<div class="sticky top-0 z-50 navbar bg-base-100 shadow-xl">
  <div class="flex-1">
    <img
      on:click={(event) => doNavigate(event, "home")}
      src={appLogo}
      alt="{appName} Logo"
      class="max-h-10 px-3 hover:cursor-pointer"
    />
  </div>

  <div class="flex-none lg:hidden">
    <div class="dropdown dropdown-end">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h8m-8 6h16"
          /></svg
        >
      </label>

      <ul
        tabindex="0"
        class="mt-3 p-1 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-80"
      >
        <li>
          <a href="#/routing-example">Routing Example</a>
        </li>
        <li>
          <a href="#/routing-example/123">Routing Example with input</a>
        </li>
      </ul>
    </div>
  </div>

  <div class="flex-none hidden lg:flex">
    <ul class="menu menu-horizontal p-0">
      <li>
        <a href="#/routing-example">Routing Example</a>
      </li>
      <li>
        <a href="#/routing-example/123">Routing Example with input</a>
      </li>
    </ul>

    <div class="dropdown dropdown-end">
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <!-- svelte-ignore a11y-missing-attribute -->
          <img src="https://api.lorem.space/image/face?hash=33791" />
        </div>
      </label>
      <ul
        tabindex="0"
        class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
      >
        <li>
          <span class="justify-between">
            Profile
            <span class="badge">New</span>
          </span>
        </li>
        <li><span>Settings</span></li>
        <li><span>Logout</span></li>
      </ul>
    </div>
  </div>
</div>
