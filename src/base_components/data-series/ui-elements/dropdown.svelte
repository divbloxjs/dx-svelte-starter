<script>
    import Fa from "svelte-fa";
    import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
    import { createEventDispatcher } from "svelte";
    import { twMerge } from "tailwind-merge";

    const dispatch = createEventDispatcher();

    export let dropDownText;
    export let dropDownTextClasses = "";
    export let dropdownContentClasses = "";
    export let dropDownIcon = null;
    export let dropDownOptions = [];
    export let btnClasses = "";
    export let dropdownClasses = "mr-2";
    export let loading = true;
    export let includeDropDownChevron = false;
    export let dropdownButtonEl;

    const selectOption = (params) => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        hideDropDownList = false;
        dropDownOpen = false;
        dispatch("optionSelected", params);
    };

    let dropDownOpen = false;
    let hideDropDownList = true;

    const mouseupHandler = () => {
        if (dropDownOpen === true) {
            if (!hideDropDownList) {
                hideDropDownList = !hideDropDownList;
            }

            dropDownOpen = false;
            if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        } else {
            dropDownOpen = true;
            if (hideDropDownList) {
                hideDropDownList = !hideDropDownList;
            }
        }
    };
</script>

<div class={twMerge("dropdown", dropdownClasses)}>
    <span class="h-0 w-0" />
    <!--DaisyUI fuckery -> Selector adds classes to :first-of-type -->
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
        bind:this={dropdownButtonEl}
        on:mousedown={() => {
            document.addEventListener("mouseup", () => mouseupHandler(), { once: true });

            if (dropDownOpen === false && hideDropDownList) {
                hideDropDownList = !hideDropDownList;
            }
        }}
        on:click|stopPropagation={() => {}}
        tabIndex="0"
        class={twMerge("btn flex w-full flex-nowrap items-center justify-center", btnClasses)}
        class:loading>
        {#if dropDownIcon}
            <Fa icon={dropDownIcon} size="1.1x" class={dropDownText === undefined ? "mr-2" : ""} />
        {/if}
        <span class={dropDownTextClasses}> {@html dropDownText}</span>

        {#if includeDropDownChevron}
            <Fa icon={faChevronDown} class="ml-2" />
        {/if}
    </span>
    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
    <ul
        tabindex="0"
        class:hidden={hideDropDownList}
        class={twMerge(
            "minimal-scrollbar dropdown-content menu rounded-box menu-compact my-1 mr-2 mt-5 flex max-h-48 w-52 flex-row overflow-y-auto bg-base-300 p-1 shadow",
            dropdownContentClasses
        )}>
        {#each dropDownOptions as option}
            <li class="w-full">
                <!-- svelte-ignore a11y-missing-attribute -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <a
                    on:click={(event) => {
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
