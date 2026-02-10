"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import kategoriServices from "@/service/kategori.service";
import useMediaHandling from "@/hooks/use-media-handling";
import { createKategoriSchema } from "@/lib/validations/kategori.validation";

const useAddKategoriModal = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState("");

  const { mutateUploadFile, isPendingMutateUploadFile, mutateDeleteFile } =
    useMediaHandling();

  const form = useForm({
    resolver: zodResolver(createKategoriSchema),
    mode: "onChange",
    defaultValues: {
      nama_kategori: "",
      deskripsi: "",
      image: "",
    },
  });

  const { mutate: createKategori, isPending: isCreating } = useMutation({
    mutationFn: async (data) => {
      const res = await kategoriServices.createKategori(data);
      return res;
    },
    onSuccess: () => {
      toast.success("Kategori berhasil ditambahkan");
      form.reset();
      setPreview("");
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || "Gagal menambahkan kategori";
      toast.error(message);
    },
  });

  const handleUploadImage = useCallback(
    (files) => {
      if (files && files[0]) {
        const oldImageUrl = form.getValues("image");
        if (oldImageUrl) {
          mutateDeleteFile({
            url: oldImageUrl,
            callback: () => {},
          });
        }

        mutateUploadFile({
          file: files[0],
          callback: (url) => {
            setPreview(url);
            form.setValue("image", url);
          },
        });
      }
    },
    [mutateUploadFile, mutateDeleteFile, form],
  );

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
  }, [form, mutateDeleteFile]);

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
    [form, mutateDeleteFile],
  );

  const onSubmit = (data) => {
    createKategori(data);
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    isOpen,
    handleOpenChange,
    form,
    isCreating,
    preview,
    isPendingMutateUploadFile,
    handleOpen,
    handleClose,
    handleSubmit,
    handleUploadImage,
  };
};

export default useAddKategoriModal;
