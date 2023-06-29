import { Helmet } from "react-helmet-async"
import { NavLink, useParams } from "react-router-dom"
import { useSL } from "../api/getSL"
import Spinner from "@/components/ui/Spinner"
import { Clipboard } from "@/components/common/Clipboard"
import Button from "@/components/ui/Button"
import { Transition } from "@headlessui/react"
import { SLStat } from "../components"
import { useQr } from "../api/getQr"


export const SL = () => {
  // Get SL name from params
  const { name } = useParams()
  const query = useSL({ name })
  const qrMutation = useQr({ name })

  return (
    <div className="py-10">
      <Helmet>
        <title>{name}</title>
      </Helmet>
      {/* BreadCrumbs */}
      <div className="flex items-center text-lg gap-2">
        <NavLink to="/app" className="text-gray-500 hover:text-gray-700">
          Home
        </NavLink>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
          </svg>
        </span>
        <span>{name}</span>
      </div>
      {query.isLoading && <Spinner />}
      <Transition
        show={query.isSuccess}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0 transform -translate-y-2"
        enterTo="opacity-100 transform translate-y-0"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100 transform translate-y-0"
        leaveTo="opacity-0 transform -translate-y-2">
        <div className="mt-6 max-w-full w-[45rem] flex flex-wrap gap-4 justify-between">
          <div>
            <h2 className="text-3xl font-semibold">{name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <a className="flex items-center gap-2 text-green-500 hover:underline hover:text-green-500 cursor-pointer" href={query.data?.sl?.shortLink!} target="_blank" rel="noreferrer">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </span>
                <h3>{query.data?.sl?.shortLink}</h3>
              </a>
              <Clipboard text={query.data?.sl?.shortLink!} />
            </div>
            <div className="mt-2">
              <div>Long URL: <span className="hover:underline cursor-pointer" onClick={() => window.open(query.data?.sl?.url!, '_blank')}>{query.data?.sl?.url}</span></div>
            </div>
            <div className="mt-6">
              <div>Created on {new Date(query.data?.sl?.createdAt!).toLocaleDateString()}</div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button className="!bg-neutral-100 hover:!bg-neutral-200 dark:!bg-neutral-800 dark:hover:!bg-neutral-800 !text-black dark:!text-white flex">
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </span>
                <span className="ml-2">Edit configuration</span>
              </Button>
              {!query.data?.sl?.qrUrl && (
                <Button className="!bg-neutral-100 hover:!bg-neutral-200 dark:!bg-neutral-800 dark:hover:!bg-neutral-800 !text-black dark:!text-white flex" loading={qrMutation.isLoading} onClick={() => qrMutation.mutate("Omo!")}>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                    </svg>
                  </span>
                  <span className="ml-2">Get a QR</span>
                </Button>
                )}
            </div>
          </div>
          {query.data?.sl?.qrUrl && (
            <div>
              <div className="bg-neutral-100 dark:bg-neutral-700 h-48 w-48">
                <img src={query.data?.sl?.qrUrl} alt="qr" className="w-full h-full" />
              </div>
            </div>
          )}
        </div>
        <div className="mt-24">
          <h2 className="text-2xl font-thin mt-10">Activities</h2>
          <div className="md:max-w-3xl mt-6">
            <SLStat name={name!} />
          </div>
        </div>
      </Transition>
    </div>
  )
}