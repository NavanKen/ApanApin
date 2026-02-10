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
import useEditKategoriModal from "./useEditKategoriModal";

const EditKategoriModal = forwardRef(({ onSuccess }, ref) => {
  const {
    isOpen,
    handleOpenChange,
    form,
    isUpdating,
    preview,
    isPendingMutateUploadFile,
    handleOpen,
    handleClose,
    handleSubmit,
    handleUploadImage,
  } = useEditKategoriModal({ onSuccess });

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  const { control } = form;

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent className="sm:max-w-lg" onClose={handleClose}>
        <ModalHeader>
          <ModalTitle>Edit Kategori</ModalTitle>
          <ModalDescription>Perbarui informasi kategori.</ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-nama_kategori">Nama Kategori</Label>
            <Controller
              name="nama_kategori"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id="edit-nama_kategori"
                    placeholder="Masukkan nama kategori"
                    className={
                      error ? "border-red-500 focus-visible:ring-red-500" : ""
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
            <Label htmlFor="edit-deskripsi">Deskripsi</Label>
            <Controller
              name="deskripsi"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Textarea
                    {...field}
                    id="edit-deskripsi"
                    placeholder="Masukkan deskripsi kategori"
                    rows={3}
                    className={
                      error ? "border-red-500 focus-visible:ring-red-500" : ""
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
            <Label>Gambar (Opsional)</Label>
            <InputFile
              name="image"
              isDropable
              preview={preview}
              onUpload={handleUploadImage}
              isUploading={isPendingMutateUploadFile}
            />
          </div>

          <ModalFooter className="flex gap-2">
            <Button
              className="text-black"
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUpdating || isPendingMutateUploadFile}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isUpdating || isPendingMutateUploadFile}
              className="bg-linear-to-r from-[#0891B2] to-[#06B6D4] hover:from-[#0891B2]/90 hover:to-[#06B6D4]/90"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
});

EditKategoriModal.displayName = "EditKategoriModal";

export default EditKategoriModal;
