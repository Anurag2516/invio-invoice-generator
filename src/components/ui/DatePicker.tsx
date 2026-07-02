import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
    <div className="flex flex-col">
      {label && (
        <label className="pb-1 text-sm font-semibold uppercase tracking-wide text-stone">
          {label}
        </label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={`
              h-11 w-full sm:w-56 rounded-lg border bg-background dark:bg-input/30 px-3.5 py-2
              text-sm shadow-sm outline-none transition-[color, box-shadow] duration-150 ease-in-out text-left flex items-center justify-between gap-3 hover:border-ring/90 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50
              ${value ? "text-foreground" : "text-muted-foreground/80"}
              ${
                error
                  ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
                  : "border-input"
              }
            `}
          >
            {value ? format(value, "PPP") : "Pick a date"}
            <CalendarIcon className="size-4 text-stone-400" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={value} onSelect={onChange} />
        </PopoverContent>
      </Popover>
      {error && <span className="text-[10px] text-red-500">{error}</span>}
    </div>
  );
}

export default DatePicker;
