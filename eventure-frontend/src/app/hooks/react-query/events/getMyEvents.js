import { useQuery } from "@tanstack/react-query";
import { javaBackendAxiosInstance } from "../../../../apis/AxiosInstances";

export async function getMyEvents (from) {
    return (await javaBackendAxiosInstance.get("/events/my-events", {
        params:{
            from
        }
    })).data
}

export default function useMyEvents(from) {
    return useQuery({
        queryKey: ["myEvents", from],
        queryFn: () => getMyEvents(from),
        enabled: false
    })
} 