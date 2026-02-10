"use client";

import { forwardRef, useImperativeHandle } from "react";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalDescription,
} from "@/components/ui/modal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useAddTransaksiModal from "./useAddTransaksiModal";

const AddTransaksiModal = forwardRef(({ onSuccess }, ref) => {
    const {
        isOpen,
        handleOpenChange,
        form,
        isCreating,
        handleOpen,
        handleClose,
        handleSubmit,
        kendaraanList,
        areaParkirList,
    } = useAddTransaksiModal({ onSuccess });

    useImperativeHandle(ref, () => ({
        open: handleOpen,
    }));

    const { control } = form;

    return (
        <Modal open={isOpen} onOpenChange={handleOpenChange}>
            <ModalContent className="sm:max-w-lg" onClose={handleClose}>
                <ModalHeader>
                    <ModalTitle>Transaksi Masuk Baru</ModalTitle>
                    <ModalDescription>
                        Pilih kendaraan dan area parkir untuk membuat transaksi masuk.
                    </ModalDescription>
                </ModalHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="id_kendaraan">Kendaraan</Label>
                        <Controller
                            name="id_kendaraan"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger
                                            className={`w-full ${error ? "border-red-500" : ""}`}
                                        >
                                            <SelectValue placeholder="Pilih Kendaraan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kendaraanList.map((kendaraan) => (
                                                <SelectItem
                                                    key={kendaraan.id_kendaraan}
                                                    value={String(kendaraan.id_kendaraan)}
                                                >
                                                    {kendaraan.plat_nomor} — {kendaraan.pemilik} (
                                                    {kendaraan.jenis_kendaraan})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {error && (
                                        <p className="text-sm text-red-500">{error.message}</p>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="id_area">Area Parkir</Label>
                        <Controller
                            name="id_area"
                            control={control}
                            render={({ field, fieldState: { error } }) => (
                                <>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger
                                            className={`w-full ${error ? "border-red-500" : ""}`}
                                        >
                                            <SelectValue placeholder="Pilih Area Parkir" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {areaParkirList.map((area) => (
                                                <SelectItem
                                                    key={area.id_area}
                                                    value={String(area.id_area)}
                                                >
                                                    {area.nama_area} (Sisa:{" "}
                                                    {area.kapasitas - (area.terisi || 0)})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {error && (
                                        <p className="text-sm text-red-500">{error.message}</p>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    <ModalFooter className="flex gap-2">
                        <Button
                            type="button"
                            className="text-black"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isCreating}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isCreating}
                            className="bg-linear-to-r from-[#1e6091] to-[#2980b9] hover:from-[#1a5276] hover:to-[#1e6091]/90"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Buat Transaksi Masuk"
                            )}
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
});

AddTransaksiModal.displayName = "AddTransaksiModal";

export default AddTransaksiModal;
