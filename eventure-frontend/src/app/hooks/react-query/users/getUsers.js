import { useQuery } from "@tanstack/react-query";
import { nodeBackendAxiosInstance } from "../../../../apis/AxiosInstances";

export async function getUsers () {
    return (await nodeBackendAxiosInstance.get("/users")).data;
}

export default function useGetUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => getUsers()
    })
}