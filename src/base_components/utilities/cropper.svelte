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
        form.addEventListener("submit", handleSubmit);
    });

    let cropperLoaded = false;

    const initCropper = () => {
        console.log("initCropper: img loaded ", img.complete);
        cropper = new Cropper(img, {
            // aspectRatio: 16 / 9,
            // viewMode: 3,
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

    function submitForm() {
        event.preventDefault();

        const dataArray = new FormData();
        dataArray.append("superHeroName", postVar);
        dataArray.append("uploadFile", fileVar);

        fetch("api_url_here", {
            method: "POST",
            headers: [["Content-Type", "multipart/form-data"]],
            body: dataArray,
        })
            .then((response) => {
                // Successfully uploaded
            })
            .catch((error) => {
                // Upload failed
            });
    }

    // Get the form and file field
    // let form = document.querySelector("#upload");
    // let file = document.querySelector("#file");
    // let app = document.querySelector("#app");

    /**
     * Log the uploaded file to the console
     * @param {event} event The file loaded event
     */
    function logFile(event) {
        let str = event.target.result;
        let img = document.createElement("img");
        img.src = str;
        app.append(img);
        console.log(str);
    }

    /**
     * Handle submit events
     * @param  {Event} event The event object
     */
    function handleSubmit(event) {
        // Stop the form from reloading the page
        event.preventDefault();

        // If there's no file, do nothing
        if (!file.value.length) return;

        // Create a new FileReader() object
        let reader = new FileReader();

        // Setup the callback event to run when the file is read
        reader.onload = logFile;

        // Read the file
        reader.readAsDataURL(file.files[0]);
    }

    let form;
</script>

<svelte:head>
    <link href="/assets/css/cropper.css" rel="stylesheet" />
</svelte:head>

<h1>File Upload</h1>

<div id="app" />

<form id="upload" bind:this={form}>
    <label for="file">File to upload</label>
    <input type="file" id="file" accept="image/*" />

    <button>Upload</button>
</form>
<div>
    <form on:submit={submitForm}>
        <input
            type="text"
            bind:value={postVar}
            placeholder={"Superhero Name"} />
        <br />
        <input type="file" bind:files={fileVar} />
        <br />
        <input type="submit" />
    </form>
</div>
<button class="btn btn-primary" on:click={() => console.log({ cropperLoaded })}>
    CLick</button>

<!-- Wrap the image or canvas element with a block element (container) -->
<div class="card m-5">
    <img bind:this={img} src={imgPath} alt="Image" style="" />
</div>

<style>
    img {
        display: block;
        /* This rule is very important, please don't ignore this */
        max-width: 100%;
    }

    /* .cropper-container {
        max-width: 100%;
    } */
</style>
