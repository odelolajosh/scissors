import Spinner from '@/components/ui/Spinner';
import cn from 'clsx';
import newSvg from '@/assets/new.svg'
import Button from '@/components/ui/Button';
import { useSLs } from '../api/getSL';
import { SL } from '../types';
import { Clipboard } from '@/components/common/Clipboard';
import { NavLink } from 'react-router-dom';
import { Transition } from '@headlessui/react';

type TokenListProps = {
  onCreate?: () => any;
  onDelete?: (sl: SL) => any;
}

export const SLList: React.FC<TokenListProps> = ({ onCreate, onDelete }) => {
  const { data, isLoading, isSuccess } = useSLs();

  const tdClasses = cn('py-1 px-2')
  const thClasses = cn(['text-left font-semibold', tdClasses])

  return (
    <>
      {isLoading && (
        <div className="w-full h-40 flex justify-center items-center">
          <Spinner light />
        </div>
      )}

      {/* Empty state */}
      <Transition
        show={isSuccess && (!data || data.sls?.length === 0)}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0 transform -translate-y-4 sm:translate-y-0"
        enterTo="opacity-100 transform translate-y-0"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100 transform translate-y-0"
        leaveTo="opacity-0 transform -translate-y-4 sm:translate-y-0">
        <div className="flex flex-col-reverse sm:flex-row">
          <div>
            <h3 className="text-2xl font-bold">You have no tokens yet</h3>
            <p className="mt text-neutral-500">Create your first token by clicking the button below</p>
            <div className="mt-8">
              <Button className="ml-auto bg-primary hover:bg-primary-dark text-white hover:text-white font-semibold py-2 px-4 rounded-md" onClick={onCreate}>Generate token</Button>
            </div>
          </div>
          <div>
            <img src={newSvg} alt="New" className="w-96 h-96 sm:-mt-24" />
          </div>
        </div>
      </Transition>

      {/* Table and stuffs */}
      <Transition
        show={isSuccess && data?.sls?.length > 0}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0 transform -translate-y-4 sm:translate-y-0"
        enterTo="opacity-100 transform translate-y-0"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100 transform translate-y-0"
        leaveTo="opacity-0 transform -translate-y-4 sm:translate-y-0">
        <div className="mt-2 mb-4 flex flex-wrap justify-between">
          <h2 className="text-3xl font-light">Your Links</h2>
          <Button className='bg-primary text-white hover:bg-primary-900 hover:border-primary-800' onClick={onCreate}>Create a new short link</Button>
        </div>
        <table className="w-full table overflow-x-auto">
          <thead className="border-t border-b border-neutral-200 dark:border-neutral-700">
            <tr>
              <th className={thClasses}>Short link</th>
              <th className={thClasses}>Long link</th>
              <th className={thClasses}>Number of visits</th>
              <th className={thClasses}>Created at</th>
              <th className={thClasses}>Actions</th>
            </tr>
          </thead>
          <tbody className="mt-4">
            {data?.sls && data.sls.map((sl, index) => {
              const className = cn({
                'border-b border-neutral-100 dark:border-neutral-800 !h-[10px]': index !== data.sls.length - 1
              })
              return (
                // use transition to make it add and remove smoothly
                <Transition
                  key={sl.name}
                  as="tr"
                  className={className}
                  show={true}
                  enter="transition-opacity duration-300"
                  enterFrom="opacity-0 transform scale-y-0 h-0"
                  enterTo="opacity-100 transform scale-y-100 h-auto"
                  leave="transition-opacity duration-300"
                  leaveFrom="opacity-100 transform scale-y-100 h-auto"
                  leaveTo="opacity-0 transform scale-y-0 h-0">
                  <td className={`${tdClasses} flex`}>
                    <a target="_blank" href={sl.shortLink} className="text-black dark:text-white cursor-pointer hover:underline">{sl.shortLink}</a>
                    <span className="pl-3">
                      <Clipboard text={sl.shortLink} />
                    </span>
                  </td>
                  <td className={`${tdClasses} truncate max-w-[10rem]`}>{sl.url}</td>
                  <td className={tdClasses}>{sl.visits}</td>
                  <td className={tdClasses}>{new Date(sl.createdAt).toLocaleDateString()}</td>
                  <td className={`${tdClasses} flex gap-1`}>
                    <NavLink to={`/app/${sl.name}`}>
                      <Button className="!bg-neutral-100 !text-black dark:!bg-neutral-800 dark:!text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </Button>
                    </NavLink>
                    <Button className="!bg-neutral-100 !text-black dark:!bg-neutral-800 dark:!text-white" onClick={() => onDelete?.(sl)}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </Button>
                  </td>
                </Transition>
              )
            })}
          </tbody>
        </table>
      </Transition>
    </>
  )
}