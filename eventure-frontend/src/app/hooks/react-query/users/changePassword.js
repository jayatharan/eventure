import { nodeBackendAxiosInstance } from "../../../../apis/AxiosInstances";

export async function changePassword (password) {
    return (await nodeBackendAxiosInstance.post("/auth/change-password", {
        password
    })).data
}
