import { User, Building2, CreditCard } from "lucide-react";
import Input from "@/components/ui/Input";
import type { UserResponse } from "@/types/invoice";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/hooks/useUser";
import { useProfileForm } from "@/hooks/useProfileForm";
import { FormProvider } from "react-hook-form";
import UserProfileSkeleton from "@/components/ui/skeleton/UserProfileSkeleton";
import { useState, type Dispatch, type SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { ScrollArea } from "../../ui/scroll-area";

interface ProfileFormLoaderProps {
  profileModal: boolean;
  setProfileModal: Dispatch<SetStateAction<boolean>>;
}

interface ProfileFormProps extends ProfileFormLoaderProps {
  profile: UserResponse;
}

interface SectionCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

const SectionCard = ({ icon: Icon, title, children }: SectionCardProps) => (
  <div className="border border-border rounded-lg bg-background overflow-hidden my-3">
    <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
      <div className="size-7 rounded-md bg-teal/10 flex items-center justify-center shrink-0">
        <Icon className="size-3.5 text-teal" />
      </div>
      <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
        {title}
      </h2>
    </div>
    <div className="px-5 py-5">{children}</div>
  </div>
);

const ProfileFormLoader = ({
  profileModal,
  setProfileModal,
}: ProfileFormLoaderProps) => {
  const { data: profile, isLoading } = useUser();

  return (
    <Dialog
      open={profileModal}
      onOpenChange={(open) => {
        if (!open) setProfileModal(false);
      }}
    >
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="w-full max-w-2xl sm:max-w-2xl md:max-w-3xl p-0 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {isLoading || !profile ? (
          <div className="px-6 py-8 overflow-y-auto">
            <UserProfileSkeleton />
          </div>
        ) : (
          <ProfileFormContent
            profile={profile}
            profileModal={profileModal}
            setProfileModal={setProfileModal}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

const ProfileFormContent = ({ profile, setProfileModal }: ProfileFormProps) => {
  const { form, onSubmit, isPending } = useProfileForm(profile);
  const [showDiscardDialog, setShowDiscardDialog] = useState<boolean>(false);
  const {
    register,
    formState: { isDirty, errors },
  } = form;

  const handleClose = () => {
    if (isDirty) {
      setShowDiscardDialog(true);
    } else {
      setProfileModal(false);
    }
  };

  return (
    <>
      <FormProvider {...form}>
        <form onSubmit={onSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="px-6 pt-6 pb-4 border-b border-border shrink-0">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground">
                Profile
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="text-sm text-foreground/60 mt-0.5">
              These details pre-fill your invoices. Changes apply to new
              invoices only.
            </DialogDescription>
          </div>

          <ScrollArea className="flex flex-col gap-5 overflow-y-auto px-5">
            <SectionCard icon={User} title="Personal Info">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Full Name"
                  {...register("name")}
                  error={errors.name?.message}
                  placeholder="John Doe"
                />
                <Input
                  type="text"
                  label="Email"
                  {...register("email")}
                  disabled
                  placeholder="john@example.com"
                />
                <Input
                  type="text"
                  label="Phone"
                  {...register("phone")}
                  error={errors.phone?.message}
                  placeholder="+91 98765 43210"
                />
                <Input
                  type="text"
                  label="Website"
                  {...register("website")}
                  error={errors.website?.message}
                  placeholder="example.com"
                />
              </div>
            </SectionCard>

            <SectionCard icon={Building2} title="Business Info">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Company Name"
                  {...register("companyName")}
                  error={errors.companyName?.message}
                  placeholder="Acme Corp"
                />
                <Input
                  type="text"
                  label="Address"
                  {...register("address")}
                  error={errors.address?.message}
                  placeholder="New York City, New York"
                />
              </div>
            </SectionCard>

            <SectionCard icon={CreditCard} title="Payment Info">
              <p className="text-sm text-foreground/60 mb-4">
                Shown on invoices as default payment details.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  label="Bank Name"
                  {...register("bankName")}
                  error={errors.bankName?.message}
                  placeholder="HDFC Bank"
                />
                <Input
                  type="text"
                  label="Account Holder Name"
                  {...register("accountHolderName")}
                  error={errors.accountHolderName?.message}
                  placeholder="John Doe"
                />
                <div className="sm:col-span-2">
                  <Input
                    type="text"
                    label="Account Number"
                    {...register("accountNumber")}
                    error={errors.accountNumber?.message}
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>
              </div>
            </SectionCard>
          </ScrollArea>

          {isDirty && (
            <div className="shrink-0 border-t border-border px-6 py-3 flex items-center justify-between gap-3 bg-background">
              <span className="text-sm text-foreground/60">
                Unsaved changes
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    form.reset();
                    setProfileModal(false);
                  }}
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="text-white bg-teal hover:bg-teal-dark"
                >
                  {isPending ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </FormProvider>
    </>
  );
};

export default ProfileFormLoader;
