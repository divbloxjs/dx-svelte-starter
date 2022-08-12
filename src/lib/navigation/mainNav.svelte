<script>
    import { logout } from "../js/stores/authentication";
    import { profilePicturePath } from "../../lib/js/stores/userData";
    import { domainRoot, appLogo, appName } from "../../lib/js/stores/configurations";
    import { push, pop, replace } from "svelte-spa-router";

    const doNavigate = (event, page) => {
        push("/" + page);
    };
</script>

<div class="navbar sticky top-0 z-50 bg-base-100 shadow-xl">
    <div class="flex-1">
        <img
            on:click={(event) => doNavigate(event, "home")}
            src={appLogo}
            alt="{appName} Logo"
            class="max-h-10 px-3 hover:cursor-pointer" />
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
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
            </label>

            <ul tabindex="0" class="dropdown-content menu rounded-box menu-compact mt-3 w-80 bg-base-100 p-1 shadow">
                <li>
                    <a href="#/">Page 1</a>
                </li>
                <li>
                    <a href="#/">Page 2</a>
                </li>
                <li>
                    <!-- <span class="justify-between"> -->
                    <a href="#/profile" class="justify-between">
                        Profile
                        <span class="badge">New</span>
                    </a>

                    <!-- </span> -->
                </li>
                <li><span>Settings</span></li>
                <li>
                    <span
                        on:click={async () => {
                            await logout();
                        }}>Logout</span>
                </li>
            </ul>
        </div>
    </div>

    <div class="hidden flex-none lg:flex">
        <ul class="menu menu-horizontal p-0">
            <li>
                <a href="#/">Page 1</a>
            </li>
            <li>
                <a href="#/">Page 2</a>
            </li>
            <li>
                <a href="#/dataTable">Data Table</a>
            </li>
        </ul>

        <div class="dropdown-end dropdown">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label tabindex="0" class="avatar btn btn-ghost btn-circle">
                <div class="w-10 rounded-full">
                    <!-- svelte-ignore a11y-missing-attribute -->
                    <img src={$profilePicturePath} alt="Profile Picture" />
                </div>
            </label>
            <ul tabindex="0" class="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow">
                <li>
                    <span class="justify-between">
                        <a href="#/profile">Profile</a>
                        <span class="badge">New</span>
                    </span>
                </li>
                <li><span>Settings</span></li>
                <li>
                    <span
                        on:click={async () => {
                            await logout();
                        }}>Logout</span>
                </li>
            </ul>
        </div>
    </div>
</div>
