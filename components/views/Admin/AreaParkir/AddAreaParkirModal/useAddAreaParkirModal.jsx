"use client";

import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import AreaParkisService from "@/service/area_parkir.service";
import { areaParkirSchema } from "@/lib/validations/area_parkir.schema";

const useAddAreaParkirModal = ({ onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState("");

  const form = useForm({
    resolver: zodResolver(areaParkirSchema),
    mode: "onChange",
    defaultValues: {
      nama_area: "",
      kapasitas: 0,
    },
  });

  const { mutate: createAreaParkir, isPending: isCreating } = useMutation({
    mutationFn: async (data) => {
      const res = await AreaParkisService.createAreaParkir(data);
      return res;
    },
    onSuccess: () => {
      toast.success("Kategori berhasil ditambahkan");
      form.reset();
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error) => {
      const message =
        error.response?.data?.error || "Gagal menambahkan kategori";
      toast.error(message);
    },
  });

  const handleOpen = useCallback(() => {
    form.reset();
    form.clearErrors();
    setIsOpen(true);
  }, [form]);

  const handleClose = useCallback(() => {
    form.reset();
    form.clearErrors();
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
    createAreaParkir(data);
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

export default useAddAreaParkirModal;
