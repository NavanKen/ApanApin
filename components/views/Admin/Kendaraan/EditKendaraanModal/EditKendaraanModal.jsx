"use client";

import { forwardRef, useImperativeHandle } from "react";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import useEditKendaraan from "./useEditKendaraanModal";

const kendaraanList = [
  {
    id: "1",
    value: "motor",
    nama: "Motor",
  },
  {
    id: "2",
    value: "mobil",
    nama: "Mobil",
  },
  {
    id: "3",
    value: "Lainnya",
    nama: "lainnya",
  },
  ,
];

const EditKendaraanModal = forwardRef(({ onSuccess }, ref) => {
  const {
    isOpen,
    handleOpenChange,
    form,
    isCreating,
    isPendingMutateUploadFile,
    handleOpen,
    handleClose,
    handleSubmit,
  } = useEditKendaraan({ onSuccess });

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  const { control } = form;

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent className="sm:max-w-lg" onClose={handleClose}>
        <ModalHeader>
          <ModalTitle>Edit Kendaraan </ModalTitle>
          <ModalDescription>
            Lengkapi informasi Kendaraan yang ingin ditambahkan.
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plat_nomor">Plat Nomor</Label>
            <Controller
              name="plat_nomor"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id="plat_nomor"
                    placeholder="Masukkan Plat Nomor"
                    className={
                      error
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "focus-visible:ring-blue-500 focus-visible:border-blue-600"
                    }
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jenis_kendaraan">Jenis Kendaraan</Label>
            <Controller
              name="jenis_kendaraan"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={`w-full
                                ${error ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder={"Pilih Role"} />
                    </SelectTrigger>
                    <SelectContent>
                      {kendaraanList.map((jenis) => (
                        <SelectItem key={jenis.id} value={String(jenis.value)}>
                          {jenis.nama}
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

          <div className="grid gap-2">
            <Label htmlFor="warna">Warna</Label>
            <Controller
              name="warna"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id="warna"
                    placeholder="Masukkan Warna kendaraan"
                    className={`${
                      error
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "focus-visible:ring-blue-500 focus-visible:border-blue-600"
                    }`}
                  />
                  {error && (
                    <p className="text-sm text-red-500">{error.message}</p>
                  )}
                </>
              )}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pemilik">Pemilik</Label>
            <Controller
              name="pemilik"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id="warna"
                    placeholder="Masukkan Pemilik kendaraan"
                    className={`${
                      error
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "focus-visible:ring-blue-500 focus-visible:border-blue-600"
                    }`}
                  />
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
              disabled={isCreating || isPendingMutateUploadFile}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isCreating || isPendingMutateUploadFile}
              className="bg-linear-to-r from-[#1e6091] to-[#2980b9] hover:from-[#1a5276] hover:to-[#1e6091]/90"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Update Kendaraan"
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
});

EditKendaraanModal.displayName = "EditKendaraanModal";

export default EditKendaraanModal;
