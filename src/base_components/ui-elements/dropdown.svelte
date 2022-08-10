<script>
    import Fa from "svelte-fa";
    import { createEventDispatcher } from "svelte";
    import { onMount } from "svelte";

    const dispatch = createEventDispatcher();

    export let dropDownText;
    export let dropDownOptions;
    export let btnClasses = "";

    const selectOption = (params) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        dropDownOpen = false;
        dispatch("optionSelected", params);
    };

    let dropDownOpen = false;
</script>

<div class="dropdown-end dropdown">
    <div
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
        class="btn btn-sm flex w-full items-center justify-center bg-base-300 {btnClasses}"
        class:loading={dropDownOptions.length < 1}>
        {dropDownText}
    </div>
    <ul tabindex="0" class="dropdown-content  menu rounded-box menu-compact mt-3 w-52 bg-base-300 p-1 shadow">
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
