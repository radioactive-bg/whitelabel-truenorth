'use client';

import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { getOrdersList, FetchInvoicesParams } from '@/app/lib/api/orders';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';
import { getStatusStyles } from '@/app/lib/utils';
import { useThemeStore } from '@/state/theme';

import Pagination from '../../ui/dashboard/pagination';

import { useEffect, useState } from 'react';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import FiltersSection from '@/app/ui/dashboard/orders/FiltersSection';
//import StandaloneCalendar from '@/app/ui/dashboard/orders/Calendar';

export default function Page({}: {}) {
  const router = useRouter();

  const { auth, initializeAuth } = authStore() as {
    auth: Auth;
    initializeAuth: () => void;
  };
  const { theme } = useThemeStore();
  // 🔹 Force re-render when theme changes
  const [themeKey, setThemeKey] = useState(0);
  useEffect(() => {
    setThemeKey((prev) => prev + 1); // Update state to trigger re-render
  }, [theme]);

  const viewOrder = (orderId: number) => {
    console.log(`Navigating to order ${orderId}`);
    router.push(`/dashboard/orders/${orderId}`);
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12);
  const [filters, setFilters] = useState<FetchInvoicesParams>({
    status: null,
    dateFrom: '',
    dateTo: '',
    orderId: '',
    perPage: 10,
    page: 1,
  });

  useEffect(() => {
    const localValue = localStorage.getItem('access_token') || 'no value';

    if (localValue === 'no value') {
      router.push('/login');
      return;
    }
    fetchOrders(currentPage, filters);
  }, [currentPage, auth.access_token, router]);

  const fetchOrders = async (page: number, appliedFilters: any) => {
    setLoading(true);
    try {
      const requestFilters = { ...appliedFilters, page };
      const response = await getOrdersList(requestFilters);

      setOrders(response.data.data);
      const urlObject = new URL(response.data.links.last);
      const lastPage = new URLSearchParams(urlObject.search).get('page');
      setTotalPages(Number(lastPage));
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* <StandaloneCalendar
        fetchOrders={fetchOrders}
        setFilters={setFilters}
        setCurrentPage={setCurrentPage}
      /> */}
      <FiltersSection
        fetchOrders={fetchOrders}
        setFilters={setFilters}
        setOrders={setOrders}
        setLoading={setLoading}
        setCurrentPage={setCurrentPage}
        page={currentPage}
      />

      <div className=" rounded-lg bg-white px-4 py-6 shadow-md dark:border dark:border-gray-700 dark:bg-gray-800">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                Orders
              </h1>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-50">
                A list of all the Orders in your account including their ID,
                status, price and more.
              </p>
            </div>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <button
                type="button"
                className="block rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:bg-white dark:text-black"
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
                    <table
                      key={themeKey}
                      id="orderList"
                      className="min-w-full divide-y divide-gray-300 dark:divide-gray-700"
                    >
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                          >
                            Order ID
                          </th>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-0"
                          >
                            Operator
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                          >
                            Order Value
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                          >
                            Date of Order
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
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                        {orders.map((order: any) => (
                          <tr
                            key={order.id}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <td className="whitespace-nowrap py-5 pr-3 text-sm text-gray-900 dark:text-gray-200 sm:pl-0">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="font-medium">
                                    {order.displayId}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 dark:text-gray-400">
                              <div className="mt-1">{order.client}</div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 dark:text-gray-400">
                              <div className="mt-1">
                                {order.priceListAmount}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 dark:text-gray-400">
                              <div className="text-gray-900 dark:text-gray-200">
                                {order.title}
                              </div>
                              <div className="mt-1">{order.createdAt}</div>
                            </td>
                            <td
                              id="statusText"
                              className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 dark:text-gray-400"
                            >
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

                            <td className="relative whitespace-nowrap py-5 pr-4 text-center text-sm font-bold sm:pr-0">
                              <button
                                onClick={() => viewOrder(order.id)}
                                className="ml-4 rounded-md px-3 py-1 text-black transition duration-150 hover:bg-black hover:text-white active:bg-black active:text-black dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                              >
                                View
                                <span className="sr-only">, {order.name}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Pagination */}
                    <Pagination
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      totalPages={totalPages}
                    />{' '}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
