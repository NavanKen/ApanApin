"use client";

import { useMemo } from "react";
import { Search, X, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LIMIT_OPTIONS = [
  { value: "8", label: "8" },
  { value: "12", label: "12" },
  { value: "16", label: "16" },
];

const DataTable = ({
  // Header
  title,
  icon: Icon,
  buttonLabel,
  onClickButton,
  // Search & Filter
  searchValue = "",
  searchPlaceholder = "Cari nama, email, atau role...",
  onSearchChange,
  onClearSearch,
  // Filter
  filterLabel,
  filterOptions = [],
  filterValue,
  onFilterChange,
  // Table
  columns = [],
  data = [],
  renderCell,
  emptyContent = "Data tidak ditemukan",
  isLoading = false,
  // Pagination
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  limit = "8",
  onLimitChange,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * parseInt(limit) + 1;
  const endItem = Math.min(currentPage * parseInt(limit), totalItems);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  }, [currentPage, totalPages]);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            {Icon && <Icon className="w-5 h-5 text-[#1e6091]" />}
            {title}
          </CardTitle>
          {buttonLabel && (
            <Button
              onClick={onClickButton}
              className="bg-linear-to-r from-[#1e6091] to-[#2980b9] hover:from-[#1a5276] hover:to-[#1e6091] text-white shadow-md"
            >
              + {buttonLabel}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              value={searchValue}
              onChange={onSearchChange}
              placeholder={searchPlaceholder}
              className="pl-9 pr-9 h-10 bg-gray-50 border-gray-200 focus:border-[#1e6091] focus:ring-[#1e6091]/20 rounded-lg"
            />
            {searchValue && (
              <button
                onClick={onClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {filterOptions.length > 0 && (
              <Select value={filterValue} onValueChange={onFilterChange}>
                <SelectTrigger className="w-full h-10 bg-white border-gray-200">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <SelectValue placeholder={filterLabel || "Filter"} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:inline">
                Tampilkan:
              </span>
              <Select value={limit} onValueChange={onLimitChange}>
                <SelectTrigger className="w-20 h-10 bg-white border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LIMIT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500 hidden sm:inline">
                entri
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead
                    key={column.uid}
                    className="text-gray-700 font-semibold text-sm h-12 border-0"
                  >
                    {column.name}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center border-0"
                  >
                    <div className="flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-[#1e6091] border-t-transparent rounded-full animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow className="border-0">
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-gray-500 border-0"
                  >
                    {emptyContent}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow
                    key={item.id || index}
                    className="border-b border-gray-100 hover:bg-gray-50/50 last:border-0"
                  >
                    {columns.map((column) => (
                      <TableCell key={column.uid} className="py-4 border-0">
                        {renderCell
                          ? renderCell(item, column.uid)
                          : item[column.uid]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 mt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Menampilkan {startItem} sampai {endItem} dari {totalItems} entri
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {pageNumbers.map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="icon"
                    onClick={() => onPageChange(page)}
                    className={cn(
                      "w-8 h-8",
                      currentPage === page
                        ? "bg-linear-to-r from-[#1e6091] to-[#2980b9] text-white hover:from-[#1a5276] hover:to-[#1e6091]"
                        : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    {page}
                  </Button>
                ),
              )}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable;
