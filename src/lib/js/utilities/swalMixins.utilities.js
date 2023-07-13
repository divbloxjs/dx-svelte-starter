import Swal from "sweetalert2";

export const successAlert = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-success",
    },
    buttonsStyling: false,
    iconColor: "#68DBB3",
    icon: "success",
});

export const errorAlert = Swal.mixin({
    customClass: {
        popup: "dark:bg-red-100",
        icon: "p-1 my-1",
        confirmButton: "btn btn-error",
    },
    padding: "1rem",
    buttonsStyling: false,
    iconColor: "#FF1717",
    icon: "error",
});

export const successToast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    iconColor: "#68DBB3",
    icon: "success",
});

export const errorToast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    iconColor: "#FF1717",
    icon: "error",
});
