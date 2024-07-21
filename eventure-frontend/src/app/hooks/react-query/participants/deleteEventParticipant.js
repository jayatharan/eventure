import { javaBackendAxiosInstance } from "../../../../apis/AxiosInstances";

export async function deleteEventParticipant(eventId, participantId) {
    return await javaBackendAxiosInstance.delete(`/events/${eventId}/participants/${participantId}`)
}