import { getUser, updateUser } from "@/api/user.api";
import { userKey } from "@/lib/queryKeys";
import { formDataToUserApiPayload } from "@/mapper/user.mapper";
import type { UserProfileFormValues } from "@/types/invoice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: userKey.userProfile,
    queryFn: getUser,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: UserProfileFormValues) =>
      updateUser(formDataToUserApiPayload(user)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKey.userProfile });
    },
    onError: (error: any) => {
      console.error(error.response?.data || "Something went wrong");
    },
  });
}
