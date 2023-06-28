import { axios } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query"
import { checkNameUniquenessStub } from "./_mock";
import { DEMO } from "@/utils/env";
import { GetNameUniquenessResponse, SL } from "../types";
import { MutationConfig, QueryConfig, queryClient } from "@/lib/react-query";


const checkNameUniqueness = async (name?: string): Promise<GetNameUniquenessResponse> => {
  if (!name) return { available: false };
  if (DEMO) {
    return checkNameUniquenessStub(name);
  }
  const response = await axios.get('/sl/check/' + name) as any;
  return response;
}

type QueryFnType = typeof checkNameUniqueness;

type UseUniqueNameOptions = {
  config?: QueryConfig<QueryFnType>;
  name?: string;
};

export const useUniqueNameQuery = ({ config, name }: UseUniqueNameOptions) =>{
  return useQuery(
    ["uniqueName", name],
    () => checkNameUniqueness(name),
    {
      enabled: !!name && name.length > 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  )
}

export type CreateSlDTO = {
  name: string;
  url: string;
}

const createSL = async ({ name, url }: CreateSlDTO): Promise<SL> => {
  const response = await axios.post('/sl', { name, url }) as any;
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