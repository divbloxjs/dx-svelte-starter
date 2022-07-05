import { writable, get } from "svelte/store";
import profilePictureDefault from "../../../assets/images/dx_profile_placeholder.svg";

export const profilePicturePath = writable(
    JSON.parse(localStorage.getItem("profilePicturePath")) ||
        profilePictureDefault
);

profilePicturePath.subscribe((val) =>
    localStorage.setItem("profilePicturePath", JSON.stringify(val))
);

export const updateProfilePicturePath = async () => {
    // TODO Add functionality to update profile picture path from server
    // Remember to update the store with the newly received server profile picture path
    // profilePicturePath.set("/my.new/path.jpg");
};
