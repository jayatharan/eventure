import { useQuery } from "@tanstack/react-query";
import { nodeBackendAxiosInstance } from "../../../../apis/AxiosInstances";

export async function nameCheck (name) {
    return (await nodeBackendAxiosInstance.get("/auth/name-check", {
        params: {
            name
        }
    })).data
}

export default function useNameCheck(name) {
    return useQuery({
        queryKey: ["nameCheck", name],
        queryFn: () => nameCheck(name)
    })
}