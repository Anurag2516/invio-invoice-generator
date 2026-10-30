import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { InvoiceFormValues } from "@/types/invoice";
import { User } from "lucide-react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

type FormData = {
  senderName: string;
  senderEmail: string;
  senderCompany: string;
  senderAddress: string;
  senderPhone: string;
  senderWebsite: string;
};

interface SenderCardProps {
  senderName: string;
  senderEmail: string;
  senderCompany: string;
  senderAddress: string;
  senderPhone: string;
  senderWebsite: string;
  formData: FormData;
  handleOnChange: (field: string, value: string) => void;
  handleSubmit: () => void;
  handleCancel: ()=> void
}

interface EditModalProps {
  formData: FormData;
  handleOnChange: (field: string, value: string) => void;
  handleSubmit: () => void;
  handleCancel: ()=> void
}

const SenderCard = ({
  senderName,
  senderEmail,
  senderCompany,
  senderAddress,
  senderPhone,
  senderWebsite,
  formData,
  handleOnChange,
  handleSubmit,
  handleCancel
}: SenderCardProps) => {
  return (
    <div className="w-full max-w-md]">
      <SectionHeader label="Bill From" subLabel="(Sender Details)" />

      <div className="rounded-md border border-border bg-foreground/3 mt-4 p-3 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-7 rounded-full bg-teal/15 flex items-center justify-center shrink-0">
              <User className="size-3.5 text-teal" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold text-foreground truncate">
                {senderName}
              </p>
              {senderEmail && (
                <p className="text-sm text-foreground/50 truncate">
                  {senderEmail}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-center items-center gap-1 shrink-0">
            <UserEditModal
              formData={formData}
              handleOnChange={handleOnChange}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
            />
          </div>
        </div>

        {(senderCompany || senderAddress || senderPhone || senderWebsite) && (
          <div className="pl-9 flex flex-col space-y-[0.5px] text-sm">
            {senderCompany && (
              <p className=" text-foreground/60">{senderCompany}</p>
            )}
            {senderAddress && (
              <p className="text-foreground/60">{senderAddress}</p>
            )}
            {senderPhone && (
              <p className=" text-foreground/60 pt-1.5">{senderPhone}</p>
            )}
            {senderWebsite && (
              <p className=" text-foreground/60">{senderWebsite}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const UserEditModal = ({
  formData,
  handleOnChange,
  handleSubmit,
  handleCancel
}: EditModalProps) => {
  return (
    <Dialog>
      <DialogTrigger className="text-sm">Edit</DialogTrigger>
      <DialogContent className="md:max-w-107.5">
        <DialogHeader>
          <DialogTitle>Edit sender details</DialogTitle>
          <DialogDescription>
            Edit sender details for this invoice
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between gap-2">
          <div className="w-full">
            <h3 className="text-sm font-semibold tracking-wider text-foreground/95 pb-1">
              Name *
            </h3>
            <Input
              type="text"
              value={formData.senderName}
              onChange={(e) => handleOnChange("senderName", e.target.value)}
              placeholder="John Doe"
              className="h-10"
            />
          </div>
          <div className="w-full">
            <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
              Email
            </h3>
            <Input
              type="text"
              value={formData.senderEmail}
              onChange={(e) => handleOnChange("senderEmail", e.target.value)}
              placeholder="johndoe@gmail.com"
              className="h-10"
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
            Company Name
          </h3>
          <Input
            type="text"
            value={formData.senderCompany}
            onChange={(e) => handleOnChange("senderCompany", e.target.value)}
            placeholder="Abc Industries"
            className="h-10"
          />
        </div>
        <div>
          <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
            Address
          </h3>
          <Input
            type="text"
            value={formData.senderAddress}
            onChange={(e) => handleOnChange("senderAddress", e.target.value)}
            placeholder="New York City, New York"
            className="h-10"
          />
        </div>
        <div className="flex justify-between gap-2">
          <div className="w-full">
            <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
              Phone
            </h3>
            <Input
              type="text"
              value={formData.senderPhone}
              onChange={(e) => handleOnChange("senderPhone", e.target.value)}
              placeholder="+91 9587564459"
              className="h-10"
            />
          </div>
          <div className="w-full">
            <h3 className="text-sm font-semibold  tracking-wider text-foreground pb-1">
              Website
            </h3>
            <Input
              type="text"
              value={formData.senderWebsite}
              onChange={(e) => handleOnChange("senderWebsite", e.target.value)}
              placeholder="abcindustries.com"
              className="h-10"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button onClick={handleCancel} type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose>
            <Button
              onClick={handleSubmit}
              type="button"
              className="bg-teal text-white font-medium tracking-wide hover:bg-teal-dark"
            >
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SenderSection = () => {
  const { setValue, getValues ,watch } = useFormContext<InvoiceFormValues>();

  const [
    senderName,
    senderEmail,
    senderCompany,
    senderAddress,
    senderPhone,
    senderWebsite,
  ] = watch([
    "senderName",
    "senderEmail",
    "senderCompany",
    "senderAddress",
    "senderPhone",
    "senderWebsite",
  ]);

  const [form, setForm] = useState({
    senderName: senderName,
    senderEmail: senderEmail,
    senderCompany: senderCompany,
    senderAddress: senderAddress,
    senderPhone: senderPhone,
    senderWebsite: senderWebsite,
  });

  const handleOnChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setValue("senderName", form.senderName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("senderEmail", form.senderEmail, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("senderCompany", form.senderCompany, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("senderAddress", form.senderAddress, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("senderPhone", form.senderPhone, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("senderWebsite", form.senderWebsite, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleCancel = () => {
    const current = getValues()
    setForm({
      senderName: current.senderName,
      senderEmail: current.senderEmail,
      senderCompany: current.senderCompany,
      senderAddress: current.senderAddress,
      senderPhone: current.senderPhone,
      senderWebsite: current.senderWebsite,
    });
  };

  return (
    <SenderCard
      senderName={senderName}
      senderEmail={senderEmail}
      senderCompany={senderCompany}
      senderAddress={senderAddress}
      senderPhone={senderPhone}
      senderWebsite={senderWebsite}
      formData={form}
      handleOnChange={handleOnChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
    />
  );
};

export default SenderSection;
