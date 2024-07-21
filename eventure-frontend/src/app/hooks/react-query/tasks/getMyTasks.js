import { useQuery } from "@tanstack/react-query";
import { nodeBackendAxiosInstance } from "../../../../apis/AxiosInstances";

export async function getMyTasks (status, from) {
    return (await nodeBackendAxiosInstance.get("/tasks/my-tasks", {
        params:{
            status,
            from
        }
    })).data
}

export default function useMyTasks(status, from) {
    return useQuery({
        queryKey: ["myTasks", status, from],
        queryFn: () => getMyTasks(status, from)
    })
}