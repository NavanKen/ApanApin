"use client";

import { useCallback, useEffect, useRef } from "react";
import {
    Receipt,
    LogIn,
    LogOut,
    Printer,
    ArrowUpDown,
    CarFront,
} from "lucide-react";
import DataTable from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useTransaksi from "./useTransaksi";
import AddTransaksiModal from "./AddTransaksiModal";
import CetakStrukModal from "./CetakStrukModal";
import transaksiService from "@/service/transaksi.service";

const COLUMNS = [
    { uid: "plat_nomor", name: "Kendaraan" },
    { uid: "area", name: "Area Parkir" },
    { uid: "waktu_masuk", name: "Waktu Masuk" },
    { uid: "waktu_keluar", name: "Waktu Keluar" },
    { uid: "biaya", name: "Biaya" },
    { uid: "status", name: "Status" },
    { uid: "actions", name: "Aksi" },
];

const STATUS_LABEL = {
    masuk: { label: "Masuk", color: "bg-blue-100 text-blue-700" },
    keluar: { label: "Keluar", color: "bg-green-100 text-green-700" },
};

const SORT_OPTIONS = [
    { value: "desc", label: "Terbaru" },
    { value: "asc", label: "Terlama" },
];

const STATUS_OPTIONS = [
    { value: "semua", label: "Semua Status" },
    { value: "masuk", label: "Kendaraan Masuk" },
    { value: "keluar", label: "Kendaraan Keluar" },
];

const formatDateTime = (dateStr) => {
    if (!dateStr) return "-";
    return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(dateStr));
};

const formatCurrency = (value) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value || 0);
};

const formatDurasi = (menit) => {
    if (!menit || menit <= 0) return "-";
    const jam = Math.floor(menit / 60);
    const sisaMenit = menit % 60;
    if (jam === 0) return `${sisaMenit} Menit`;
    if (sisaMenit === 0) return `${jam} Jam`;
    return `${jam} Jam ${sisaMenit} Menit`;
};

const Transaksi = () => {
    const {
        currentPage,
        currentLimit,
        currentSort,
        currentStatus,
        searchInputValue,
        setURL,
        dataTransaksi,
        isLoadingTransaksi,
        isRefetchingTransaksi,
        refetchTransaksi,
        handleChangePage,
        handleChangeLimit,
        handleSearch,
        handleClearSearch,
        handleChangeSort,
        handleChangeStatus,
    } = useTransaksi();

    const addModalRef = useRef(null);
    const cetakStrukRef = useRef(null);

    useEffect(() => {
        setURL();
    }, [setURL]);

    const transaksi = dataTransaksi?.data || [];
    const pagination = dataTransaksi?.pagination || {
        page: currentPage,
        limit: parseInt(currentLimit),
        total: 0,
        totalPages: 1,
    };

    const { mutate: keluarkan, isPending: isProcessingKeluar } = useMutation({
        mutationFn: async (id) => {
            const res = await transaksiService.updateTransaksiKeluar(id);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Kendaraan berhasil dikeluarkan");
            refetchTransaksi();
        },
        onError: (error) => {
            const message =
                error.response?.data?.error || "Gagal mengeluarkan kendaraan";
            toast.error(message);
        },
    });

    const renderCell = useCallback(
        (item, columnKey) => {
            switch (columnKey) {
                case "plat_nomor":
                    return (
                        <div className="flex items-center gap-3">
                            <div
                                className={`
                w-9 h-9 rounded-full
                flex items-center justify-center
                text-sm font-medium text-white
                bg-linear-to-br from-[#1e6091] to-[#2980b9]
              `}
                            >
                                <CarFront className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">
                                    {item.kendaraan?.plat_nomor}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {item.kendaraan?.pemilik} —{" "}
                                    <span className="capitalize">
                                        {item.kendaraan?.jenis_kendaraan}
                                    </span>
                                </p>
                            </div>
                        </div>
                    );

                case "area":
                    return (
                        <p className="text-gray-700">{item.area?.nama_area || "-"}</p>
                    );

                case "waktu_masuk":
                    return (
                        <p className="text-gray-700 text-sm">
                            {formatDateTime(item.waktu_masuk)}
                        </p>
                    );

                case "waktu_keluar":
                    return (
                        <p className="text-gray-700 text-sm">
                            {item.waktu_keluar ? formatDateTime(item.waktu_keluar) : "-"}
                        </p>
                    );

                case "biaya":
                    return (
                        <div>
                            <p className="font-medium text-gray-800">
                                {item.status === "keluar"
                                    ? formatCurrency(item.biaya_total)
                                    : "-"}
                            </p>
                            {item.status === "keluar" && (
                                <p className="text-xs text-gray-400">
                                    {formatDurasi(item.durasi_jam)} ×{" "}
                                    {formatCurrency(item.tarif?.tarif_per_jam)}/jam
                                </p>
                            )}
                        </div>
                    );

                case "status":
                    const config = STATUS_LABEL[item.status] || STATUS_LABEL.masuk;
                    return <Badge className={config.color}>{config.label}</Badge>;

                case "actions":
                    return (
                        <div className="flex items-center gap-1">
                            {item.status === "masuk" && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    disabled={isProcessingKeluar}
                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                    onClick={() => keluarkan(item.id_parkir)}
                                >
                                    <LogOut className="w-4 h-4 mr-1" />
                                    Keluar
                                </Button>
                            )}
                            {item.status === "keluar" && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[#1e6091] hover:text-[#1a5276] hover:bg-blue-50"
                                    onClick={() => cetakStrukRef.current?.open(item)}
                                >
                                    <Printer className="w-4 h-4 mr-1" />
                                    Struk
                                </Button>
                            )}
                        </div>
                    );

                default:
                    return item[columnKey];
            }
        },
        [isProcessingKeluar, keluarkan],
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#1e6091]">
                    Transaksi Parkir
                </h1>
                <p className="text-gray-500 mt-1">Kelola transaksi parkir kendaraan</p>
            </div>

            {/* Sort & Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    <Select value={currentSort} onValueChange={handleChangeSort}>
                        <SelectTrigger className="w-32 h-9 bg-white border-gray-200">
                            <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent>
                            {SORT_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Select
                    value={currentStatus || "semua"}
                    onValueChange={handleChangeStatus}
                >
                    <SelectTrigger className="w-44 h-9 bg-white border-gray-200">
                        <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <DataTable
                title="Daftar Transaksi"
                icon={Receipt}
                buttonLabel="Transaksi Masuk"
                onClickButton={() => addModalRef.current?.open()}
                searchValue={searchInputValue}
                searchPlaceholder="Cari plat nomor, pemilik, area..."
                onSearchChange={handleSearch}
                onClearSearch={handleClearSearch}
                columns={COLUMNS}
                data={transaksi}
                renderCell={renderCell}
                emptyContent="Tidak ada transaksi ditemukan"
                isLoading={isLoadingTransaksi || isRefetchingTransaksi}
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                limit={currentLimit}
                onLimitChange={handleChangeLimit}
                onPageChange={handleChangePage}
            />

            <AddTransaksiModal ref={addModalRef} onSuccess={refetchTransaksi} />
            <CetakStrukModal ref={cetakStrukRef} />
        </div>
    );
};

export default Transaksi;
