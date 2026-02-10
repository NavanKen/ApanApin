"use client";

import { useState, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import transaksiService from "@/service/transaksi.service";

const addTransaksiSchema = z.object({
    id_kendaraan: z.string().min(1, "Kendaraan Wajib Dipilih"),
    id_area: z.string().min(1, "Area Parkir Wajib Dipilih"),
});

const useAddTransaksiModal = ({ onSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm({
        resolver: zodResolver(addTransaksiSchema),
        mode: "onChange",
        defaultValues: {
            id_kendaraan: "",
            id_area: "",
        },
    });

    // Fetch kendaraan list
    const { data: kendaraanData } = useQuery({
        queryKey: ["KendaraanList"],
        queryFn: async () => {
            const res = await transaksiService.getKendaraanList("limit=100");
            return res.data;
        },
        enabled: isOpen,
    });

    // Fetch area parkir list
    const { data: areaParkirData } = useQuery({
        queryKey: ["AreaParkirList"],
        queryFn: async () => {
            const res = await transaksiService.getAreaParkirList("limit=100");
            return res.data;
        },
        enabled: isOpen,
    });

    const { mutate: createTransaksi, isPending: isCreating } = useMutation({
        mutationFn: async (data) => {
            const res = await transaksiService.createTransaksi({
                id_kendaraan: Number(data.id_kendaraan),
                id_area: Number(data.id_area),
            });
            return res;
        },
        onSuccess: () => {
            toast.success("Transaksi masuk berhasil dibuat");
            form.reset();
            setIsOpen(false);
            onSuccess?.();
        },
        onError: (error) => {
            const message =
                error.response?.data?.error || "Gagal membuat transaksi";
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
                form.reset();
                form.clearErrors();
            }
            setIsOpen(open);
        },
        [form],
    );

    const onSubmit = (data) => {
        createTransaksi(data);
    };

    const handleSubmit = form.handleSubmit(onSubmit);

    const kendaraanList = kendaraanData?.data || [];
    const areaParkirList = areaParkirData?.data || [];

    return {
        isOpen,
        handleOpenChange,
        form,
        isCreating,
        handleOpen,
        handleClose,
        handleSubmit,
        kendaraanList,
        areaParkirList,
    };
};

export default useAddTransaksiModal;
