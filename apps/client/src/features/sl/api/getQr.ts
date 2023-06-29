import { axios } from "@/lib/axios"
import { MutationConfig, queryClient } from "@/lib/react-query"
import { useMutation } from "@tanstack/react-query"
import { SL } from "../types"

const getQr = async (name: string): Promise<SL> => {
  const response = await axios.get('/sl/qr/' + name) as any
  return response.sl
}

type UseQrOptions = {
  config?: MutationConfig<typeof getQr>,
  name?: string
}

export const useQr = ({ config, name }: UseQrOptions) => {
  return useMutation(
    () => getQr(name!),
    {
      onSuccess: () => {
        //@ts-ignore
        queryClient.invalidateQueries(['sl', name]);
      },
      ...config
    })
}