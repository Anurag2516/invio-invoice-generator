import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";

interface DatePickerProps {
  label?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  error?: string;
  disabled?: boolean;
}

function DatePicker({
  label,
  value,
  onChange,
  error,
  disabled,
}: DatePickerProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wide text-stone-600">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
          type="button"
            disabled={disabled}
            className={`
              h-10.5 w-full rounded-lg border bg-white px-3.5
              text-sm shadow-sm outline-none
              transition-all duration-200 text-left flex items-center justify-between gap-3
              hover:border-stone-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/10
              disabled:cursor-not-allowed disabled:bg-stone-50 disabled:opacity-50
              ${value ? "text-stone-800" : "text-stone-400"}
              ${error ? "border-red-400 bg-red-50" : "border-stone-200"}
            `}
          >
            {value ? format(value, "PPP") : "Pick a date"}
            <CalendarIcon className="size-4 text-stone-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
          />
        </PopoverContent>
      </Popover>
      {error && <span className="text-[10px] text-red-500">{error}</span>}
    </div>
  );
}

export default DatePicker;
