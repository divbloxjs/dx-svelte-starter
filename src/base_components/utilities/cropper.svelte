<script>
    import Cropper from "cropperjs";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let img, cropper;

    export let imgPath =
        "https://cdn1-www.dogtime.com/assets/uploads/2011/03/puppy-development.jpg";

    onMount(async () => {
        console.log("image loaded", img.complete);
        img.addEventListener("load", initCropper);
        // Listen for submit events
    });

    let cropperLoaded = false;

    const initCropper = () => {
        console.log("initCropper: img loaded ", img.complete);
        cropper = new Cropper(img, {
            aspectRatio: 16 / 9,
            crop(event) {
                console.log(event.detail);
                console.log(event.detail.y);
                console.log(event.detail.width);
                console.log(event.detail.height);
                console.log(event.detail.rotate);
                console.log(event.detail.scaleX);
                console.log(event.detail.scaleY);
            },
        });

        cropperLoaded = true;
    };
    let postVar;
    let fileVar;

    let files;
    $: if (files) {
        isModalOpen = true;
        // Note that `files` is of type `FileList`, not an Array:
        // https://developer.mozilla.org/en-US/docs/Web/API/FileList
        for (const file of files) {
            // console.log(`${file.name}: ${file.size} bytes`);
        }
    }

    let isModalOpen = false;

    const handleFileUpload = () => {
        console.log("haldned");
    };
</script>

<svelte:head>
    <link href="/assets/css/cropper.css" rel="stylesheet" />
</svelte:head>

<h1>File Upload</h1>

<label for="avatar">Upload a picture:</label>
<input
    accept="image/png, image/jpeg, image/jpg"
    bind:files
    on:change={handleFileUpload}
    id="avatar"
    name="avatar"
    type="file" />

<!-- The button to open modal -->
<label for="my-modal" class="btn modal-button">open modal</label>

<!-- Put this part before </body> tag -->
<input
    type="checkbox"
    id="my-modal"
    class="modal-toggle"
    bind:checked={isModalOpen} />
<div class="modal" on:click|self={() => (isModalOpen = false)}>
    <div class="modal-box ">
        <h3 class="font-bold text-lg">
            Congratulations you uploaded an image!
        </h3>
        <p class="py-4">
            You've been selected for a chance to get one year of subscription to
            use Wikipedia for free!
        </p>
        <div class="card">
            <img bind:this={img} src={imgPath} alt="Image" />
        </div>

        <div class="modal-action">
            <button
                for="my-modal"
                class="btn btn-primary"
                on:click={() => {
                    isModalOpen = !isModalOpen;
                }}>
                Close!
            </button>
        </div>
    </div>
</div>

{#if files}
    <h2>Selected files:</h2>
    {#each Array.from(files) as file}
        <p>{file.name} ({file.size} bytes)</p>
    {/each}
{/if}
<!-- Wrap the image or canvas element with a block element (container) -->
<div class="card m-5" />

<style>
    img {
        display: block;
        /* This rule is very important, please don't ignore this */
        max-width: 100%;
    }
</style>
