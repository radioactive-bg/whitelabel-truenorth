'use client';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { getOrdersList } from '@/app/lib/api/orders';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const router = useRouter();

  const { auth } = authStore() as {
    auth: Auth;
  };

  function getStatusStyles(status: number) {
    switch (status) {
      case 3:
        return {
          text: 'Complete',
          bgColor: 'bg-green-50',
          textColor: 'text-green-700',
          ringColor: 'ring-green-600',
        };
      case 6:
        return {
          text: 'Cancelled',
          bgColor: 'bg-red-50',
          textColor: 'text-red-700',
          ringColor: 'ring-red-600',
        };
      case 7:
        return {
          text: 'In process',
          bgColor: 'bg-[#FAAD14]',
          textColor: 'text-[#FAAD14]',
          ringColor: 'ring-[#FAAD14]',
        };

      default:
        return {
          text: 'Unknown',
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-700',
          ringColor: 'ring-gray-600',
        };
    }
  }

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const people = [
    {
      name: 'Lindsay Walton',
      title: 'Front-end Developer',
      department: 'Optimization',
      email: 'lindsay.walton@example.com',
      role: 'Member',
      image:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Lindsay Walton',
      title: 'Front-end Developer',
      department: 'Optimization',
      email: 'lindsay.walton@example.com',
      role: 'Member',
      image:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Lindsay Walton',
      title: 'Front-end Developer',
      department: 'Optimization',
      email: 'lindsay.walton@example.com',
      role: 'Member',
      image:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      name: 'Lindsay Walton',
      title: 'Front-end Developer',
      department: 'Optimization',
      email: 'lindsay.walton@example.com',
      role: 'Member',
      image:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken =
          auth.access_token || localStorage.getItem('access_token');

        if (!accessToken) {
          router.push('/login');
        }

        const TotalPages = await getOrdersList(auth.access_token, 1, [3, 5, 7]);
        setLoading(false);
        setOrders(TotalPages);
      } catch (err) {
        console.error('Error fetching invoices:', err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="w-full">
      {loading === true ? (
        <div>Loading...</div>
      ) : (
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
                      <tr key={order.email}>
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
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View<span className="sr-only">, {order.name}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
