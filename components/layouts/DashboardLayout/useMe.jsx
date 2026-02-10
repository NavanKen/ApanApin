"use client";

import { useQuery } from "@tanstack/react-query";
import authServices from "@/service/auth.service";

const useMe = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["me"],
        queryFn: async () => {
            const res = await authServices.getUserInfo();
            return res.data.data;
        },
    });
    console.log("data", data)

    return { data, isLoading, error };
};

export default useMe;
