import { javaBackendAxiosInstance } from "../../../../apis/AxiosInstances";

export async function saveEvent (event) {
    return (await javaBackendAxiosInstance.post("/events/save", event)).data;
}