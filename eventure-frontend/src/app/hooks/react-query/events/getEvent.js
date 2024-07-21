import { useQuery } from "@tanstack/react-query";
import { javaBackendAxiosInstance } from "../../../../apis/AxiosInstances";

export async function getEvent (eventId) {
    return (await javaBackendAxiosInstance.get(`/events/${eventId}`)).data
}

export default function useEvent(eventId) {
    return useQuery({
        queryKey: ["event", eventId],
        queryFn: () => getEvent(eventId),
    })
}