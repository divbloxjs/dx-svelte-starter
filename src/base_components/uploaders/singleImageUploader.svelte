<script>
    import defaultImage from "../../assets/images/no_image.svg";
    import { fade } from "svelte/transition";
    export let defaultImagePath = defaultImage;
    export let displayImagePath;
    export let aspect = { x: 4, y: 3 };
    export let displayAsCircle = false;
    export let maxHeight = "300px";
    import Fa from "svelte-fa";
    import { faPencil } from "@fortawesome/free-solid-svg-icons";
    import Cropper from "cropperjs";
    import { onMount, afterUpdate } from "svelte";

    export let imageName = "Divblox Image";

    let isEditing = false;
    let fileUploader;
    let imageEditorPath = defaultImagePath;
    let displayedImageEl;
    const handleFileUpload = () => {
        isEditing = true;
        imageEditorPath = URL.createObjectURL(fileUploader.files[0]);
    };

    onMount(() => {
        // cropper = new Cropper(image, {
        //     aspectRatio: 1,
        //     viewMode: 1,
        // });
    });

    afterUpdate(() => {
        if (isEditing) {
            cropper = new Cropper(image, {
                aspectRatio: 1,
                viewMode: 1,
            });
        } else {
            if (modifiedCanvas !== undefined) {
                displayedImageEl.src = modifiedCanvas.toDataURL();
                displayedImageEl.innerHTML = "";
            }
        }
    });

    let imagePath =
        displayImagePath !== undefined ? displayImagePath : defaultImagePath;

    let aspectRatio = displayAsCircle ? 1 : aspect.x / aspect.y;

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

    let cropper;
    let image;
    let result;
    let croppedCanvas;
    let modifiedCanvas;
    let roundedImage;

    const handleCropConfirm = () => {
        // Crop
        modifiedCanvas = cropper.getCroppedCanvas();

        // Round
        if (displayAsCircle) {
            modifiedCanvas = getRoundedCanvas(modifiedCanvas);
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
        isEditing = false;

        // roundedImage = document.createElement("img");
        // roundedImage.src = modifiedCanvas.toDataURL();
        // result.innerHTML = "";
        // result.appendChild(roundedImage);
    };
</script>

{#if !isEditing}
    <div class="max-w-full mx-auto" style="max-height: {maxHeight}">
        <div class="avatar">
            <div
                style="aspect-ratio: {aspectRatio}; 
            max-height: {maxHeight}"
                class:rounded-full={displayAsCircle}
                class:rounded={!displayAsCircle}
            >
                <img
                    bind:this={displayedImageEl}
                    src={imagePath}
                    alt={imageName}
                />
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
        <label for="file" class="btn btn-link text-base-content">
            Edit
            <Fa icon={faPencil} size="0.8x" translateY={0} translateX={0.5} />
            <p class="file-name" />
        </label>
    </div>
{:else}
    <div class="container">
        <h1>Crop a round image</h1>
        <div>
            <img bind:this={image} src={imageEditorPath} alt="Picture" />
        </div>
        <h3>Result</h3>
        <button
            type="button"
            class="btn btn-primary"
            on:click={handleCropConfirm}
        >
            Crop
        </button>
        <div bind:this={result} />
    </div>{/if}

<style>
    @import "cropperjs/dist/cropper.css";

    :global(.cropper-view-box, .cropper-face) {
        border-radius: 50%;
    }
    .file-name {
        position: absolute;
        bottom: -35px;
        left: 10px;
        font-size: 0.85rem;
        color: #555;
    }

    input:focus + label {
        outline: 1px solid #000;
        outline: -webkit-focus-ring-color auto 2px;
    }

    input:hover + label,
    input:focus + label {
        transform: scale(1.02);
    }

    .file {
        opacity: 0;
        width: 0.1px;
        height: 0.1px;
        position: absolute;
    }
</style>
