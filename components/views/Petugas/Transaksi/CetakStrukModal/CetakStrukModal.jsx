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

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Struk Parkir</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              max-width: 300px;
              margin: 0 auto;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #333;
              padding-bottom: 12px;
              margin-bottom: 12px;
            }
            .header h1 {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 4px;
            }
            .header p {
              font-size: 11px;
              color: #666;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
              font-size: 12px;
            }
            .row .label {
              font-weight: bold;
              color: #555;
            }
            .row .value {
              text-align: right;
            }
            .divider {
              border-top: 1px dashed #999;
              margin: 8px 0;
            }
            .total {
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              padding: 12px 0;
              border-top: 2px dashed #333;
              border-bottom: 2px dashed #333;
              margin: 8px 0;
            }
            .footer {
              text-align: center;
              font-size: 10px;
              color: #999;
              margin-top: 12px;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>STRUK PARKIR</h1>
            <p>Sistem Manajemen Parkir</p>
          </div>

          <div class="row">
            <span class="label">No. Parkir</span>
            <span class="value">#${transaksi?.id_parkir || "-"}</span>
          </div>
          <div class="row">
            <span class="label">Plat Nomor</span>
            <span class="value">${transaksi?.kendaraan?.plat_nomor || "-"}</span>
          </div>
          <div class="row">
            <span class="label">Jenis</span>
            <span class="value">${transaksi?.kendaraan?.jenis_kendaraan || "-"}</span>
          </div>
          <div class="row">
            <span class="label">Pemilik</span>
            <span class="value">${transaksi?.kendaraan?.pemilik || "-"}</span>
          </div>
          <div class="row">
            <span class="label">Area</span>
            <span class="value">${transaksi?.area?.nama_area || "-"}</span>
          </div>

          <div class="divider"></div>

          <div class="row">
            <span class="label">Waktu Masuk</span>
            <span class="value">${transaksi?.waktu_masuk ? new Date(transaksi.waktu_masuk).toLocaleString("id-ID") : "-"}</span>
          </div>
          <div class="row">
            <span class="label">Waktu Keluar</span>
            <span class="value">${transaksi?.waktu_keluar ? new Date(transaksi.waktu_keluar).toLocaleString("id-ID") : "-"}</span>
          </div>
          <div class="row">
            <span class="label">Durasi</span>
            <span class="value">${(() => { const m = transaksi?.durasi_jam || 0; const j = Math.floor(m / 60); const s = m % 60; if (j === 0) return s + ' Menit'; if (s === 0) return j + ' Jam'; return j + ' Jam ' + s + ' Menit'; })()}</span>
          </div>
          <div class="row">
            <span class="label">Tarif/Jam</span>
            <span class="value">Rp ${Number(transaksi?.tarif?.tarif_per_jam || 0).toLocaleString("id-ID")}</span>
          </div>

          <div class="total">
            TOTAL: Rp ${Number(transaksi?.biaya_total || 0).toLocaleString("id-ID")}
          </div>

          <div class="row">
            <span class="label">Petugas</span>
            <span class="value">${transaksi?.user?.nama_lengkap || "-"}</span>
          </div>

          <div class="footer">
            <p>Terima kasih telah menggunakan layanan parkir kami.</p>
            <p>Struk ini merupakan bukti pembayaran yang sah.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!transaksi) return null;

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent className="sm:max-w-md">
        <ModalHeader>
          <ModalTitle>Struk Parkir</ModalTitle>
          <ModalDescription>
            Preview struk parkir sebelum dicetak.
          </ModalDescription>
        </ModalHeader>

        <div ref={printRef} className="p-4 space-y-3">
          <div className="text-center border-b-2 border-dashed border-gray-300 pb-3">
            <h2 className="text-lg font-bold text-[#1e6091]">
              STRUK PARKIR
            </h2>
            <p className="text-xs text-gray-500">Sistem Manajemen Parkir</p>
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
              <span className="font-medium">{formatDurasi(transaksi.durasi_jam)}</span>
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
            <span className="font-medium">
              {transaksi.user?.nama_lengkap}
            </span>
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
            onClick={handlePrint}
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
