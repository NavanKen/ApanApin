"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import kategoriServices from "@/service/kategori.service";
import mediaServices from "@/service/media.service";

const useDeleteKategoriModal = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState(null);

  const { mutate: deleteKategori, isPending: isDeleting } = useMutation({
    mutationFn: async (kategori) => {
      if (kategori.image) {
        try {
          await mediaServices.deleteFile(kategori.image);
        } catch (error) {
          console.error("Failed to delete image:", error);
        }
      }

      return kategoriServices.deleteKategori(kategori.id_kategori);
    },
    onSuccess: () => {
      toast.success("Kategori berhasil dihapus");
      setSelectedKategori(null);
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Gagal menghapus kategori";
      toast.error(message);
    },
  });

  const handleOpen = useCallback((kategori) => {
    setSelectedKategori(kategori);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedKategori(null);
    setIsOpen(false);
  }, []);

  const handleOpenChange = useCallback((open) => {
    if (!open) {
      setSelectedKategori(null);
    }
    setIsOpen(open);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedKategori) {
      deleteKategori(selectedKategori);
    }
  }, [selectedKategori, deleteKategori]);

  return {
    isOpen,
    handleOpenChange,
    isDeleting,
    selectedKategori,
    handleOpen,
    handleClose,
    handleConfirm,
  };
};

export default useDeleteKategoriModal;
