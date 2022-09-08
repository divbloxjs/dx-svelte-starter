<script>
    import Fa from "svelte-fa";
    import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let dropDownText;
    export let dropDownTextClasses = "";
    export let dropDownIcon;
    export let dropDownOptions;
    export let btnClasses = "";
    export let dropdownClasses = "";
    export let loading = true;
    export let includeDropDownChevron = false;

    const selectOption = (params) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        dropDownOpen = false;
        dispatch("optionSelected", params);
    };

    let dropDownOpen = false;
    const dropDownPositions = ["static", "relative"];
    let dropDownPosition = dropDownPositions[0];
</script>

<div class="dropdown {dropdownClasses} {dropDownPosition}">
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
        on:click={(event) => {
            event.stopPropagation();
            if (dropDownPosition === dropDownPositions[0]) {
                dropDownPosition = dropDownPositions[1];
            } else {
                dropDownPosition = dropDownPositions[0]
            }
        }}
        tabIndex="0"
        class="btn btn-sm flex w-full items-center justify-center {btnClasses}"
        class:loading={loading}>
        {#if dropDownIcon}
            <Fa icon={dropDownIcon} size="1.1x" class={dropDownText === undefined ? "mr-2" : ""} />
        {/if}
        <span class="{dropDownTextClasses}"> {dropDownText}</span>

        {#if includeDropDownChevron}
            <Fa icon={faChevronDown} class="ml-2"></Fa>
        {/if}
    </button>
    <ul
        tabindex="0"
        class="dropdown-content menu rounded-box menu-compact my-1 max-h-48 w-52 overflow-y-auto bg-base-300 p-1 mr-2 shadow minimal-scrollbar">
        {#each dropDownOptions as option}
            <li>
                <!-- svelte-ignore a11y-missing-attribute -->
                <a on:click={(event) => {
                        event.stopPropagation();
                        selectOption({ clickEvent: option.clickEvent, params: option.params });
                    }}>
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
