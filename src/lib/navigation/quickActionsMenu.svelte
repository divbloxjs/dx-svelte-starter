<script>
    import Fa from "svelte-fa";
    import { faEllipsisV, faGrip, faPowerOff } from "@fortawesome/free-solid-svg-icons";
    import { profilePicturePath } from "$src/lib/js/stores/userData";
    import { logout } from "$src/lib/js/api/authentication.api.js";
    let dropDownEl;
    let isExpanded = false;
    let isClicked = false;
</script>

<div class="fixed bottom-[30vh] right-0 md:hidden">
    <div class="dropdown dropdown-end dropdown-top">
        <div
            bind:this={dropDownEl}
            on:click={() => {
                if (!isClicked) {
                    isClicked = true;
                } else if (isExpanded) {
                    isClicked = false;
                    dropDownEl.blur();
                }
            }}
            on:focus={() => {
                isExpanded = true;
            }}
            on:blur={() => {
                isExpanded = false;
            }}
            tabindex="0"
            class:rounded-tl-none={isExpanded}
            class="flex h-16 w-8 items-center justify-center rounded-l-xl  bg-base-300 p-4">
            <Fa icon={faEllipsisV} size="1.4x" />
        </div>
        <ul
            tabindex="0"
            class="dropdown-content menu rounded-box menu-compact mt-3 w-52 rounded-r-none bg-base-300 p-1 shadow">
            <li>
                <a href="#/profile">
                    <div class="w-6 rounded-full">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <img src={$profilePicturePath} alt="Profile Picture" />
                    </div>
                    Profile
                </a>
            </li>
            <li>
                <a href="#/home">
                    <div class="flex h-6 w-6 items-center justify-center rounded-full bg-base-300 p-3 shadow-lg  ">
                        <Fa icon={faGrip} size="1.4x" />
                    </div>
                    Dashboard
                </a>
            </li>
            <li>
                <span on:click={async () => logout()}>
                    <div class="flex h-6 w-6 items-center justify-center rounded-full bg-base-300 p-3 shadow-lg  ">
                        <Fa icon={faPowerOff} size="1.4x" />
                    </div>
                    Logout
                </span>
            </li>
        </ul>
    </div>
</div>
