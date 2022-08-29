<script>
    import { defaultImagePath } from "$src/lib/js/utilities/helpers.js";
    import { fade } from "svelte/transition";
    import Fa from "svelte-fa";
    import { faPencil } from "@fortawesome/free-solid-svg-icons";
    import Cropper from "cropperjs";
    import { onMount, afterUpdate } from "svelte";

    export let localDefaultImagePath = defaultImagePath;
    export let displayImagePath;
    export let uploadResponse = {};
    export let aspect = { x: 4, y: 3 };
    export let forceCropAspectRatio = true;
    export let displayAsCircle = false;
    export let maxHeight = "300px";
    export let maxWidth = "500px";
    export let objectFit = "contain"; // [contain / cover ]
    export let imageName = "Divblox Image";
    export let uploadEndpoint;
    export let credentials = "include";

    let isEditing = false;
    let isSubmitting = false;
    let uploadSuccessful = false;
    let isCropperInitialised = false;
    let fileUploaderEl;
    let imageEditorPath = localDefaultImagePath;
    let displayedImageEl;
    let cropper;
    let imageEditorEl;
    let modifiedCanvas;
    let imagePath;

    let aspectRatio = displayAsCircle ? 1 : NaN;
    if (forceCropAspectRatio) {
        aspectRatio = displayAsCircle ? 1 : aspect.x / aspect.y;
    }

    $: displayImagePathLocal = displayImagePath;
    $: displayImagePathLocal, handleDisplayImagePathChanged();

    const handleDisplayImagePathChanged = () => {
        imagePath = displayImagePath !== undefined ? displayImagePath : localDefaultImagePath;
    };

    const handleFileSelected = () => {
        uploadSuccessful = false;
        isEditing = true;
        imageEditorPath = URL.createObjectURL(fileUploaderEl.files[0]);
    };

    const handleFileUpload = async () => {
        uploadResponse = {};
        isSubmitting = true;
        if (uploadEndpoint === undefined) {
            throw new Error("uploadEndpoint has not been defined");
        }

        let formData = new FormData();
        formData.append("file", fileUploaderEl.files[0]);

        try {
            const uploadResult = await fetch(uploadEndpoint, {
                method: "POST",
                body: formData,
                // @ts-ignore
                credentials: credentials,
            });

            if (uploadResult.status !== 200) {
                uploadResponse.uploadError = uploadResult;
            } else {
                uploadResponse = await uploadResult.json();
                isEditing = false;
                isSubmitting = false;
                uploadSuccessful = true;
                return true;
            }
        } catch (error) {
            console.error(error);
            uploadResponse.uploadError = error;
        }
        isSubmitting = false;
        return false;
    };

    const initCropper = () => {
        if (cropper !== undefined && cropper !== null) {
            cropper.destroy();
        }

        cropper = undefined;
        cropper = new Cropper(imageEditorEl, {
            aspectRatio: aspectRatio,
            viewMode: 1,
            dragMode: "move",
        });

        isCropperInitialised = true;
    };

    afterUpdate(() => {
        if (!isEditing) {
            if (uploadSuccessful) {
                displayedImageEl.src = modifiedCanvas.toDataURL();
                displayedImageEl.innerHTML = "";
            }

            isCropperInitialised = false;
        }

        if (isEditing && !isCropperInitialised) {
            initCropper();
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
        context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
        context.fill();
        return canvas;
    };

    const handleConfirmCrop = async () => {
        modifiedCanvas = cropper.getCroppedCanvas(); // Crop
        if (displayAsCircle) {
            // Round
            modifiedCanvas = getRoundedCanvas(modifiedCanvas);
        }

        // convert to Blob (async)
        modifiedCanvas.toBlob((blob) => {
            const fileName = fileUploaderEl.files[0].name;
            const file = new File([blob], fileName);
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileUploaderEl.files = dataTransfer.files;
            handleFileUpload();
        });
    };
</script>

<div class="mx-auto max-w-full" style="max-height: {maxHeight}; max-width: {maxWidth};">
    <div class="avatar">
        <div
            style="aspect-ratio: {aspectRatio}; max-height: {maxHeight}; max-width: {maxWidth}"
            class:rounded-full={displayAsCircle}
            class:rounded-lg={!displayAsCircle}>
            <img
                bind:this={displayedImageEl}
                on:error={() => (imagePath = defaultImagePath)}
                class:image-contain={objectFit === "contain"}
                class:image-cover={objectFit === "cover"}
                src={imagePath}
                alt={imageName} />
        </div>
    </div>
</div>

<div class="file-input mx-auto">
    <input type="file" bind:this={fileUploaderEl} on:change={handleFileSelected} id="file" class="file" />
    <label for="file" class="btn btn-link -mt-5 text-base-content">
        Edit
        <Fa icon={faPencil} size="xs" translateY={0} translateX={0.5} />
        <p class="file-name" />
    </label>
</div>

{#if isEditing}
    <div transition:fade={{ duration: 200 }} class="fixed top-0 left-0 z-50 h-screen w-screen bg-base-200">
        <div class="m-auto mt-[2rem] max-h-[calc(100vh-6rem)] w-11/12 max-w-[90vw]">
            <img
                bind:this={imageEditorEl}
                src={imageEditorPath}
                on:error={() => (imageEditorPath = localDefaultImagePath)}
                alt="Edited" />
        </div>
        <div class="mx-auto w-11/12 max-w-[90vw] text-center">
            <button
                type="button"
                class="btn btn-link mt-2 text-base-content"
                class:btn-disabled={isSubmitting}
                on:click={() => (isEditing = false)}>
                Cancel
            </button>
            <button
                type="button"
                class="btn btn-primary mt-2"
                class:loading={isSubmitting}
                on:click={handleConfirmCrop}>
                <span class:hidden={!isSubmitting}>Saving...</span>
                <span class:hidden={isSubmitting}>Save Changes</span>
            </button>
        </div>
    </div>
{/if}

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

    .image-contain {
        object-fit: contain;
        object-position: center;
        border-radius: 10px;
    }

    .image-cover {
        object-fit: cover;
        object-position: right top;
    }
</style>
