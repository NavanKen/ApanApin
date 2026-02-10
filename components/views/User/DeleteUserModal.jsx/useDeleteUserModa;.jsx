"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import UserService from "@/service/user.service";

const useDeleteUserModal = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: async (user) => {
      return UserService.deleteUser(user.id_user);
    },
    onSuccess: () => {
      toast.success("User berhasil dihapus");
      setSelectedUser(null);
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
    setSelectedUser(data);
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedUser(null);
    setIsOpen(false);
  }, []);

  const handleOpenChange = useCallback((open) => {
    if (!open) {
      setSelectedUser(null);
    }
    setIsOpen(open);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedUser) {
      deleteUser(selectedUser);
    }
  }, [selectedUser, deleteUser]);

  return {
    isOpen,
    handleOpenChange,
    isDeleting,
    handleOpen,
    handleClose,
    handleConfirm,
  };
};

export default useDeleteUserModal;
