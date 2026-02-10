"use client";

import { useEffect, useId, useRef } from "react";
import { Loader2, Upload, RefreshCw } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const InputFile = ({
  name,
  isDropable = false,
  className,
  onUpload,
  isUploading,
  preview,
  isInvalid,
  errorMessage,
}) => {
  const drop = useRef(null);
  const dropzoneId = useId();

  const handleDragOver = (e) => {
    if (isDropable) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;

    if (files && onUpload) {
      onUpload(files);
    }
  };

  useEffect(() => {
    const dropCurrent = drop.current;

    if (dropCurrent) {
      dropCurrent.addEventListener("dragover", handleDragOver);
      dropCurrent.addEventListener("drop", handleDrop);
    }

    return () => {
      dropCurrent?.removeEventListener("dragover", handleDragOver);
      dropCurrent?.removeEventListener("drop", handleDrop);
    };
  });

  const handleOnUpload = (e) => {
    const files = e.currentTarget.files;

    if (files && onUpload) {
      onUpload(files);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label
        ref={drop}
        className={cn(
          "relative flex min-h-24 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors duration-200",
          className,
        )}
        htmlFor={`dropzone-file-${dropzoneId}`}
      >
        {preview && !isUploading && (
          <div className="relative flex flex-col items-center justify-center p-4">
            <div className="relative w-40 h-40 mb-2">
              <Image
                src={preview}
                fill
                alt="Preview"
                className="object-contain rounded-lg"
              />
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
              <RefreshCw className="w-3 h-3" />
              <span>Klik untuk ganti gambar</span>
            </div>
          </div>
        )}

        {!preview && !isUploading && (
          <div className="flex flex-col items-center justify-center p-5">
            <Upload className="mb-2 h-10 w-10 text-gray-400" />
            <p className="text-center text-sm font-medium text-gray-400">
              {isDropable
                ? "Drag and drop atau klik untuk upload"
                : "Klik untuk upload gambar"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, JPEG (Max 5MB)
            </p>
          </div>
        )}

        {isUploading && (
          <div className="flex flex-col items-center justify-center p-5">
            <Loader2 className="h-10 w-10 animate-spin text-[#1e6091]" />
            <p className="text-sm text-gray-400 mt-2">Mengupload...</p>
          </div>
        )}

        <input
          name={name}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleOnUpload}
          id={`dropzone-file-${dropzoneId}`}
          onClick={(e) => {
            e.currentTarget.value = "";
          }}
        />
      </label>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

export default InputFile;
