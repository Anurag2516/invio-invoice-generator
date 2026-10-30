import type { UserProfileFormValues, UserResponse } from "@/types/invoice";
import { useForm } from "react-hook-form";
import { useUpdateUser } from "./useUser";
import userProfileSchema from "@/schema/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userResponseToFormData,
} from "@/mapper/user.mapper";

export const useProfileForm = (user: UserResponse) => {
  const { mutate: updateUser, isPending, isSuccess } = useUpdateUser();

  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: userResponseToFormData(user),
  });

  const onSubmit = form.handleSubmit((values) => {
    updateUser(values, {
      onSuccess: (data) => form.reset(userResponseToFormData(data)),
    });
  });

  return { form, onSubmit, isPending, isSuccess };
};
