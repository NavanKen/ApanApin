"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DatePicker = React.forwardRef(
  (
    {
      value,
      onChange,
      placeholder = "Pilih tanggal",
      disabled = false,
      className,
      error,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const dateValue = React.useMemo(() => {
      if (!value) return undefined;
      // If value is YYYY-MM-DD format, parse as local date
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
      }
      const date = new Date(value);
      return isNaN(date.getTime()) ? undefined : date;
    }, [value]);

    const handleSelect = (date) => {
      if (date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const localDateString = `${year}-${month}-${day}`;
        onChange?.(localDateString);
      } else {
        onChange?.("");
      }
      setOpen(false);
    };

    const displayValue = React.useMemo(() => {
      if (!dateValue) return null;
      return format(dateValue, "dd MMMM yyyy", { locale: id });
    }, [dateValue]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !displayValue && "text-muted-foreground",
              error && "border-red-500 focus-visible:ring-red-500",
              className,
            )}
            {...props}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayValue || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            defaultMonth={dateValue}
            onSelect={handleSelect}
            captionLayout="dropdown"
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  },
);

DatePicker.displayName = "DatePicker";

export { DatePicker };
