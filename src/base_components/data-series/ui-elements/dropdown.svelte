<script>
    import Fa from "svelte-fa";
    import { createEventDispatcher } from "svelte";
    import { afterUpdate } from "svelte";

    const dispatch = createEventDispatcher();

    export let dropDownText;
    export let dropDownIcon;
    export let dropDownOptions;
    export let btnClasses = "";
    export let dropdownClasses = "";

    const selectOption = (params) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        dropDownOpen = false;
        dispatch("optionSelected", params);
    };

    let dropDownOpen = false;
</script>

<div class="dropdown-end dropdown {dropdownClasses}">
    <button
        on:mouseup={() => {
            if (dropDownOpen === true) {
                dropDownOpen = false;
                if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                }
            } else {
                dropDownOpen = true;
            }
        }}
        tabindex="0"
        class="btn btn-sm flex w-full items-center justify-center {btnClasses}"
        class:loading={dropDownOptions.length < 1}>
        {#if dropDownIcon}
            <Fa icon={dropDownIcon} size="1.1x" class={dropDownText === undefined ? "mr-2" : ""} />
        {/if}
        {dropDownText}
    </button>
    <ul
        tabindex="0"
        class="dropdown-content menu rounded-box menu-compact my-1 h-48 w-52 overflow-y-auto bg-base-300 p-1 shadow">
        {#each dropDownOptions as option}
            <li>
                <!-- svelte-ignore a11y-missing-attribute -->
                <a on:click={() => selectOption({ clickEvent: option.clickEvent, params: option.params })}>
                    {#if option.hasOwnProperty("faIcon")}
                        <Fa icon={option.faIcon} size="1.1x" class={option.faClasses} />
                    {/if}
                    <span class={option.optionClasses}>
                        {option.displayLabel}
                    </span>
                </a>
            </li>
        {/each}
    </ul>
</div>
