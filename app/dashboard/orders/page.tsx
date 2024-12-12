'use client';

import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { getOrdersList } from '@/app/lib/api/orders';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';
import { getStatusStyles } from '@/app/lib/utils';

import Pagination from '../../ui/dashboard/pagination';

import { useEffect, useState } from 'react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Page({}: {}) {
  const router = useRouter();

  const { auth, initializeAuth } = authStore() as {
    auth: Auth;
    initializeAuth: () => void;
  };

  const viewOrder = (orderId: number) => {
    console.log(`Navigating to order ${orderId}`);
    router.push(`/dashboard/orders/${orderId}`);
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);

  useEffect(() => {
    const localValue = localStorage.getItem('access_token') || 'no value';

    if (localValue === 'no value') {
      router.push('/login');
      return;
    }
    fetchOrders(currentPage);
  }, [currentPage, auth.access_token, router]);

  const fetchOrders = async (page: number) => {
    setLoading(true);
    try {
      // 3 and 7 in the array are the statuses for 'Completed' and 'Pending' orders
      const response = await getOrdersList(page, [3, 7]);
      setOrders(response.data.data);
      const urlObject = new URL(response.data.links.last);
      const queryParams = new URLSearchParams(urlObject.search);
      const lastPage = queryParams.get('page');
      setTotalPages(Number(lastPage)); // Assuming API returns totalPages
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Orders
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the Orders in your account including their ID,
              status, price and more.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add Order
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <InvoicesTableSkeleton />
      ) : (
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
                      {orders.map((order: any) => (
                        <tr key={order.id}>
                          <td className="whitespace-nowrap py-5 pr-3 text-sm sm:pl-0">
                            <div className="flex items-center">
                              <div className="ml-4">
                                <div className="font-medium text-gray-900">
                                  {order.id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            <div className="mt-1 text-gray-500">
                              {order.client}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            <div className="mt-1 text-gray-500">
                              {order.priceListAmount}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            <div className="text-gray-900">{order.title}</div>
                            <div className="mt-1 text-gray-500">
                              {order.createdAt}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                            <span
                              className={`${
                                getStatusStyles(order.status).bgColor
                              } inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                                getStatusStyles(order.status).textColor
                              } ring-1 ring-inset ringring-${
                                getStatusStyles(order.status).ringColor
                              }/20`}
                            >
                              {order.statusText}
                            </span>
                          </td>

                          <td className="relative whitespace-nowrap py-5 pr-4 text-center text-sm font-medium sm:pr-0">
                            <button
                              onClick={() => viewOrder(order.id)}
                              className={`$ ml-4 rounded-md px-3 py-1 text-indigo-600 transition duration-150 hover:bg-indigo-100 hover:text-indigo-500 active:bg-indigo-200 active:text-indigo-700`}
                            >
                              View
                              <span className="sr-only">, {order.name}</span>
                            </button>
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
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
