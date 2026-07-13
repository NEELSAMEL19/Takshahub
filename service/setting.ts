import {
  GetProfileResponse,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "@/types/setting";
import { apiClient } from "./client";
import { API_ENDPOINTS } from "./routes";

export const profileApi = {
  // -------------------------------- PROFILE ---------------------------------------

  GetProfile: () =>
    apiClient
      .get<GetProfileResponse>(API_ENDPOINTS.Setting.GETPROFILE)
      .then((res) => res.data),

  UpdateProfile: (data: UpdateProfilePayload) =>
    apiClient
      .put<UpdateProfileResponse>(API_ENDPOINTS.Setting.EDITPROFILE, data)
      .then((res) => res.data),
};
