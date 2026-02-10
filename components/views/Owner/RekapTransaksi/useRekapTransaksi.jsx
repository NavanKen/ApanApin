"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/use-debounce";
import transaksiService from "@/service/transaksi.service";

const LIMIT_DEFAULT = "8";
const PAGE_DEFAULT = "1";
const DELAY = 500;

// Default date range: current month
const getDefaultStartDate = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
};

const getDefaultEndDate = () => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
};

const useRekapTransaksi = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const debounce = useDebounce();

    const currentLimit = searchParams.get("limit") || LIMIT_DEFAULT;
    const currentPage = searchParams.get("page") || PAGE_DEFAULT;
    const currentSearch = searchParams.get("search") || "";
    const currentSort = searchParams.get("sort") || "desc";
    const currentStatus = searchParams.get("status") || "";
    const currentStartDate =
        searchParams.get("startDate") || getDefaultStartDate();
    const currentEndDate = searchParams.get("endDate") || getDefaultEndDate();

    const [searchInputValue, setSearchInputValue] = useState(currentSearch);

    useEffect(() => {
        setSearchInputValue(currentSearch);
    }, [currentSearch]);

    const setURL = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        let needsUpdate = false;

        if (!searchParams.has("limit")) {
            params.set("limit", LIMIT_DEFAULT);
            needsUpdate = true;
        }
        if (!searchParams.has("page")) {
            params.set("page", PAGE_DEFAULT);
            needsUpdate = true;
        }
        if (!searchParams.has("search")) {
            params.set("search", "");
            needsUpdate = true;
        }
        if (!searchParams.has("startDate")) {
            params.set("startDate", getDefaultStartDate());
            needsUpdate = true;
        }
        if (!searchParams.has("endDate")) {
            params.set("endDate", getDefaultEndDate());
            needsUpdate = true;
        }

        if (needsUpdate) {
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [searchParams, pathname, router]);

    const getTransaksi = async () => {
        let params = `limit=${currentLimit}&page=${currentPage}`;

        if (currentSearch) {
            params += `&search=${currentSearch}`;
        }
        if (currentSort) {
            params += `&sort=${currentSort}`;
        }
        if (currentStatus) {
            params += `&status=${currentStatus}`;
        }
        if (currentStartDate) {
            params += `&startDate=${currentStartDate}`;
        }
        if (currentEndDate) {
            params += `&endDate=${currentEndDate}`;
        }

        const res = await transaksiService.getTransaksi(params);
        return res.data;
    };

    const {
        data: dataTransaksi,
        isLoading: isLoadingTransaksi,
        isRefetching: isRefetchingTransaksi,
        refetch: refetchTransaksi,
    } = useQuery({
        queryKey: [
            "RekapTransaksi",
            currentPage,
            currentLimit,
            currentSearch,
            currentSort,
            currentStatus,
            currentStartDate,
            currentEndDate,
        ],
        queryFn: getTransaksi,
        enabled: !!currentPage && !!currentLimit,
    });

    const updateParams = useCallback(
        (updates) => {
            const params = new URLSearchParams(searchParams.toString());
            Object.entries(updates).forEach(([key, value]) => {
                params.set(key, String(value));
            });
            router.push(`${pathname}?${params.toString()}`);
        },
        [searchParams, pathname, router],
    );

    const handleChangePage = useCallback(
        (page) => {
            updateParams({ page });
        },
        [updateParams],
    );

    const handleChangeLimit = useCallback(
        (limit) => {
            updateParams({ limit, page: PAGE_DEFAULT });
        },
        [updateParams],
    );

    const handleSearch = useCallback(
        (e) => {
            const search = e.target.value;
            setSearchInputValue(search);
            debounce(() => {
                updateParams({ search, page: PAGE_DEFAULT });
            }, DELAY);
        },
        [debounce, updateParams],
    );

    const handleClearSearch = useCallback(() => {
        setSearchInputValue("");
        updateParams({ search: "", page: PAGE_DEFAULT });
    }, [updateParams]);

    const handleChangeSort = useCallback(
        (sort) => {
            updateParams({ sort, page: PAGE_DEFAULT });
        },
        [updateParams],
    );

    const handleChangeStatus = useCallback(
        (status) => {
            updateParams({
                status: status === "semua" ? "" : status,
                page: PAGE_DEFAULT,
            });
        },
        [updateParams],
    );

    const handleChangeStartDate = useCallback(
        (e) => {
            updateParams({ startDate: e.target.value, page: PAGE_DEFAULT });
        },
        [updateParams],
    );

    const handleChangeEndDate = useCallback(
        (e) => {
            updateParams({ endDate: e.target.value, page: PAGE_DEFAULT });
        },
        [updateParams],
    );

    return {
        currentPage: Number(currentPage),
        currentLimit,
        currentSearch,
        currentSort,
        currentStatus,
        currentStartDate,
        currentEndDate,
        searchInputValue,
        setURL,
        dataTransaksi,
        isLoadingTransaksi,
        isRefetchingTransaksi,
        refetchTransaksi,
        handleChangePage,
        handleChangeLimit,
        handleSearch,
        handleClearSearch,
        handleChangeSort,
        handleChangeStatus,
        handleChangeStartDate,
        handleChangeEndDate,
    };
};

export default useRekapTransaksi;
