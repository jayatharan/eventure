import { useMutation } from "@tanstack/react-query";
import { nodeBackendAxiosInstance } from "../../../../apis/AxiosInstances";

export async function updateParticipantStatus (participantId, status) {
    return (await nodeBackendAxiosInstance.post(`/participants/${participantId}/update-status`, {
        status
    })).data
}

export default function useUpdateParticipantStatus() {
    return useMutation({
        mutationKey: ["updateParticipantStatus"],
        mutationFn: ({participantId, status}) => updateParticipantStatus(participantId, status)
    })
}