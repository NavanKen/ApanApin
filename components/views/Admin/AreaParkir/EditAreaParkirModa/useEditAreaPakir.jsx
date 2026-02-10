"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import AreaParkisService from "@/service/area_parkir.service";
import { areaParkirSchema } from "@/lib/validations/area_parkir.schema";

const useEditAreaParkirModal = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAreaParkir, setSelecteAreaParkir] = useState(null);
  const [preview, setPreview] = useState("");

  const form = useForm({
    resolver: zodResolver(areaParkirSchema),
    mode: "onChange",
    defaultValues: {
      nama_area: "",
      kapasitas: 0,
    },
  });

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: async (data) => {
      const res = await AreaParkisService.updateAreaParkir(
        selectedAreaParkir.id_area,
        data,
      );
      return res;
    },
    onSuccess: () => {
      toast.success("User berhasil diperbarui");
      form.reset();
      setSelecteAreaParkir(null);
      setPreview("");
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      const message = error.response?.data?.error || "Gagal memperbarui User";
      console.log("error", error);
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
      setSelecteAreaParkir(area);
      form.reset({
        nama_area: area.nama_area || "",
        kapasitas: Number(area.kapasitas),
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
    setSelecteAreaParkir(null);
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
        setSelecteAreaParkir(null);
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
    selectedAreaParkir,
    preview,

    handleOpen,
    handleClose,
    handleSubmit,
  };
};

export default useEditAreaParkirModal;
