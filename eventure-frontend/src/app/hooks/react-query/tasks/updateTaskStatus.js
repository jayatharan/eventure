import { useMutation } from "@tanstack/react-query";
import { nodeBackendAxiosInstance } from "../../../../apis/AxiosInstances";

export async function updateTaskStatus (taskId, status) {
    return (await nodeBackendAxiosInstance.post(`/tasks/${taskId}/update-status`, {
        status
    })).data
}

export default function useUpdateTaskStatus() {
    return useMutation({
        mutationKey: ["updateTaskStatus"],
        mutationFn: ({taskId, status}) => updateTaskStatus(taskId, status)
    })
}