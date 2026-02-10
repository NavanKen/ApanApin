"use client";

import { forwardRef, useImperativeHandle } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useDeleteKendaraan from "./useDeleteKategoriModal";

const DeleteKendaraanModal = forwardRef(({ onSuccess }, ref) => {
  const {
    isOpen,
    handleOpenChange,
    isDeleting,
    selectedKategori,
    handleOpen,
    handleClose,
    handleConfirm,
  } = useDeleteKendaraan({ onSuccess });

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Hapus Kendaraan ?</DialogTitle>
              <DialogDescription>
                Tindakan ini tidak dapat dibatalkan
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-gray-800">
            Apakah Anda yakin ingin menghapus Kendaraan{" "}
            <span className="font-semibold text-white">
              {selectedKategori?.plat_nomor}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Data Kendaraan terkait akan dihapus secara permanen.
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus Kendaraan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

DeleteKendaraanModal.displayName = "DeleteKendaraanModal";

export default DeleteKendaraanModal;
