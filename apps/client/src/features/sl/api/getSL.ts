import { axios } from "@/lib/axios";
import { GetSLsResponse } from "../types";
import { useQuery } from "@tanstack/react-query";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

export const getSLs = async (page = 1): Promise<GetSLsResponse> => {
  return axios.get('/sl?page=' + page);
}

type QueryFnType = typeof getSLs;

type UsePostsOptions = {
  config?: QueryConfig<QueryFnType>;
  page?: number;
};

export const useSLs = ({ config, page = 1 }: UsePostsOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ['sls', page],
    queryFn: () => getSLs(page),
    keepPreviousData: true
  });
};