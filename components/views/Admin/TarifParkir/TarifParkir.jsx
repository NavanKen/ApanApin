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
import useTarifParkir from "./useTarifParkir";
import EditTarifModal from "./EditTarifParkirModal";

const COLUMNS = [
  { uid: "jenis_kendaraan", name: "Jenis Kendaraan" },
  { uid: "tarif_per_jam", name: "Tarif per Jam" },
  { uid: "actions", name: "Aksi" },
];

const TarifParkir = () => {
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
  } = useTarifParkir();

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
      case "jenis_kendaraan":
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
              {item.jenis_kendaraan === "motor" ? (
                <>
                  <Motorbike />
                </>
              ) : (
                <>
                  <CarFront className="w-4 h-4" />
                </>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">
                {item.jenis_kendaraan}
              </p>
            </div>
          </div>
        );

      case "tarif_per_jam":
        return (
          <p className="text-gray-800 text-sm line-clamp-2 max-w-xs">
            {item.tarif_per_jam || "-"}
          </p>
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
            {/* <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 text-gray-400 hover:text-red-500"
              onClick={() => deleteModalRef.current?.open(item)}
            >
              <Trash2 className="w-4 h-4" />
            </Button> */}
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
          Manajamen Tarif Parkir
        </h1>
        <p className="text-gray-500 mt-1">Kelola Area Parkir</p>
      </div>

      <DataTable
        title="Daftar Area Parkir"
        icon={Layers}
        // buttonLabel="Tambah Area Parkir"
        onClickButton={() => addModalRef.current?.open()}
        searchValue={searchInputValue}
        searchPlaceholder="Cari Tarif Parkir..."
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
      <EditTarifModal ref={editModalRef} onSuccess={refetchAreaParkir} />

      {/* <AddAreaParkirModal ref={addModalRef} onSuccess={refetchAreaParkir} />
      <EditAreaParkirModal ref={editModalRef} onSuccess={refetchAreaParkir} />
      <DeleteAreaParkir ref={deleteModalRef} onSuccess={refetchAreaParkir} /> */}
    </div>
  );
};

export default TarifParkir;
