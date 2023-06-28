import { axios } from "@/lib/axios";
import { UserResponse } from "../types";
import { DEMO } from "@/utils/env";
import { mockUserResponse } from "./_mock";

export type LoginCredentialsDTO = {
  email: string;
  password: string;
}

export const loginWithEmailAndPassword = async (data: LoginCredentialsDTO): Promise<UserResponse> => {
  if (DEMO) {
    return mockUserResponse;
  }
  return axios.post('/auth/login', data);
}