"use client";

import { forwardRef, useImperativeHandle } from "react";
import { Loader2 } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputFile from "@/components/ui/input-file";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import useAddAreaParkirModal from "./useAddAreaParkirModal";

const AddAreaParkirModal = forwardRef(({ onSuccess }, ref) => {
  const {
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
  } = useAddAreaParkirModal({ onSuccess });

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  const { control } = form;

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent className="sm:max-w-lg" onClose={handleClose}>
        <ModalHeader>
          <ModalTitle>Tambah Area Parkir Baru</ModalTitle>
          <ModalDescription>
            Lengkapi informasi Area Parkir yang ingin ditambahkan.
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama_area">Nama Area Parkir</Label>
            <Controller
              name="nama_area"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id="nama_area"
                    placeholder="Masukkan Nama Area"
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

          <div className="grid gap-2">
            <Label htmlFor="kapasitas">Kapasitas</Label>
            <Controller
              name="kapasitas"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id="kapasitas"
                    placeholder="Masukkan deskripsi kategori"
                    type={"number"}
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
                "Tambah Kategori"
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
});

AddAreaParkirModal.displayName = "AddAreaParkirModal";

export default AddAreaParkirModal;
