import { getStatusStyles } from '@/app/lib/utils';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { TrashIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function InvoicesTableSkeleton() {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-0"
                    >
                      Client
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Create Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-gray-200"
                    ></th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                  {[...Array(10)].map((_, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="whitespace-nowrap py-5 pr-3 text-sm text-gray-900 dark:text-gray-200 sm:pl-0">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <Skeleton
                              width={50}
                              baseColor="#d1d5db"
                              highlightColor="#e5e7eb"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 dark:text-gray-400">
                        <Skeleton
                          width={100}
                          baseColor="#d1d5db"
                          highlightColor="#e5e7eb"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 dark:text-gray-400">
                        <Skeleton
                          width={70}
                          baseColor="#d1d5db"
                          highlightColor="#e5e7eb"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 dark:text-gray-400">
                        <Skeleton
                          width={120}
                          baseColor="#d1d5db"
                          highlightColor="#e5e7eb"
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 dark:text-gray-400">
                        <Skeleton
                          width={80}
                          baseColor="#d1d5db"
                          highlightColor="#e5e7eb"
                        />
                      </td>
                      <td className="relative whitespace-nowrap py-5 pr-4 text-center text-sm font-medium sm:pr-0">
                        <Skeleton
                          width={60}
                          baseColor="#d1d5db"
                          highlightColor="#e5e7eb"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-between">
        <Skeleton width={100} baseColor="#d1d5db" highlightColor="#e5e7eb" />
        <Skeleton width={100} baseColor="#d1d5db" highlightColor="#e5e7eb" />
      </div>
    </>
  );
}

export function ProductsTableSkeleton() {
  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pb-24">
          <div className="space-y-6 sm:space-y-20">
            <div>
              <h3 className="sr-only">Loading products...</h3>

              {/* MOBILE LAYOUT (List View) */}
              <div className="grid grid-cols-1 gap-4 sm:hidden">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-md border border-gray-200 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-md" />
                      <div>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="mt-1 h-3 w-20" />
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="mt-2 h-8 w-20" />
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP LAYOUT (Table View) */}
              <table className="hidden w-full text-gray-500 dark:text-gray-400 sm:table">
                <caption className="sr-only">Loading products</caption>
                <thead className="sr-only text-left text-sm text-gray-500 dark:text-gray-400 sm:not-sr-only">
                  <tr>
                    <th className="py-3 pr-8 font-normal sm:w-1 lg:w-1/3">
                      Product
                    </th>
                    <th className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                      Group
                    </th>
                    <th className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                      Price
                    </th>
                    <th className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                      Quantity
                    </th>
                    <th className="hidden py-3 pr-8 font-normal sm:table-cell">
                      Status
                    </th>
                    <th className="w-0 py-3 text-right font-normal"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm dark:divide-gray-700 dark:border-gray-700 sm:border-t">
                  {[...Array(5)].map((_, index) => (
                    <tr key={index}>
                      <td className=" w-full  py-6 pr-8">
                        <Skeleton className=" h-6 w-1/3 rounded-md object-cover" />
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell">
                        <Skeleton className="h-3 w-20" />
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell">
                        <Skeleton className="h-3 w-16" />
                      </td>
                      <td className="py-6 sm:table-cell sm:pr-8">
                        <Skeleton className="h-8 w-16" />
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="whitespace-nowrap py-6 text-right font-medium">
                        <Skeleton className="h-8 w-20" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const SkeletonCheckout = () => {
  return (
    <>
      <Image
        width={200}
        height={200}
        src={'/NoPhoto.jpg'}
        alt={'NoPhoto'}
        className="h-20 w-20 flex-shrink-0 rounded-md"
      />
      <div className="ml-6 flex flex-1 flex-col">
        <div className="flex">
          <div className="min-w-0 flex-1">
            <h4 className="text-sm">
              <p className="animate-pulse font-medium text-gray-700"></p>
            </h4>
            {/* <p className="mt-1 text-sm text-gray-500">
                                {product.name}
                              </p> */}
          </div>

          <div className="ml-4 flow-root flex-shrink-0">
            <button
              type="button"
              className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Remove</span>
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-end justify-between pt-2">
          <select
            id="quantity"
            name="quantity"
            className="rounded-md border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          >
            {[...Array(8)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <div className="ml-4">
            <p className="mt-1 text-sm font-medium text-gray-900"></p>
          </div>
        </div>
      </div>
    </>
  );
};

//  <div className="animate-pulse">
//    <div className="flex space-x-4">
//      <div className="flex-shrink-0">
//        <div className="h-20 w-20 rounded-md bg-gray-200"></div>
//      </div>
//      <div className="flex flex-1 flex-col space-y-2">
//        <div className="h-4 rounded bg-gray-200"></div>
//        <div className="h-4 w-1/2 "></div>
//        <div className="h-4 rounded bg-gray-200"></div>
//      </div>
//    </div>
//  </div>

export const SkeletonWallet = () => {
  return (
    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
      {Array(2)
        .fill(null)
        .map((_, index) => (
          <div
            key={index}
            className="flex animate-pulse cursor-pointer rounded-lg border bg-gray-200 p-4 shadow-sm"
          >
            <div className="flex flex-1">
              <div className="flex flex-col">
                <div className="mb-1 block h-4 w-1/3 rounded bg-gray-300"></div>
                <div className="mt-1 flex h-4 w-2/3 items-center rounded bg-gray-300"></div>
                <div className="mt-6 h-4 w-1/2 rounded bg-gray-300"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export const WalletTableSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-6 w-48 rounded bg-gray-300 dark:bg-gray-600"></div>
      <div className="w-full rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              {['Date', 'Currency', 'TopUp Type', 'Amount'].map(
                (header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                {[...Array(4)].map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
