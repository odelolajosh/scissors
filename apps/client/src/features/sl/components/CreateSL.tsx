import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input"
import useForm from "@/hooks/useForm"
import { useCreateSL, useUniqueNameQuery } from "../api";

const useCheckURL = (url: string) => {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (!url) return
    try {
      new URL(url)
      setData({ valid: true })
    } catch (error) {
      setData({ valid: false })
    }
  }, [url])

  return { data }
}


type CreateSLParams = {
  name: string;
  url: string;
}

type CreateSLProps = {
  onClose: () => void;
}

export const CreateSL: React.FC<CreateSLProps> = ({ onClose }) => {
  const { values, onChange } = useForm<CreateSLParams>()
  const uniqueNameQuery = useUniqueNameQuery({ name: values.name })
  const { data: urlQuery } = useCheckURL(values.url)
  const createSL = useCreateSL();

  const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!values.name || !values.url) return
    if (!uniqueNameQuery.data?.available) return
    if (!urlQuery?.valid) return
    await createSL.mutateAsync(values)
    onClose()
  }

  // replace spaces with dashes
  const onKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault()
    }
  }

  return (
    <div className="px-6 py-4 mb-6">
      <h2 className="text-3xl font-semibold">Create SL</h2>
      <form className="mt-4 flex flex-col gap-6" onSubmit={onCreate}>
        <div>
          <Input label="Unique name" placeholder="My SL" name="name" value={values.name || ""} onChange={onChange} onKeyDown={onKeydown} />
          {values.name && <div className="">
            {uniqueNameQuery.isLoading ? 
              'Checking...' : (
                <span className={uniqueNameQuery.data?.available ? 'text-green-500' : 'text-red-500'}>
                  {uniqueNameQuery.data && uniqueNameQuery.data.available ? 'valid' : `${values.name} is already taken`}
                </span>
              )
            }
          </div>}
        </div>
        <div>
          <Input label="Url" placeholder="https://google.com" name="url" value={values.url || ""} onChange={onChange} />
          {values.url && <div className={urlQuery?.valid ? 'text-green-500' : 'text-red-500'}>
            {urlQuery && urlQuery.valid ? 'valid' : 'invalid'}
          </div>}
        </div>
        <div className="flex justify-center mt-7">
          <Button variant="solid" className="px-8" type="submit" loading={createSL.isLoading}>Create</Button>
        </div>
      </form>
    </div>
  )
}