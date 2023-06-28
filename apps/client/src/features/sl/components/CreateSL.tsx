import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input"
import useForm from "@/hooks/useForm"
import { useCreateSL, useUniqueNameQuery } from "../api";
import { API_URL } from "@/lib/config";


const useCheckURL = (url: string) => {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const acceptedProtocols = ['http:', 'https:'];
    try {
      const theUrl = new URL(url);

      // Must have valid protocol
      if (!acceptedProtocols.includes(theUrl.protocol)) {
        setData({ valid: false })
      }

      // Must have a hostname
      if (!theUrl.hostname) {
        setData({ valid: false })
      }

      setData({ valid: true })
    } catch (_) {
      setData({ valid: false })
    }
  }, [url])

  return { data }
}


type CreateSLParams = {
  name: string;
  url: string;
  customDomain: string;
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
    if (!urlQuery?.valid) return
    if (values.name && !uniqueNameQuery.data?.available) return
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
      <h2 className="text-3xl mt-4 font-semibold">Shorten a long link</h2>
      <form className="mt-6 flex flex-col gap-6" onSubmit={onCreate}>
        <div>
          <Input autoComplete="off" label="Paste a long url" placeholder="https://that-loooong-url.com/we-will-cut" name="url" value={values.url || ""} onChange={onChange} />
          {values.url && <div className={urlQuery?.valid ? 'text-green-500' : 'text-red-500'}>
            {urlQuery && urlQuery.valid ? 'valid' : 'invalid'}
          </div>}
        </div>
        <div>
          <Input autoComplete="off" label="Domain" placeholder={API_URL} name="customDomain" value={values.customDomain || ""} onChange={onChange} disabled />
        </div>
        <div>
          <Input autoComplete="off" label="Fancy name (optional)" placeholder="rock-paper-scissors" name="name" value={values.name || ""} onChange={onChange} onKeyDown={onKeydown} />
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
        <div className="flex justify-center mt-7">
          <Button variant="solid" className="px-8" type="submit" loading={createSL.isLoading}>Create</Button>
        </div>
      </form>
    </div>
  )
}