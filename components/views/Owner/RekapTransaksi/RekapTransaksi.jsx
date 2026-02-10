"use client";

import { useCallback, useEffect } from "react";
import {
    ClipboardList,
    ArrowUpDown,
    CalendarDays,
    CarFront,
} from "lucide-react";
import DataTable from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useRekapTransaksi from "./useRekapTransaksi";

const COLUMNS = [
    { uid: "plat_nomor", name: "Kendaraan" },
    { uid: "area", name: "Area" },
    { uid: "petugas", name: "Petugas" },
    { uid: "waktu_masuk", name: "Masuk" },
    { uid: "waktu_keluar", name: "Keluar" },
    { uid: "durasi", name: "Durasi" },
    { uid: "biaya", name: "Biaya Total" },
    { uid: "status", name: "Status" },
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
        dateStyle: "short",
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

const RekapTransaksi = () => {
    const {
        currentPage,
        currentLimit,
        currentSort,
        currentStatus,
        currentStartDate,
        currentEndDate,
        searchInputValue,
        setURL,
        dataTransaksi,
        isLoadingTransaksi,
        isRefetchingTransaksi,
        handleChangePage,
        handleChangeLimit,
        handleSearch,
        handleClearSearch,
        handleChangeSort,
        handleChangeStatus,
        handleChangeStartDate,
        handleChangeEndDate,
    } = useRekapTransaksi();

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

    const renderCell = useCallback((item, columnKey) => {
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
                return <p className="text-gray-700">{item.area?.nama_area || "-"}</p>;

            case "petugas":
                return (
                    <p className="text-gray-700">{item.user?.nama_lengkap || "-"}</p>
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

            case "durasi":
                return (
                    <p className="text-gray-700">
                        {item.status === "keluar" ? `${item.durasi_jam} Jam` : "-"}
                    </p>
                );

            case "biaya":
                return (
                    <p className="font-medium text-gray-800">
                        {item.status === "keluar"
                            ? formatCurrency(item.biaya_total)
                            : "-"}
                    </p>
                );

            case "status":
                const config = STATUS_LABEL[item.status] || STATUS_LABEL.masuk;
                return <Badge className={config.color}>{config.label}</Badge>;

            default:
                return item[columnKey];
        }
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[#1e6091]">
                    Rekap Transaksi
                </h1>
                <p className="text-gray-500 mt-1">
                    Lihat rekap seluruh transaksi parkir
                </p>
            </div>

            {/* Sort, Filter & Date Range controls */}
            <div className="flex flex-wrap items-end gap-4">
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

                <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center gap-2">
                        <div>
                            <Label className="text-xs text-gray-500">Dari</Label>
                            <Input
                                type="date"
                                value={currentStartDate}
                                onChange={handleChangeStartDate}
                                className="h-9 w-40 bg-white border-gray-200"
                            />
                        </div>
                        <div>
                            <Label className="text-xs text-gray-500">Sampai</Label>
                            <Input
                                type="date"
                                value={currentEndDate}
                                onChange={handleChangeEndDate}
                                className="h-9 w-40 bg-white border-gray-200"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <DataTable
                title="Rekap Transaksi"
                icon={ClipboardList}
                /* No buttonLabel — Owner cannot create */
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
        </div>
    );
};

export default RekapTransaksi;
