import type {
  UserProfileApiPayload,
  UserProfileFormValues,
  UserResponse,
} from "@/types/invoice";

const optStr = (val?: string | null): string | null => val?.trim() || null;

const normalizeUrl = (val?: string | null): string | null => {
  const s = val?.trim();
  if (!s) return null;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
};

export const formDataToUserApiPayload = (
  form: UserProfileFormValues,
): UserProfileApiPayload => ({
  name: form.name.trim(),
  companyName: optStr(form.companyName),
  address: optStr(form.address),
  phone: optStr(form.phone),
  website: normalizeUrl(form.website),
  bankName: optStr(form.bankName),
  accountHolderName: optStr(form.accountHolderName),
  accountNumber: optStr(form.accountNumber),
});

export const userResponseToFormData = (
  user: UserResponse,
): UserProfileFormValues => ({
  name: user.name,
  email: user.email,
  companyName: user.companyName ?? "",
  address: user.address ?? "",
  phone: user.phone ?? "",
  website: user.website ?? "",
  accountHolderName: user.accountHolderName ?? "",
  bankName: user.bankName ?? "",
  accountNumber: user.accountNumber ?? "",
});
