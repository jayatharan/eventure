import { javaBackendAxiosInstance } from "../../../../apis/AxiosInstances";

export async function deleteEventTask (eventId, taskId) {
    return await javaBackendAxiosInstance.delete(`/events/${eventId}/tasks/${taskId}`)
} 