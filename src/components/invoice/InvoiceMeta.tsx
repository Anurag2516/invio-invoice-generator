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
      <SectionHeader label="Invoice Header" />
      <div className="grid grid-cols-2 gap-6 ">
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
              <label className="text-xs font-semibold uppercase tracking-wide text-stone-600">
                Status
              </label>
              <Select onValueChange={field.onChange} defaultValue={field.value} >
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
      <div className="grid grid-cols-3 gap-5 mb-5">
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
              <label className="text-xs font-semibold uppercase tracking-wide text-stone-600">
                Currency
              </label>
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
