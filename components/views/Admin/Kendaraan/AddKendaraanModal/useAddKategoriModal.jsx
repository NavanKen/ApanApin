"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import kendaraanService from "@/service/kendaraan.service";
import { kendaraanSchema } from "@/lib/validations/kendaraan.schema";

const useAddKendaraanModal = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //   const { mutateUploadFile, isPendingMutateUploadFile, mutateDeleteFile } =
  //     useMediaHandling();

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

  const { mutate: createUser, isPending: isCreating } = useMutation({
    mutationFn: async (data) => {
      const res = await kendaraanService.createKendaraan(data);
      return res;
    },
    onSuccess: () => {
      toast.success("Kendaraan berhasil ditambahkan");
      form.reset();
      setPreview("");
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Gagal menambahkan User";
      toast.error(message);
    },
  });

  //   const handleUploadImage = useCallback(
  //     (files) => {
  //       if (files && files[0]) {
  //         const oldImageUrl = form.getValues("image");
  //         if (oldImageUrl) {
  //           mutateDeleteFile({
  //             url: oldImageUrl,
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
  //     [mutateUploadFile, mutateDeleteFile, form],
  //   );

  const handleOpen = useCallback(() => {
    form.reset();
    form.clearErrors();
    setPreview("");
    setIsOpen(true);
  }, [form]);

  const handleClose = useCallback(() => {
    const imageUrl = form.getValues("image");
    if (imageUrl) {
      mutateDeleteFile({
        url: imageUrl,
        callback: () => {},
      });
    }
    form.reset();
    form.clearErrors();
    setPreview("");
    setIsOpen(false);
  }, [form]);

  const handleOpenChange = useCallback(
    (open) => {
      if (!open) {
        const imageUrl = form.getValues("image");
        if (imageUrl) {
          mutateDeleteFile({
            url: imageUrl,
            callback: () => {},
          });
        }
        form.reset();
        form.clearErrors();
        setPreview("");
      }
      setIsOpen(open);
    },
    [form],
  );

  const onSubmit = (data) => {
    createUser(data);
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    isOpen,
    handleOpenChange,
    form,
    isCreating,
    preview,
    handleOpen,
    handleClose,
    handleSubmit,
  };
};

export default useAddKendaraanModal;
