"use client";

import { useCallback, useEffect, useRef } from "react";
import { Layers, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import useKategori from "./useKategori";
import AddKategoriModal from "./AddKategoriModal";
import EditKategoriModal from "./EditKategoriModal";
import DeleteKategoriModal from "./DeleteKategoriModal";

const COLUMNS = [
  { uid: "image", name: "Gambar" },
  { uid: "nama_kategori", name: "Nama Kategori" },
  { uid: "deskripsi", name: "Deskripsi" },
  { uid: "actions", name: "Aksi" },
];

const Kategori = () => {
  const {
    currentPage,
    currentLimit,
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
  } = useKategori();

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    setURL();
  }, [setURL]);

  const kategoriList = dataKategori?.data || [];
  const pagination = dataKategori?.pagination || {
    page: currentPage,
    limit: parseInt(currentLimit),
    total: 0,
    totalPages: 1,
  };

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case "image":
        return (
          <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-700 flex items-center justify-center">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.nama_kategori}
                fill
                sizes="1"
                className="object-cover"
              />
            ) : (
              <ImageIcon className="w-6 h-6 text-gray-500" />
            )}
          </div>
        );

      case "nama_kategori":
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
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{item.nama_kategori}</p>
              <p className="text-xs text-gray-400">ID: {item.id_kategori}</p>
            </div>
          </div>
        );

      case "deskripsi":
        return (
          <p className="text-gray-800 text-sm line-clamp-2 max-w-xs">
            {item.deskripsi || "-"}
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
        <h1 className="text-2xl font-bold text-[#1e6091]">Manajemen Kategori</h1>
        <p className="text-gray-500 mt-1">
          Kelola kategori produk dengan gambar dan deskripsi
        </p>
      </div>

      <DataTable
        title="Daftar Kategori"
        icon={Layers}
        buttonLabel="Tambah Kategori"
        onClickButton={() => addModalRef.current?.open()}
        searchValue={searchInputValue}
        searchPlaceholder="Cari nama kategori..."
        onSearchChange={handleSearch}
        onClearSearch={handleClearSearch}
        columns={COLUMNS}
        data={kategoriList}
        renderCell={renderCell}
        emptyContent="Kategori tidak ditemukan"
        isLoading={isLoadingKategori || isRefetchingKategori}
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        limit={currentLimit}
        onLimitChange={handleChangeLimit}
        onPageChange={handleChangePage}
      />

      <AddKategoriModal ref={addModalRef} onSuccess={refetchKategori} />
      <EditKategoriModal ref={editModalRef} onSuccess={refetchKategori} />
      <DeleteKategoriModal ref={deleteModalRef} onSuccess={refetchKategori} />
    </div>
  );
};

export default Kategori;
