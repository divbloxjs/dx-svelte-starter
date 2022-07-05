<script>
    import defaultImage from "../../assets/images/no_image.svg";
    import { fade } from "svelte/transition";
    import Fa from "svelte-fa";
    import { faPencil } from "@fortawesome/free-solid-svg-icons";
    import Cropper from "cropperjs";
    import { onMount, afterUpdate } from "svelte";

    export let defaultImagePath = defaultImage;
    export let displayImagePath;
    export let aspect = { x: 4, y: 3 };
    export let displayAsCircle = false;
    export let maxHeight = "300px";
    export let imageName = "Divblox Image";
    export let uploadEndpoint;

    let isEditing = false;
    let isSubmitting = false;
    let fileUploader;
    let imageEditorPath = defaultImagePath;
    let displayedImageEl;
    let cropper;
    let image;
    let result;
    let croppedCanvas;
    let modifiedCanvas;
    let roundedImage;
    let imagePath;

    let aspectRatio = displayAsCircle ? 1 : aspect.x / aspect.y;

    $: displayImagePathLocal = displayImagePath;
    $: displayImagePathLocal, handleDisplayImagePathChanged();

    const handleDisplayImagePathChanged = () => {
        imagePath =
            displayImagePath !== undefined
                ? displayImagePath
                : defaultImagePath;
    };

    const handleFileUpload = () => {
        isEditing = true;
        imageEditorPath = URL.createObjectURL(fileUploader.files[0]);
    };

    const submitFile = async () => {
        isSubmitting = true;
        if (uploadEndpoint === undefined) {
            throw new Error("uploadEndpoint has not been defined");
        }

        let formData = new FormData();
        formData.append("file", fileUploader.files[0]);
        try {
            const uploadResponse = await fetch(uploadEndpoint, {
                method: "POST",
                mode: "no-cors",
                body: formData,
            });
            console.log(uploadResponse);

            if (uploadResponse.status !== 200) {
                alert("Failed to save changes. Please try again.");
            } else {
                isEditing = false;
            }
        } catch (error) {
            console.error(error);
        }
        isSubmitting = false;
    };

    afterUpdate(() => {
        if (isEditing) {
            cropper = new Cropper(image, {
                aspectRatio: displayAsCircle ? 1 : NaN,
                viewMode: 1,
                dragMode: "move",
            });
        } else {
            if (modifiedCanvas !== undefined) {
                displayedImageEl.src = modifiedCanvas.toDataURL();
                displayedImageEl.innerHTML = "";
            }
        }
    });

    const getRoundedCanvas = (sourceCanvas) => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const width = sourceCanvas.width;
        const height = sourceCanvas.height;

        canvas.width = width;
        canvas.height = height;
        context.imageSmoothingEnabled = true;
        context.drawImage(sourceCanvas, 0, 0, width, height);
        context.globalCompositeOperation = "destination-in";
        context.beginPath();
        context.arc(
            width / 2,
            height / 2,
            Math.min(width, height) / 2,
            0,
            2 * Math.PI,
            true
        );
        context.fill();
        return canvas;
    };

    const handleCropConfirm = () => {
        if (modifiedCanvas === undefined) {
            // Crop
            modifiedCanvas = cropper.getCroppedCanvas();
            // Round
            if (displayAsCircle) {
                modifiedCanvas = getRoundedCanvas(modifiedCanvas);
            }
        }

        // convert to Blob (async)
        modifiedCanvas.toBlob((blob) => {
            const file = new File([blob], "mycanvas.png");
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileUploader.files = dataTransfer.files;
            console.log(fileUploader.files);
        });

        // Show
        submitFile();
    };
</script>

<div class="max-w-full mx-auto" style="max-height: {maxHeight}">
    <div class="avatar">
        <div
            style="aspect-ratio: {aspectRatio}; max-height: {maxHeight}"
            class:rounded-full={displayAsCircle}
            class:rounded-lg={!displayAsCircle}
        >
            <img bind:this={displayedImageEl} src={imagePath} alt={imageName} />
        </div>
    </div>
</div>

<div class="file-input mx-auto">
    <input
        type="file"
        bind:this={fileUploader}
        on:change={handleFileUpload}
        id="file"
        class="file"
    />
    <label for="file" class="btn btn-link -mt-5 text-base-content">
        Edit
        <Fa icon={faPencil} size="xs" translateY={0} translateX={0.5} />
        <p class="file-name" />
    </label>
</div>
{#if isEditing}
    <div
        transition:fade={{ duration: 200 }}
        class="fixed z-50 w-screen h-screen bg-base-200 top-0 left-0"
    >
        <div
            class="w-11/12 mt-[2rem] max-w-[90vw] max-h-[calc(100vh-6rem)] m-auto"
        >
            <img bind:this={image} src={imageEditorPath} alt="Edited" />
        </div>
        <div class="w-11/12 max-w-[90vw] mx-auto text-center">
            <button
                type="button"
                class="btn btn-link text-base-content mt-2"
                on:click={() => {
                    isEditing = false;
                }}
            >
                Cancel
            </button>
            <button
                type="button"
                class="btn btn-primary mt-2"
                class:loading={isSubmitting}
                on:click={handleCropConfirm}
            >
                <span class:hidden={!isSubmitting}>Saving...</span>
                <span class:hidden={isSubmitting}>Save Changes</span>
            </button>
        </div>
    </div>
{/if}

<svelte:head>
    {#if displayAsCircle}
        <style>
            .cropper-view-box,
            .cropper-face {
                border-radius: 50%;
            }
        </style>
    {/if}
</svelte:head>

<style>
    @import "cropperjs/dist/cropper.css";

    .file-name {
        position: absolute;
        bottom: -35px;
        left: 10px;
        font-size: 0.85rem;
        color: #555;
    }

    .file {
        opacity: 0;
        width: 0.1px;
        height: 0.1px;
        position: absolute;
    }
</style>
