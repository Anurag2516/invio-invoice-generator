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
    <div className="flex flex-col gap-6 justify-between items-start border-b border-stone-300">
      <div className="flex items-center gap-3 w-full">
        <SectionHeader label="Invoice Header" />
        <div className="flex-1 h-[1.6px] bg-stone" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          {...register("invoiceNumber")}
          label="Invoice Number"
          placeholder="INV-0001"
          error={errors.invoiceNumber?.message}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone">
                Status
              </h2>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
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
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5 w-full">
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

        <Controller
          name="currency"
          control={control}
          render={({ field }) => (
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone">
                Currency
              </h2>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
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
    </div>
  );
};

export default InvoiceMeta;
