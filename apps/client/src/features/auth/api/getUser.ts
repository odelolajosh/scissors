import { axios } from "@/lib/axios";
import { User } from "../types";
import { DEMO } from "@/utils/env";
import { mockUser } from "./_mock";

export const getUser = async (): Promise<{ user: User }> => {
  if (DEMO) {
    return { user: mockUser };
  }
  return axios.get('/me');
}