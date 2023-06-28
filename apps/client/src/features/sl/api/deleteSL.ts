import { axios } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query"
import { MutationConfig, queryClient } from "@/lib/react-query";

export type DeleteSlDTO = {
  sid: string;
}

const deleteSL = async ({ sid }: DeleteSlDTO) => {
  await axios.delete('/sl/' + sid) as any;
}

type useDeleteSLOptions = {
  config?: MutationConfig<typeof deleteSL>;
}

export const useDeleteSL = ({ config }: useDeleteSLOptions = {}) => {
  return useMutation({
    onSuccess: () => {
      //@ts-ignore
      queryClient.invalidateQueries('sls');
    },
    ...config,
    mutationFn: (dto: DeleteSlDTO) => deleteSL(dto)
  })
}