import { axios } from "@/lib/axios";
import { GetSLResponse, GetSLsResponse } from "../types";
import { useQuery } from "@tanstack/react-query";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getSLs = async (page = 1): Promise<GetSLsResponse> => {
  return axios.get('/sl?page=' + page);
}

export const getSL = async (name: string): Promise<GetSLResponse> => {
  return axios.get('/sl/' + name);
}

type GetSLsQueryFnType = typeof getSLs;
type GetSLQueryFnType = typeof getSL;

type UseSLsOptions = {
  config?: QueryConfig<GetSLsQueryFnType>;
  page?: number;
};

export const useSLs = ({ config, page = 1 }: UseSLsOptions = {}) => {
  return useQuery<ExtractFnReturnType<GetSLsQueryFnType>>({
    ...config,
    queryKey: ['sls', page],
    queryFn: () => getSLs(page),
    keepPreviousData: true
  });
};

type UseSLOptions = {
  config?: QueryConfig<GetSLQueryFnType>;
  name?: string;
}

export const useSL = ({ config, name }: UseSLOptions) => {
  return useQuery<ExtractFnReturnType<GetSLQueryFnType>>({
    ...config,
    enabled: !!name && name.length > 0,
    queryKey: ['sl', name],
    queryFn: () => getSL(name!)
  });
};
