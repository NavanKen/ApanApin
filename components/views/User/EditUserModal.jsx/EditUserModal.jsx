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
import useEditUserModal from "./useEditUserModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const roleList = [
  {
    id: "1",
    value: "admin",
    nama: "Admin",
  },
  {
    id: "2",
    value: "petugas",
    nama: "Petugas",
  },
  {
    id: "3",
    value: "owner",
    nama: "Owner",
  },
  ,
];

const EditUserModal = forwardRef(({ onSuccess }, ref) => {
  const {
    isOpen,
    handleOpenChange,
    form,
    isCreating,
    handleOpen,
    handleClose,
    handleSubmit,
  } = useEditUserModal({ onSuccess });

  useImperativeHandle(ref, () => ({
    open: handleOpen,
  }));

  const { control } = form;

  return (
    <Modal open={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent className="sm:max-w-lg" onClose={handleClose}>
        <ModalHeader>
          <ModalTitle>Edit User</ModalTitle>
          <ModalDescription>
            Perbarui Informasi User dibawah ini
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Controller
              name="username"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id="username"
                    placeholder="Masukkan Username"
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
            <Label htmlFor="nama_lengkap">Nama Lengkap</Label>
            <Controller
              name="nama_lengkap"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Input
                    {...field}
                    id="nama_lengkap"
                    placeholder="Masukkan Nama Lengkap"
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

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Controller
              name="role"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={` w-full
                           ${error ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder={"Pilih Role"} />
                    </SelectTrigger>
                    <SelectContent>
                      {roleList.map((role) => (
                        <SelectItem key={role.id} value={String(role.value)}>
                          {role.nama}
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
                "Edit User"
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
});

EditUserModal.displayName = "EditUserModal";

export default EditUserModal;
