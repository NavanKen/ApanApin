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
import useKendaraan from "./useKendaraan";
import { Badge } from "@/components/ui/badge";
import DeleteKendaraanModal from "./DeleteKendaraanModal";
import AddKendaraanModal from "./AddKendaraanModal";
import EditKendaraanModal from "./EditKendaraanModal";

const COLUMNS = [
  { uid: "plat_nomor", name: "Plat Nomor" },
  { uid: "jenis_kendaraan", name: "Jenis Kendaraan" },
  { uid: "Warna", name: "Warna" },
  { uid: "actions", name: "Aksi" },
];

const KENDARAAN_LABEL = {
  motor: {
    label: "motor",
    color: "bg-yellow-100 text-yellow-700",
  },
  mobil: { label: "mobil", color: "bg-green-100 text-green-700" },
};

const Kendaraan = () => {
  const {
    currentPage,
    currentLimit,
    searchInputValue,
    setURL,
    dataKendaraan,
    isLoadingKendaraan,
    isRefetchingKendaraan,
    refetchKendaraan,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  } = useKendaraan();

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    setURL();
  }, [setURL]);

  const kendaraan = dataKendaraan?.data || [];
  const pagination = dataKendaraan?.pagination || {
    page: currentPage,
    limit: parseInt(currentLimit),
    total: 0,
    totalPages: 1,
  };

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case "plat_nomor":
        return (
          <div className="flex items-center gap-3">
            <div
              className={`
                w-9 h-9 rounded-full
                flex items-center justify-center
                text-sm font-medium text-white
                bg-linear-to-br from-[#1e6091] to-[#2980b9]
              `}
            >
              <CarFront className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{item.plat_nomor}</p>
              <p className="text-xs text-gray-400">Pemilik: {item.pemilik}</p>
            </div>
          </div>
        );

      case "jenis_kendaraan":
        const config =
          KENDARAAN_LABEL[item.jenis_kendaraan] || KENDARAAN_LABEL.mobil;
        return (
          <Badge className={config.color}>
            {item.jenis_kendaraan === "mobil" ? "Mobil" : "Motor"}
          </Badge>
        );

      case "Warna":
        return (
          <>
            <p className="text-gray-800 font-medium">{item.warna}</p>
          </>
        );

      case "actions":
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-400 hover:text-gray-600"
              onClick={() => editModalRef.current?.open(item)}
            >
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-400 hover:text-red-500"
              onClick={() => deleteModalRef.current?.open(item)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );

      default:
        return item[columnKey];
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1e6091]">
          Manajamen Kendaraan
        </h1>
        <p className="text-gray-500 mt-1">Kelola Kendaraan</p>
      </div>

      <DataTable
        title="Daftar Kendaraan"
        icon={Layers}
        buttonLabel="Tambah Kendaraan"
        onClickButton={() => addModalRef.current?.open()}
        searchValue={searchInputValue}
        searchPlaceholder="Cari Kendaraan..."
        onSearchChange={handleSearch}
        onClearSearch={handleClearSearch}
        columns={COLUMNS}
        data={kendaraan}
        renderCell={renderCell}
        emptyContent="Kategori tidak ditemukan"
        isLoading={isLoadingKendaraan || isRefetchingKendaraan}
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        limit={currentLimit}
        onLimitChange={handleChangeLimit}
        onPageChange={handleChangePage}
      />

      <AddKendaraanModal ref={addModalRef} onSuccess={refetchKendaraan} />
      <EditKendaraanModal ref={editModalRef} onSuccess={refetchKendaraan} />
      <DeleteKendaraanModal ref={deleteModalRef} onSuccess={refetchKendaraan} />
      {/* <EditTarifModal ref={editModalRef} onSuccess={refetchAreaParkir} /> */}
      {/* <AddAreaParkirModal ref={addModalRef} onSuccess={refetchAreaParkir} />
      <EditAreaParkirModal ref={editModalRef} onSuccess={refetchAreaParkir} />
      <DeleteAreaParkir ref={deleteModalRef} onSuccess={refetchAreaParkir} /> */}
    </div>
  );
};

export default Kendaraan;
