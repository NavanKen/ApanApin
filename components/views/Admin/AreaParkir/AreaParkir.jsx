"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  Layers,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ParkingSquare,
} from "lucide-react";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
// import AddKategoriModal from "./AddKategoriModal";
// import EditKategoriModal from "./EditKategoriModal";
// import DeleteKategoriModal from "./DeleteKategoriModal";
import AddAreaParkirModal from "./AddAreaParkirModal";
import EditAreaParkirModal from "./EditAreaParkirModa";
import useAreaParkir from "./useAreaParkir";
import DeleteAreaParkir from "./DeleteAreaParkir/DeleteAreaParkir";

const COLUMNS = [
  { uid: "nama_area", name: "Nama Area" },
  { uid: "kapasitas", name: "Kapasitas" },
  { uid: "actions", name: "Aksi" },
];

const AreaParkir = () => {
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
  } = useAreaParkir();

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
      //   case "image":
      //     return (
      //       <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
      //         {item.image ? (
      //           <Image
      //             src={item.image}
      //             alt={item.nama_kategori}
      //             fill
      //             sizes="1"
      //             className="object-cover"
      //           />
      //         ) : (
      //           <ImageIcon className="w-6 h-6 text-gray-500" />
      //         )}
      //       </div>
      //     );
      case "nama_area":
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
              <ParkingSquare className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{item.nama_area}</p>
            </div>
          </div>
        );

      case "kapasitas":
        return (
          <p className="text-gray-800 text-sm line-clamp-2 max-w-xs">
            {item.kapasitas || "-"}
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
          Manajamen Area Parkir
        </h1>
        <p className="text-gray-500 mt-1">Kelola Area Parkir</p>
      </div>

      <DataTable
        title="Daftar Area Parkir"
        icon={Layers}
        buttonLabel="Tambah Area Parkir"
        onClickButton={() => addModalRef.current?.open()}
        searchValue={searchInputValue}
        searchPlaceholder="Cari nama Area Parkir..."
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

      <AddAreaParkirModal ref={addModalRef} onSuccess={refetchAreaParkir} />
      <EditAreaParkirModal ref={editModalRef} onSuccess={refetchAreaParkir} />
      <DeleteAreaParkir ref={deleteModalRef} onSuccess={refetchAreaParkir} />
    </div>
  );
};

export default AreaParkir;
