"use client";

import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
} from "@/components/ui/modal";
import { useReactToPrint } from "react-to-print";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateStr));
};

const formatDurasi = (menit) => {
  if (!menit || menit <= 0) return "-";
  const jam = Math.floor(menit / 60);
  const sisaMenit = menit % 60;
  if (jam === 0) return `${sisaMenit} Menit`;
  if (sisaMenit === 0) return `${jam} Jam`;
  return `${jam} Jam ${sisaMenit} Menit`;
};

const CetakStrukModal = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transaksi, setTransaksi] = useState(null);
  const printRef = useRef(null);
  const reactToPrint = useReactToPrint({ contentRef: printRef });

  useImperativeHandle(ref, () => ({
    open: (data) => {
      setTransaksi(data);
      setIsOpen(true);
    },
  }));

  const handleClose = () => {
    setIsOpen(false);
    setTransaksi(null);
  };

  if (!transaksi) return null;

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent className="sm:max-w-md">
        <ModalHeader>
          <ModalTitle>Struk Parkir</ModalTitle>
        </ModalHeader>

        <div ref={printRef} className="p-4 space-y-3">
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-3">
            <h2 className="text-lg font-bold text-[#1e6091]">STRUK PARKIR</h2>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">No. Parkir</span>
              <span className="font-medium">#{transaksi.id_parkir}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Plat Nomor</span>
              <span className="font-medium">
                {transaksi.kendaraan?.plat_nomor}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Jenis</span>
              <span className="font-medium capitalize">
                {transaksi.kendaraan?.jenis_kendaraan}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pemilik</span>
              <span className="font-medium">
                {transaksi.kendaraan?.pemilik}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Area</span>
              <span className="font-medium">{transaksi.area?.nama_area}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-2 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Waktu Masuk</span>
              <span className="font-medium">
                {formatDateTime(transaksi.waktu_masuk)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Waktu Keluar</span>
              <span className="font-medium">
                {formatDateTime(transaksi.waktu_keluar)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Durasi</span>
              <span className="font-medium">
                {formatDurasi(transaksi.durasi_jam)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tarif/Jam</span>
              <span className="font-medium">
                {formatCurrency(transaksi.tarif?.tarif_per_jam)}
              </span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-300 pt-3 border-b-2 pb-3">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-700">TOTAL</span>
              <span className="text-lg font-bold text-[#1e6091]">
                {formatCurrency(transaksi.biaya_total)}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Petugas</span>
            <span className="font-medium">{transaksi.user?.nama_lengkap}</span>
          </div>
        </div>

        <ModalFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="text-black"
            onClick={handleClose}
          >
            Tutup
          </Button>
          <Button
            // onClick={handlePrint}
            onClick={reactToPrint}
            className="bg-linear-to-r from-[#1e6091] to-[#2980b9] hover:from-[#1a5276] hover:to-[#1e6091]/90"
          >
            <Printer className="w-4 h-4 mr-2" />
            Cetak Struk
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

CetakStrukModal.displayName = "CetakStrukModal";

export default CetakStrukModal;
