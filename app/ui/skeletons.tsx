import { getStatusStyles } from '@/app/lib/utils';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

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
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                      Client
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Create Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                    >
                      Actions
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {[...Array(10)].map((_, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-5 pr-3 text-sm sm:pl-0">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <Skeleton width={50} />
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <Skeleton width={100} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <Skeleton width={70} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <Skeleton width={120} />
                      </td>
                      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                        <Skeleton width={80} />
                      </td>
                      <td className="relative whitespace-nowrap py-5 pr-4 text-center text-sm font-medium sm:pr-0">
                        <Skeleton width={60} />
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
        <Skeleton width={100} />
        <Skeleton width={100} />
      </div>
    </>
  );
}

export function ProductsTableSkeleton() {
  return (
    <div className="w-full">
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pb-24">
          <div className="space-y-20">
            <div>
              <h3 className="sr-only">Loading products...</h3>
              <table className="mt-4 w-full text-gray-500 sm:mt-6">
                <caption className="sr-only">Loading products</caption>
                <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                  <tr>
                    <th className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">
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
                    <th className="w-0 py-3 text-right font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                  {[...Array(10)].map((_, index) => (
                    <tr key={index}>
                      <td className="py-6 pr-8">
                        <div className="flex items-center">
                          <Skeleton
                            width={64}
                            height={64}
                            className="mr-6 h-16 w-16 rounded object-cover object-center"
                          />
                          <div>
                            <Skeleton width={150} />
                          </div>
                        </div>
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell">
                        <Skeleton width={100} />
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell">
                        <Skeleton width={50} />
                      </td>
                      <td className="py-6 sm:table-cell sm:pr-8">
                        <Skeleton width={50} />
                      </td>
                      <td className="hidden py-6 pr-8 sm:table-cell">
                        <Skeleton width={75} />
                      </td>
                      <td className="whitespace-nowrap py-6 text-right font-medium">
                        <Skeleton width={75} />
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
    <div className="animate-pulse">
      <div className="flex space-x-4">
        <div className="flex-shrink-0">
          <div className="h-20 w-20 rounded-md bg-gray-200"></div>
        </div>
        <div className="flex flex-1 flex-col space-y-2">
          <div className="h-4 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
          <div className="h-4 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

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
