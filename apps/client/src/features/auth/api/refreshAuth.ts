import { axios } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { mockRefreshAuthResponse } from "./_mock";
import { DEMO } from "@/utils/env";

export type RefreshAuthDTO = {
  refresh: string
}

export const refreshAuth = async (data: RefreshAuthDTO): Promise<AxiosResponse<{ access: string, refresh: string }>> => {
  if (DEMO) {
    return {
      data: mockRefreshAuthResponse
    } as any
  }
  return axios.post('/auth/refresh', data);
}