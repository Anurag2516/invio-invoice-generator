import type { InvoiceFormProps } from "../../types/invoice";
import Input from "../ui/Input";
import { statusOptions } from "../../constants/statusOptions";
import { currencyOptions } from "../../constants/currencies";
import SectionHeader from "../ui/SectionHeader";
import {
  Select,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { Controller } from "react-hook-form";
import DatePicker from "../ui/DatePicker";
import { format } from "date-fns";

const InvoiceMeta = ({ register, control, errors }: InvoiceFormProps) => {
  return (
    <div className="flex flex-col gap-6 justify-between items-start pt-8 border-b border-stone/40">
      <div className="flex items-center gap-3 w-full">
        <SectionHeader label="Invoice Header" />
        <div className="flex-1 h-px bg-stone/50" />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-start gap-6 w-full">
        <div className="w-auto">
          <Input
            {...register("invoiceNumber")}
            label="Invoice Number"
            placeholder="INV-0001"
            error={errors.invoiceNumber?.message}
          />
        </div>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 w-auto">
              <label className="text-sm font-semibold uppercase tracking-wide text-stone">
                Status
              </label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1.5 w-auto">
              <label className="text-sm font-semibold uppercase tracking-wide text-stone">
                Currency
              </label>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full sm:w-auto">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Currency</SelectLabel>
                    {currencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-5 mb-8 w-full">
        <Controller
          name="issueDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Issue Date"
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) =>
                field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)
              }
              error={errors.issueDate?.message}
            />
          )}
        />

        <Controller
          name="dueDate"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Due Date"
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) =>
                field.onChange(date ? format(date, "yyyy-MM-dd") : undefined)
              }
              error={errors.dueDate?.message}
            />
          )}
        />
      </div>
    </div>
  );
};

export default InvoiceMeta;
