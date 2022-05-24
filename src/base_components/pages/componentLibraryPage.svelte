<script>
    import RoutingExampleNav from "../navigation/routingExampleNav.svelte";
    import { fade } from 'svelte/transition';

    $: activeComponentTab = "daisyUiComponents";

    const tabToggle = (event, tabToggleId) => {
        event.target.classList.add("tab-active");

        activeComponentTab = tabToggleId;
    }
</script>

<RoutingExampleNav></RoutingExampleNav>
<main class="mt-5 mb-16">
    <div class="container mx-auto px-5">
        <article class="prose">
            <h1>Component Library & Examples</h1>
            <p>Base components built on <a href="https://daisyui.com/docs/install/" target="blank">daisyUI</a>
            and <a href="https://tailwindcss.com/docs/installation" target="blank">tailwindcss</a></p>
            <p>For a full reference, visit <a href="https://daisyui.com/docs/install/" target="blank">daisyUI</a></p>
        </article>
        <div class="divider"></div>

        <div class="tabs tabs-boxed pl-5 pr-5">
            <span class="tab tab-bordered mr-2" class:tab-active="{activeComponentTab === "daisyUiComponents"}"
            on:click={event => tabToggle(event, "daisyUiComponents")}>DaisyUI Preview</span> 
            <span class="tab tab-bordered" class:tab-active="{activeComponentTab === "customComponents"}"
            on:click={event => tabToggle(event, "customComponents")}>Custom Built</span> 
        </div>

        {#if activeComponentTab == "daisyUiComponents"}
        <div in:fade={{duration:500}}>
            <!-- buttons -->
            <div class="m-4">
                <button class="btn btn-primary">primary</button> 
                <button class="btn btn-secondary">secondary</button> 
                <button class="btn btn-accent">accent</button>
            </div>
            
            <!-- toggle -->
            <div class="m-4">
                <input type="checkbox" class="toggle toggle-primary"> 
                <input type="checkbox" class="toggle toggle-secondary"> 
                <input type="checkbox" class="toggle toggle-accent"> 
            </div>
            
            <!-- card -->
            <div class="card shadow-2xl w-80 m-4">
                <figure>
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src="https://picsum.photos/id/1005/500/250"/>
                </figure>
                <div class="card-body">
                <h2 class="card-title">DaisyUI Card</h2>
                <p>Rerum reiciendis beatae tenetur excepturi aut pariatur est eos. Sit sit necessitatibus.</p> 
                </div>
            </div>
            
            
            <!-- dropdown -->
            <div class="dropdown m-4">
                <div tabindex="0" class="m-1 btn">Dropdown</div> 
                <ul tabindex="0" class="p-2 menu dropdown-content bg-neutral text-neutral-content rounded-box w-52">
                <li><span>Item 1</span></li>
                <li><span>Item 2</span></li>
                </ul>
            </div>
            
            <!-- modal button -->
            <label for="my-modal" class="btn modal-button">Modal</label>
            <!-- modal content -->
            <input type="checkbox" id="my-modal" class="modal-toggle"> 
            <div class="modal">
                <div class="modal-box">
                <p>Enim dolorem dolorum omnis atque necessitatibus. Consequatur aut adipisci qui iusto illo eaque. Consequatur repudiandae et. Nulla ea quasi eligendi. Saepe velit autem minima.</p> 
                <div class="modal-action">
                    <label for="my-modal" class="btn">Close</label>
                </div>
                </div>
            </div>
            
            <!-- steps -->
            <ul class="steps my-4 w-full">
                <li class="step step-primary">Register</li> 
                <li class="step step-primary">Choose plan</li> 
                <li class="step">Purchase</li> 
                <li class="step">Receive Product</li>
            </ul>
            
            <!-- avatar -->
            <div class="avatar online m-10">
                <div class="rounded-full w-24 h-24">
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src="http://daisyui.com/tailwind-css-component-profile-1@94w.png">
                </div>
            </div>
            <div class="avatar offline m-10">
                <div class="rounded-full w-24 h-24">
                <!-- svelte-ignore a11y-missing-attribute -->
                <img src="http://daisyui.com/tailwind-css-component-profile-2@94w.png">
                </div>
            </div>
        </div>
        {:else if activeComponentTab == "customComponents"}
        <div in:fade={{duration:500}}>
            <p>To be completed</p>
        </div>
        {/if}
        
  

    </div>
</main>