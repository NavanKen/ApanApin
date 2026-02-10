"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/use-debounce";
import kategoriServices from "@/service/kategori.service";

const LIMIT_DEFAULT = "8";
const PAGE_DEFAULT = "1";
const DELAY = 500;

const useKategori = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const debounce = useDebounce();

  const currentLimit = searchParams.get("limit") || LIMIT_DEFAULT;
  const currentPage = searchParams.get("page") || PAGE_DEFAULT;
  const currentSearch = searchParams.get("search") || "";

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

    if (needsUpdate) {
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname, router]);

  const getKategori = async () => {
    let params = `limit=${currentLimit}&page=${currentPage}`;

    if (currentSearch) {
      params += `&search=${currentSearch}`;
    }

    const res = await kategoriServices.getKategori(params);
    return res.data;
  };

  const {
    data: dataKategori,
    isLoading: isLoadingKategori,
    isRefetching: isRefetchingKategori,
    refetch: refetchKategori,
  } = useQuery({
    queryKey: ["Kategori", currentPage, currentLimit, currentSearch],
    queryFn: getKategori,
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

  return {
    currentPage: Number(currentPage),
    currentLimit,
    currentSearch,
    searchInputValue,
    setURL,
    dataKategori,
    isLoadingKategori,
    isRefetchingKategori,
    refetchKategori,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  };
};

export default useKategori;
