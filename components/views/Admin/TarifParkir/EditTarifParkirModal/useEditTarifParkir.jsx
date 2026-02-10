"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { tarifPerjam } from "@/lib/validations/tarif.schema";
import tarifParkirService from "@/service/tarif_parkir.service";

const useEditTarifParkirModal = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTarif, setSelectedTarif] = useState(null);

  const form = useForm({
    resolver: zodResolver(tarifPerjam),
    mode: "onChange",
    defaultValues: {
      tarif_per_jam: "",
    },
  });

  const { mutate: updateTarifParkir, isPending: isUpdating } = useMutation({
    mutationFn: async (data) => {
      const res = await tarifParkirService.updateTarifParkir(
        selectedTarif.id_tarif,
        data,
      );
      return res;
    },
    onSuccess: () => {
      toast.success("Tarif berhasil diperbarui");
      form.reset();
      setSelectedTarif(null);
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Gagal memperbarui Tarif";
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
    (area) => {
      setSelectedTarif(area);
      form.reset({
        tarif_per_jam: area.tarif_per_jam,
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
    setSelectedTarif(null);
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
        setSelectedTarif(null);
      }
      setIsOpen(open);
    },
    [form],
  );

  const onSubmit = (data) => {
    updateTarifParkir(data);
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    isOpen,
    handleOpenChange,
    form,
    isUpdating,
    selectedTarif,
    handleOpen,
    handleClose,
    handleSubmit,
  };
};

export default useEditTarifParkirModal;
