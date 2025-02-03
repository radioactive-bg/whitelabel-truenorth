// pages/dashboard/orders/[id].tsx
'use client';
import { useParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { fetchOrderById, downloadInvoice } from '@/app/lib/api/orders';
import { PaperClipIcon } from '@heroicons/react/20/solid';
import { getStatusStyles } from '@/app/lib/utils';
import { useThemeStore } from '@/state/theme';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useThemeStore();
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    setThemeKey((prev) => prev + 1); // Update state to trigger re-render
  }, [theme]);

  useEffect(() => {
    if (id) {
      console.log('id:', id, typeof id);
      fetchOrderDetails(id as string);
    }
  }, [id]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (
      order?.orderDetails?.statusText === 'In process' ||
      order?.orderDetails?.statusText === 'Waiting for cancel'
    ) {
      intervalId = setInterval(() => {
        fetchOrderDetails(id as string);
      }, 3000); // Fetch order details every 3 seconds
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Cleanup interval on component unmount
      }
    };
  }, [order?.orderDetails?.statusText, id]);

  const fetchOrderDetails = async (orderId: string) => {
    setLoading(true);
    try {
      const response = await fetchOrderById(orderId);
      console.log('Order details:', response.data);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  };

  const handleDownload = async (orderId: number) => {
    try {
      const blob = await downloadInvoice(orderId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  if (!order && loading === false) {
    return <div>No order details found.</div>;
  }

  if (!order && loading === true) {
    return (
      <div className="mt-10 space-y-6">
        <div className="px-4 sm:px-0">
          <h3 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-100">
            Order Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Personal details and application.
          </p>
        </div>

        {/* Skeleton Loader Grid */}
        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="border-t border-gray-200 px-4 py-6 dark:border-gray-700 sm:col-span-1"
              >
                <div className="mb-2 h-4 w-1/3 animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
                <div className="h-5 w-2/3 animate-pulse rounded-md bg-gray-300 dark:bg-gray-500"></div>
              </div>
            ))}
        </div>

        {/* Attachments Section */}
        <div className="border-t border-gray-200 px-4 py-6 dark:border-gray-700 sm:col-span-2">
          <div className="mb-2 h-4 w-1/3 animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
          <div className="h-10 w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <div className="px-4 sm:px-0">
          <h3 className="text-2xl font-bold font-semibold leading-7 text-gray-900 dark:text-white ">
            Order Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Personal details and application.
          </p>
        </div>
        <div className="mt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-bold leading-6 text-gray-900 dark:text-white">
                Order Number
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2 ">
                {order.orderDetails.displayId}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-bold leading-6 text-gray-900 dark:text-white">
                Placed On
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
                {order.orderDetails.createdAt}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-bold leading-6 text-gray-900 dark:text-white">
                Amount
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
                {order.orderDetails.amountTotal}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-bold leading-6 text-gray-900 dark:text-white">
                Status
              </dt>
              <dd>
                {loading ? (
                  <div className="h-6 w-1/3 animate-pulse rounded-md bg-gray-300"></div>
                ) : (
                  <div>
                    <span
                      key={themeKey}
                      className={`${
                        getStatusStyles(order.orderDetails.status).bgColor
                      } inline-flex  items-center rounded-md px-2 py-1 text-xs font-medium ${
                        getStatusStyles(order.orderDetails.status).textColor
                      } ring-1 ring-inset ring-${
                        getStatusStyles(order.orderDetails.status).ringColor
                      }/20`}
                    >
                      {order.orderDetails.statusText}{' '}
                      {order.orderDetails.errorText
                        ? `:   ${order.orderDetails.errorText}`
                        : ''}
                    </span>

                    {/* {order.orderDetails.statusText === 'Cancelled' && (
                    <span className="text-sm text-red-500">
                      {order.orderDetails.errorText}
                    </span>
                  )} */}
                  </div>
                )}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
              <dt className="text-sm font-bold leading-6 text-gray-900 dark:text-white">
                About
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
                This order, identified by order number{' '}
                <span className="font-semibold">
                  {order.orderDetails.displayId}
                </span>
                , was placed on{' '}
                <span className="font-semibold">
                  {order.orderDetails.createdAt}
                </span>
                . The total amount for this order is{' '}
                <span className="font-semibold">
                  {order.orderDetails.amountTotal}
                </span>
                , and its current status is{' '}
                {loading ? (
                  <span className="inline-block h-5 w-20 animate-pulse rounded-md bg-gray-300"></span>
                ) : (
                  <span className="font-semibold">
                    {order.orderDetails.statusText}
                  </span>
                )}
                .{/* List Order Items */}
                {order.orderProducts.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Order Items:
                    </h3>
                    <ul className="mt-1 space-y-1 text-sm text-gray-700 dark:text-gray-400">
                      {order.orderProducts.map(
                        (product: any, index: number) => (
                          <li key={index} className="flex justify-between">
                            <span>
                              {product.count} × {product.groupName} (
                              {product.name})
                            </span>
                            <span className="font-semibold">
                              {product.clientPrice}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </dd>
            </div>

            {/* Attachments Section - Only visible if status is "Completed" */}
            {order.orderDetails.statusText === 'Completed' && (
              <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">
                  Attachments
                </dt>
                <dd className="mt-2 text-sm text-gray-900">
                  {loading ? (
                    <div className="flex animate-pulse items-center space-x-4">
                      <div className="h-6 w-5/6 rounded bg-gray-300"></div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          onClick={() => handleDownload(order.orderDetails.id)}
                          className="ml-4 rounded-md px-3 py-1 text-indigo-600 transition duration-150 hover:bg-indigo-100 hover:text-indigo-500 active:bg-indigo-200 active:text-indigo-700"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ) : (
                    <ul
                      role="list"
                      className="divide-y divide-gray-100 rounded-md border border-gray-200"
                    >
                      <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                        <div className="flex w-0 flex-1 items-center">
                          <PaperClipIcon
                            className="h-5 w-5 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium dark:text-gray-400">
                              {`Order-${order.orderDetails.id}.pdf`}
                            </span>
                            <span className="flex-shrink-0 text-gray-400">
                              2.4mb
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() =>
                              handleDownload(order.orderDetails.id)
                            }
                            className="ml-4 rounded-md bg-black px-3 py-1 text-white transition duration-150 hover:bg-black/70 hover:text-white active:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900 dark:hover:text-gray-300 dark:active:bg-gray-600 dark:active:text-gray-200"
                          >
                            Download
                          </button>
                        </div>
                      </li>
                    </ul>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
