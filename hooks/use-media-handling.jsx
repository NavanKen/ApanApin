"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import mediaServices from "@/service/media.service";

const useMediaHandling = () => {
  const uploadFile = async (file, callback) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await mediaServices.uploadFile(formData);

    if (res.data.success) {
      callback(res.data.url);
    }
  };

  const { mutate: mutateUploadFile, isPending: isPendingMutateUploadFile } =
    useMutation({
      mutationFn: ({ file, callback }) => uploadFile(file, callback),
      onError: (error) => {
        toast.error(error.message || "Gagal upload file");
      },
    });

  const deleteFile = async (url, callback) => {
    const res = await mediaServices.deleteFile(url);

    if (res.data.success) {
      callback();
    }
  };

  const { mutate: mutateDeleteFile, isPending: isPendingMutateDeleteFile } =
    useMutation({
      mutationFn: ({ url, callback }) => deleteFile(url, callback),
      onError: (error) => {
        toast.error(error.message || "Gagal hapus file");
      },
    });

  return {
    mutateUploadFile,
    isPendingMutateUploadFile,
    mutateDeleteFile,
    isPendingMutateDeleteFile,
  };
};

export default useMediaHandling;
