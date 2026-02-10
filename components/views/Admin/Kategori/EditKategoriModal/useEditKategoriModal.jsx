"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import kategoriServices from "@/service/kategori.service";
import useMediaHandling from "@/hooks/use-media-handling";
import { createKategoriSchema } from "@/lib/validations/kategori.validation";

const useEditKategoriModal = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedKategori, setSelectedKategori] = useState(null);
  const [preview, setPreview] = useState("");
  const [originalImage, setOriginalImage] = useState("");

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

  const { mutate: updateKategori, isPending: isUpdating } = useMutation({
    mutationFn: async (data) => {
      if (originalImage && data.image !== originalImage) {
        try {
          await mutateDeleteFile({
            url: originalImage,
            callback: () => {},
          });
        } catch (e) {}
      }
      const res = await kategoriServices.updateKategori(
        selectedKategori.id_kategori,
        data,
      );
      return res;
    },
    onSuccess: () => {
      toast.success("Kategori berhasil diperbarui");
      form.reset();
      setSelectedKategori(null);
      setPreview("");
      setOriginalImage("");
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || "Gagal memperbarui kategori";
      toast.error(message);
    },
  });

  const handleUploadImage = useCallback(
    (files) => {
      if (files && files[0]) {
        const currentImage = form.getValues("image");
        if (currentImage && currentImage !== originalImage) {
          mutateDeleteFile({
            url: currentImage,
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
    [mutateUploadFile, mutateDeleteFile, form, originalImage],
  );

  const handleOpen = useCallback(
    (kategori) => {
      setSelectedKategori(kategori);
      setOriginalImage(kategori.image || "");
      setPreview(kategori.image || "");
      form.reset({
        nama_kategori: kategori.nama_kategori || "",
        deskripsi: kategori.deskripsi || "",
        image: kategori.image || "",
      });
      form.clearErrors();
      setIsOpen(true);
    },
    [form],
  );

  const handleClose = useCallback(() => {
    const currentImage = form.getValues("image");
    if (currentImage && currentImage !== originalImage) {
      mutateDeleteFile({
        url: currentImage,
        callback: () => {},
      });
    }
    form.reset();
    form.clearErrors();
    setSelectedKategori(null);
    setPreview("");
    setOriginalImage("");
    setIsOpen(false);
  }, [form, mutateDeleteFile, originalImage]);

  const handleOpenChange = useCallback(
    (open) => {
      if (!open) {
        const currentImage = form.getValues("image");
        if (currentImage && currentImage !== originalImage) {
          mutateDeleteFile({
            url: currentImage,
            callback: () => {},
          });
        }
        form.reset();
        form.clearErrors();
        setSelectedKategori(null);
        setPreview("");
        setOriginalImage("");
      }
      setIsOpen(open);
    },
    [form, mutateDeleteFile, originalImage],
  );

  const onSubmit = (data) => {
    updateKategori(data);
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    isOpen,
    handleOpenChange,
    form,
    isUpdating,
    selectedKategori,
    preview,
    isPendingMutateUploadFile,
    handleOpen,
    handleClose,
    handleSubmit,
    handleUploadImage,
  };
};

export default useEditKategoriModal;
