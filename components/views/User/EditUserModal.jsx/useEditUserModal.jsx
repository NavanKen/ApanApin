"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
// import AreaParkirController from "@/controllers/area_parkir.controller";
import { userSchemaEdit } from "@/lib/validations/auth.schema";

import UserService from "@/service/user.service";

const useEditUserModal = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [preview, setPreview] = useState("");

  const form = useForm({
    resolver: zodResolver(userSchemaEdit),
    mode: "onChange",
    defaultValues: {
      nama_lengkap: "",
      username: "",
      role: "",
    },
  });

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: async (data) => {
      const res = await UserService.updateUser(selectedUser.id_user, data);
      return res;
    },
    onSuccess: () => {
      toast.success("User berhasil diperbarui");
      form.reset();
      setSelectedUser(null);
      setPreview("");
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Gagal memperbarui User";
      toast.error(message);
    },
  });

  //   const handleUploadImage = useCallback(
  //     (files) => {
  //       if (files && files[0]) {
  //         const currentImage = form.getValues("image");
  //         if (currentImage && currentImage !== originalImage) {
  //           mutateDeleteFile({
  //             url: currentImage,
  //             callback: () => {},
  //           });
  //         }

  //         mutateUploadFile({
  //           file: files[0],
  //           callback: (url) => {
  //             setPreview(url);
  //             form.setValue("image", url);
  //           },
  //         });
  //       }
  //     },
  //     [mutateUploadFile, mutateDeleteFile, form, originalImage],
  //   );

  const handleOpen = useCallback(
    (user) => {
      setSelectedUser(user);
      form.reset({
        username: user.username || "",
        role: user.role || "",
        nama_lengkap: user.nama_lengkap || "",
      });
      form.clearErrors();
      setIsOpen(true);
    },
    [form],
  );

  const handleClose = useCallback(() => {
    // const currentImage = form.getValues("image");
    // if (currentImage && currentImage !== originalImage) {
    //   mutateDeleteFile({
    //     url: currentImage,
    //     callback: () => {},
    //   });
    // }
    form.reset();
    form.clearErrors();
    setSelectedUser(null);
    setPreview("");
    setIsOpen(false);
  }, [form]);

  const handleOpenChange = useCallback(
    (open) => {
      if (!open) {
        // const currentImage = form.getValues("image");
        // if (currentImage && currentImage !== originalImage) {
        //   mutateDeleteFile({
        //     url: currentImage,
        //     callback: () => {},
        //   });
        // }
        form.reset();
        form.clearErrors();
        setSelectedUser(null);
        setPreview("");
      }
      setIsOpen(open);
    },
    [form],
  );

  const onSubmit = (data) => {
    updateUser(data);
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    isOpen,
    handleOpenChange,
    form,
    isUpdating,
    selectedUser,
    preview,

    handleOpen,
    handleClose,
    handleSubmit,
  };
};

export default useEditUserModal;
