"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  Layers,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ParkingSquare,
  CarFront,
  Motorbike,
} from "lucide-react";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import useAktivitas from "./useAktivitas";

const COLUMNS = [
  { uid: "Aktivitas", name: "Aktivitas" },
  { uid: "waktu_aktivitas", name: "Waktu Aktivitas" },
];

const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateStr));
};

const Aktivitas = () => {
  const {
    currentPage,
    currentLimit,
    searchInputValue,
    setURL,
    dataAreaParkir,
    isLoadingAreaParkir,
    isRefetchingAreaParkir,
    refetchAreaParkir,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  } = useAktivitas();

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    setURL();
  }, [setURL]);

  const kategoriList = dataAreaParkir?.data || [];
  const pagination = dataAreaParkir?.pagination || {
    page: currentPage,
    limit: parseInt(currentLimit),
    total: 0,
    totalPages: 1,
  };

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case "Aktivitas":
        return (
          <div className="flex items-center gap-3">
            <div>
              <p className="font-medium text-gray-800">{item.aktivitas}</p>
            </div>
          </div>
        );

      case "waktu_aktivitas":
        return (
          <p className="text-gray-800 text-sm line-clamp-2 max-w-xs">
            {formatDateTime(item.waktu_aktivitas)}
          </p>
        );

      default:
        return item[columnKey];
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e6091]">Log Aktivitas</h1>
        <p className="text-gray-500 mt-1">Kelola Log Aktivitas</p>
      </div>

      <DataTable
        title="Log Aktivitas"
        icon={Layers}
        // buttonLabel="Tambah Area Parkir"
        onClickButton={() => addModalRef.current?.open()}
        searchValue={searchInputValue}
        searchPlaceholder="Cari aktivitas..."
        onSearchChange={handleSearch}
        onClearSearch={handleClearSearch}
        columns={COLUMNS}
        data={kategoriList}
        renderCell={renderCell}
        emptyContent="Kategori tidak ditemukan"
        isLoading={isLoadingAreaParkir || isRefetchingAreaParkir}
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        limit={currentLimit}
        onLimitChange={handleChangeLimit}
        onPageChange={handleChangePage}
      />
    </div>
  );
};

export default Aktivitas;
