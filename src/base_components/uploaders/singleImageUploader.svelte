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

    export let imageName = "Divblox Image";

    let isEditing = false;

    let imagePath =
        displayImagePath !== undefined ? displayImagePath : defaultImagePath;

    let aspectRatio = displayAsCircle ? 1 : aspect.x / aspect.y;
</script>

{#if !isEditing}
    <div
        transition:fade={{ duration: 500 }}
        class="max-w-full mx-auto"
        style="max-height: {maxHeight}"
    >
        <div class="avatar">
            <div
                style="aspect-ratio: {aspectRatio}; 
            max-height: {maxHeight}"
                class:rounded-full={displayAsCircle}
                class:rounded={!displayAsCircle}
            >
                <img src={imagePath} alt={imageName} />
            </div>
        </div>
    </div>

    <div class="file-input mx-auto">
        <input
            type="file"
            on:change={() => (isEditing = true)}
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
    <p transition:fade={{ duration: 500 }}>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique,
        maxime. Tempore repellat quo ad est, natus accusantium rerum totam
        deleniti fuga. Inventore illo odio numquam architecto illum mollitia
        aliquam! Dicta.
    </p>

    <img src="" alt="" />
{/if}

<style>
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
