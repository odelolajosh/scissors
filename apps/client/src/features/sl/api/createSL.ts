import { axios } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query"
import { checkNameUniquenessStub } from "./_mock";
import { DEMO } from "@/utils/env";
import { GetNameUniquenessResponse, SL } from "../types";
import { ExtractFnReturnType, MutationConfig, QueryConfig, queryClient } from "@/lib/react-query";


const checkNameUniqueness = async (name?: string): Promise<GetNameUniquenessResponse> => {
  if (!name) return { available: false };
  if (DEMO) {
    return checkNameUniquenessStub(name);
  }
  const response = await axios.get('/sl/check/' + name) as any;
  return response;
}

type CheckNameQueryFnType = typeof checkNameUniqueness;

type UseUniqueNameOptions = {
  config?: QueryConfig<CheckNameQueryFnType>;
  name?: string;
};

export const useUniqueNameQuery = ({ config, name }: UseUniqueNameOptions) =>{
  return useQuery<ExtractFnReturnType<CheckNameQueryFnType>>({
    ...config,
    enabled: !!name && name.length > 0,
    queryKey: ["uniqueName", name],
    queryFn: () => checkNameUniqueness(name)
  })
}

export type CreateSlDTO = {
  name?: string;
  url: string;
  customDomain?: string;
}

const createSL = async ({ name, url, customDomain }: CreateSlDTO): Promise<SL> => {
  const response = await axios.post('/sl', { name, url, customDomain }) as any;
  return response.sl;
}

type UseCreateSLOptions = {
  config?: MutationConfig<typeof createSL>;
}

export const useCreateSL = ({ config }: UseCreateSLOptions = {}) => {
  return useMutation({
    onSuccess: () => {
      //@ts-ignore
      queryClient.invalidateQueries('sls');
    },
    ...config,
    mutationFn: createSL
  })
}