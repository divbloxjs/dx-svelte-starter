import { backendRoot } from "$src/lib/js/stores/configurations";
import { handleFetchResponse } from "$src/lib/js/utilities/helpers";
import { errorAlert, errorToast } from "$src/lib/js/utilities/swalMixins";

export const getPlanningTeamsForOrganisationsEndpoint =
    backendRoot + "/api/organisations/getPlanningTeamsForOrganisations";

export const getPlanningCategoriesEndpoint = backendRoot + "/api/projects/getPlanningCategories";

export const getProjectsEndpoint = backendRoot + "/api/projects/getProjects";

export const getPlanningProjectsForOrganisationsEndpoint =
    backendRoot + "/api/projects/getPlanningProjectsForOrganisations";

export const getAssignedProjectRolesEndpoint = backendRoot + "/api/projects/getAssignedProjectRoles";

export const getPlanningTeamsForOrganisations = async (organisationIds = []) => {
    try {
        const getResult = await fetch(getPlanningTeamsForOrganisationsEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ organisationIds: organisationIds }),
        });

        handleFetchResponse(getResult.status);

        if (getResult.status !== 200) {
            try {
                const result = await getResult.json();
                let title = "Something went wrong. <br>Please try again.";

                if (result.message !== undefined) {
                    title = result.message;
                }

                errorToast.fire({
                    title: title,
                    confirmButtonText: "OK",
                    timer: 5000,
                });
            } catch (error) {
                errorToast.fire({
                    title: "Something went wrong. <br>Please try again.",
                    confirmButtonText: "OK",
                    timer: 5000,
                });

                return null;
            }

            return null;
        }
        const responseBody = await getResult.json();
        if (responseBody !== undefined) {
            return responseBody;
        }
    } catch (error) {
        console.error("Team get error: " + error);
        errorAlert.fire({
            html: "Something went wrong. <br>Please try again.",
            confirmButtonText: "OK",
            timer: 5000,
        });
    }

    return null;
};

export const getPlanningCategories = async (projectId = -1) => {
    try {
        const getResult = await fetch(getPlanningCategoriesEndpoint + "?projectId=" + projectId, {
            method: "POST",
            credentials: "include",
        });

        handleFetchResponse(getResult.status);

        if (getResult.status !== 200) {
            try {
                const result = await getResult.json();
                let title = "Something went wrong. <br>Please try again.";

                if (result.message !== undefined) {
                    title = result.message;
                }

                errorToast.fire({
                    title: title,
                    confirmButtonText: "OK",
                    timer: 5000,
                });
            } catch (error) {
                errorToast.fire({
                    title: "Something went wrong. <br>Please try again.",
                    confirmButtonText: "OK",
                    timer: 5000,
                });

                return null;
            }

            return null;
        }
        const responseBody = await getResult.json();
        if (responseBody !== undefined) {
            return responseBody;
        }
    } catch (error) {
        console.error("Planning Category get error: " + error);
        errorAlert.fire({
            html: "Something went wrong. <br>Please try again.",
            confirmButtonText: "OK",
            timer: 5000,
        });
    }

    return null;
};

export const getProjects = async (organisationId = -1) => {
    try {
        const getResult = await fetch(getProjectsEndpoint + "?organisationId=" + organisationId, {
            method: "POST",
            credentials: "include",
        });

        handleFetchResponse(getResult.status);

        if (getResult.status !== 200) {
            try {
                const result = await getResult.json();
                let title = "Something went wrong. <br>Please try again.";

                if (result.message !== undefined) {
                    title = result.message;
                }

                errorToast.fire({
                    title: title,
                    confirmButtonText: "OK",
                    timer: 5000,
                });
            } catch (error) {
                errorToast.fire({
                    title: "Something went wrong. <br>Please try again.",
                    confirmButtonText: "OK",
                    timer: 5000,
                });

                return null;
            }

            return null;
        }
        const responseBody = await getResult.json();
        if (responseBody !== undefined) {
            return responseBody;
        }
    } catch (error) {
        console.error("Projects get error: " + error);
        errorAlert.fire({
            html: "Something went wrong. <br>Please try again.",
            confirmButtonText: "OK",
            timer: 5000,
        });
    }

    return null;
};

export const getPlanningProjectsForOrganisations = async (organisationIds = []) => {
    try {
        const getResult = await fetch(getPlanningProjectsForOrganisationsEndpoint, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ organisationIds: organisationIds }),
        });

        handleFetchResponse(getResult.status);

        if (getResult.status !== 200) {
            try {
                const result = await getResult.json();
                let title = "Something went wrong. <br>Please try again.";

                if (result.message !== undefined) {
                    title = result.message;
                }

                errorToast.fire({
                    title: title,
                    confirmButtonText: "OK",
                    timer: 5000,
                });
            } catch (error) {
                errorToast.fire({
                    title: "Something went wrong. <br>Please try again.",
                    confirmButtonText: "OK",
                    timer: 5000,
                });

                return null;
            }

            return null;
        }
        const responseBody = await getResult.json();
        if (responseBody !== undefined) {
            return responseBody;
        }
    } catch (error) {
        console.error("Projects get error: " + error);
        errorAlert.fire({
            html: "Something went wrong. <br>Please try again.",
            confirmButtonText: "OK",
            timer: 5000,
        });
    }

    return null;
};

export const taskEndpoint = backendRoot + "/api/projects/task";
export const updateTasksEndpoint = backendRoot + "/api/projects/updateTasks";
export const getTasksEndpoint = backendRoot + "/api/projects/getTasks";

export const getTask = async (taskId = -1, projectId = -1) => {
    try {
        const getResult = await fetch(taskEndpoint + "?id=" + taskId + "&projectId=" + projectId, {
            method: "GET",
            credentials: "include",
        });

        handleFetchResponse(getResult.status);

        if (getResult.status !== 200) {
            try {
                const result = await getResult.json();
                let title = "Something went wrong. <br>Please try again.";

                if (result.message !== undefined) {
                    title = result.message;
                }

                errorToast.fire({
                    title: title,
                    confirmButtonText: "OK",
                    timer: 5000,
                });
            } catch (error) {
                errorToast.fire({
                    title: "Something went wrong. <br>Please try again.",
                    confirmButtonText: "OK",
                    timer: 5000,
                });

                return null;
            }

            return null;
        }
        const responseBody = await getResult.json();
        if (responseBody !== undefined) {
            return responseBody;
        }
    } catch (error) {
        console.error("Task get error: " + error);
        errorAlert.fire({
            html: "Something went wrong. <br>Please try again.",
            confirmButtonText: "OK",
            timer: 5000,
        });
    }

    return null;
};

export const createTask = async (taskData = null, projectId = -1) => {
    try {
        const createResult = await fetch(taskEndpoint + "?projectId=" + projectId, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(taskData),
        });

        handleFetchResponse(createResult.status);

        if (createResult.status !== 200) {
            try {
                const result = await createResult.json();
                let title = "Something went wrong. <br>Please try again.";

                if (result.message !== undefined) {
                    title = result.message;
                }

                errorToast.fire({
                    title: title,
                    confirmButtonText: "OK",
                    timer: 5000,
                });
            } catch (error) {
                errorToast.fire({
                    title: "Something went wrong. <br>Please try again.",
                    confirmButtonText: "OK",
                    timer: 5000,
                });

                return -1;
            }

            return -1;
        }

        const responseBody = await createResult.json();

        if (responseBody.id !== undefined) {
            successToast.fire({ title: taskData.taskName + " has been created!", timer: 3000 });
            return responseBody.id;
        }
    } catch (error) {
        console.error("Task create error: " + error);
        errorAlert.fire({
            html: "Something went wrong. <br>Please try again.",
            confirmButtonText: "OK",
            timer: 5000,
        });
    }
    return -1;
};

export const updateTask = async (taskId = -1, taskData = null, projectId = -1) => {
    try {
        const updateResult = await fetch(taskEndpoint + "?id=" + taskId + "&projectId=" + projectId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(taskData),
        });

        handleFetchResponse(updateResult.status);

        if (updateResult.status !== 200) {
            try {
                const result = await updateResult.json();
                let title = "Something went wrong. <br>Please try again.";

                if (result.message !== undefined) {
                    title = result.message;
                }

                errorToast.fire({
                    title: title,
                    confirmButtonText: "OK",
                    timer: 5000,
                });
            } catch (error) {
                errorToast.fire({
                    title: "Something went wrong. <br>Please try again.",
                    confirmButtonText: "OK",
                    timer: 5000,
                });
            }

            return false;
        }

        successToast.fire({
            title: "Task updated!",
            confirmButtonText: "OK",
            timer: 5000,
        });
    } catch (error) {
        errorToast.fire({
            title: "Something went wrong. <br>Please try again.",
            confirmButtonText: "OK",
            timer: 5000,
        });
        console.error("Task update error: " + error);
        return false;
    }
    return true;
};

export const deleteTask = async (taskId = -1, projectId = -1) => {
    try {
        const deleteResult = await fetch(taskEndpoint + "?id=" + taskId + "&projectId=" + projectId, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        handleFetchResponse(deleteResult.status);

        if (deleteResult.status !== 200) {
            try {
                const result = await deleteResult.json();
                let title = "Something went wrong. <br>Please try again.";

                if (result.message !== undefined) {
                    title = result.message;
                }

                errorToast.fire({
                    title: title,
                    confirmButtonText: "OK",
                    timer: 5000,
                });
            } catch (error) {
                errorToast.fire({
                    title: "Something went wrong. <br>Please try again.",
                    confirmButtonText: "OK",
                    timer: 5000,
                });

                return false;
            }

            return false;
        }

        successToast.fire({
            title: "Task deleted!",
            confirmButtonText: "OK",
            timer: 5000,
        });
    } catch (error) {
        errorAlert.fire({
            html: "Something went wrong. <br>Please try again.",
            confirmButtonText: "OK",
            timer: 5000,
        });
        console.error("Task delete error: " + error);
        return false;
    }
    return true;
};

export const getAssignedProjectRoles = async (projectId = -1, postBody = {}) => {
    try {
        const getResult = await fetch(getAssignedProjectRolesEndpoint + "?projectId=" + projectId, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postBody),
        });

        handleFetchResponse(getResult.status);

        if (getResult.status !== 200) {
            try {
                const result = await getResult.json();
                let title = "Something went wrong. <br>Please try again.";

                if (result.message !== undefined) {
                    title = result.message;
                }

                errorToast.fire({
                    title: title,
                    confirmButtonText: "OK",
                    timer: 5000,
                });
            } catch (error) {
                errorToast.fire({
                    title: "Something went wrong. <br>Please try again.",
                    confirmButtonText: "OK",
                    timer: 5000,
                });

                return null;
            }

            return null;
        }
        const responseBody = await getResult.json();
        if (responseBody !== undefined) {
            return responseBody;
        }
    } catch (error) {
        console.error("AssignedProjectRoles get error: " + error);
        errorAlert.fire({
            html: "Something went wrong. <br>Please try again.",
            confirmButtonText: "OK",
            timer: 5000,
        });
    }

    return null;
};
