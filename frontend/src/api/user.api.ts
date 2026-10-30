import api from "@/lib/axios";
import type { UserProfileApiPayload, UserResponse } from "@/types/invoice";

export const getUser = async (): Promise<UserResponse> => {
  const res = await api.get("/api/user/getProfile");
  return res.data;
};

export const updateUser = async (user: UserProfileApiPayload): Promise<UserResponse> => {
  const res = await api.patch("/api/user/updateProfile", user);
  return res.data;
};
