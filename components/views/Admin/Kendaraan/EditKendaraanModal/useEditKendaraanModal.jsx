"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { kendaraanSchema } from "@/lib/validations/kendaraan.schema";
import kendaraanService from "@/service/kendaraan.service";

const useEditKendaraan = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [preview, setPreview] = useState("");

  const form = useForm({
    resolver: zodResolver(kendaraanSchema),
    mode: "onChange",
    defaultValues: {
      plat_nomor: "",
      pemilik: "",
      warna: "",
      jenis_kendaraan: "",
    },
  });

  const { mutate: updateKendaraan, isPending: isUpdating } = useMutation({
    mutationFn: async (data) => {
      const res = await kendaraanService.updateKendaraan(
        selectedUser.id_kendaraan,
        data,
      );
      return res;
    },
    onSuccess: () => {
      toast.success("Kendaraan berhasil diperbarui");
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
        plat_nomor: user.plat_nomor,
        pemilik: user.pemilik,
        warna: user.warna,
        jenis_kendaraan: user.jenis_kendaraan,
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
    updateKendaraan(data);
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

export default useEditKendaraan;
