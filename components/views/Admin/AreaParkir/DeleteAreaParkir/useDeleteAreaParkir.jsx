"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import AreaParkisService from "@/service/area_parkir.service";

const useDeleteAreaParkir = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAreaParkir, setSelectedAreaParkir] = useState(null);

  const { mutate: deleteAreaParkir, isPending: isDeleting } = useMutation({
    mutationFn: async (area) => {
      return AreaParkisService.deleteAreaParkir(area.id_area);
    },
    onSuccess: () => {
      toast.success("Area Parkir berhasil dihapus");
      setSelectedAreaParkir(null);
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Gagal menghapus Dataaaa";
      console.log("message", error);
      toast.error(message);
    },
  });

  const handleOpen = useCallback((data) => {
    setSelectedAreaParkir(data);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedAreaParkir(null);
    setIsOpen(false);
  }, []);

  const handleOpenChange = useCallback((open) => {
    if (!open) {
      setSelectedAreaParkir(null);
    }
    setIsOpen(open);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedAreaParkir) {
      deleteAreaParkir(selectedAreaParkir);
    }
  }, [selectedAreaParkir, deleteAreaParkir]);

  return {
    isOpen,
    handleOpenChange,
    isDeleting,
    handleOpen,
    handleClose,
    handleConfirm,
  };
};

export default useDeleteAreaParkir;
