import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query"
import { useQuery } from "@tanstack/react-query"
import { GetStatResponse } from "../types"
import { axios } from "@/lib/axios"

export const getStat = async (name: string): Promise<GetStatResponse> => {
  return axios.get("/stats/" + name)
}

type GetStatFnType = typeof getStat

type UseStatOptions = {
  config?: QueryConfig<GetStatFnType>
  name?: string
}

export const useStat = ({ config, name }: UseStatOptions) => {
  return useQuery<ExtractFnReturnType<GetStatFnType>>({
    ...config,
    enabled: !!name && name.length > 0,
    queryKey: ["stat", name],
    queryFn: () => getStat(name!),
  })
}