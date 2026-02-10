"use client";

import { useCallback, useEffect, useRef } from "react";
import { Layers, Edit2, Trash2, Image as ImageIcon, Users } from "lucide-react";
// import Image from "next/image";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import useUser from "./useUser";
import { Badge } from "@/components/ui/badge";
import AddUserModal from "./AddUserModal.jsx";
import EditUserModal from "./EditUserModal.jsx";
import DeleteKategoriModal from "./DeleteUserModal.jsx";
// import EditKategoriModal from "./EditKategoriModal";
// import DeleteKategoriModal from "./DeleteKategoriModal";

const COLUMNS = [
  { uid: "username", name: "Username" },
  { uid: "role", name: "Role" },
  { uid: "actions", name: "Aksi" },
];

const STATUS_ROLE = {
  admin: {
    label: "Admin",
    color: "bg-yellow-100 text-yellow-700",
  },
  owner: { label: "Owner", color: "bg-green-100 text-green-700" },
  petugas: { label: "Petugas", color: "bg-red-100 text-red-700" },
};

const User = () => {
  const {
    currentPage,
    currentLimit,
    searchInputValue,
    setURL,
    dataUser,
    isLoadingUser,
    isRefetchingUser,
    refetchUser,
    handleChangePage,
    handleChangeLimit,
    handleSearch,
    handleClearSearch,
  } = useUser();

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    setURL();
  }, [setURL]);

  const userList = dataUser?.data || [];
  const pagination = dataUser?.pagination || {
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

      case "username":
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
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-gray-800">{item.username}</p>
              <p className="text-xs text-gray-400">
                Nama Lengkap: {item.nama_lengkap}
              </p>
            </div>
          </div>
        );

      case "role":
        const config = STATUS_ROLE[item.role] || STATUS_ROLE.petugas;
        return <Badge className={config.color}>{config.label}</Badge>;

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
        <h1 className="text-2xl font-bold text-[#1e6091]">Manajemen User</h1>
        <p className="text-gray-500 mt-1">
          Kelola user untuk mengakses aplikasi
        </p>
      </div>
      <DataTable
        title="Daftar User"
        icon={Users}
        buttonLabel="Tambah Users"
        onClickButton={() => addModalRef.current?.open()}
        searchValue={searchInputValue}
        searchPlaceholder="Cari nama users..."
        onSearchChange={handleSearch}
        onClearSearch={handleClearSearch}
        columns={COLUMNS}
        data={userList}
        renderCell={renderCell}
        emptyContent="User Tidak Ditemukan tidak ditemukan"
        isLoading={isLoadingUser || isRefetchingUser}
        currentPage={currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.total}
        limit={currentLimit}
        onLimitChange={handleChangeLimit}
        onPageChange={handleChangePage}
      />
      <AddUserModal ref={addModalRef} onSuccess={refetchUser} />
      <EditUserModal ref={editModalRef} onSuccess={refetchUser} />
      <DeleteKategoriModal ref={deleteModalRef} onSuccess={refetchUser} />
      {/* <AddKategoriModal ref={addModalRef} onSuccess={refetchKategori} /> */}
      {/* <EditKategoriModal ref={editModalRef} onSuccess={refetchKategori} />
      <DeleteKategoriModal ref={deleteModalRef} onSuccess={refetchKategori} /> */}
    </div>
  );
};

export default User;
