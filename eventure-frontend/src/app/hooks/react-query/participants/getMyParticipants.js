import { useQuery } from "@tanstack/react-query"
import { nodeBackendAxiosInstance } from "../../../../apis/AxiosInstances"

export async function getMyParticipants (status, from) {
    return (await nodeBackendAxiosInstance.get("/participants/my-participants", {
        params:{
            status,
            from
        }
    })).data
}

export default function useMyParticipants(status, from) {
    return useQuery({
        queryKey: ["myParticipants", status, from],
        queryFn: () => getMyParticipants(status, from)
    })
}