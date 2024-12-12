'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchOrderById, downloadInvoice } from '@/app/lib/api/orders';
import { PaperClipIcon } from '@heroicons/react/20/solid';
import { getStatusStyles } from '@/app/lib/utils';

const OrderDetailsContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId as string);
    }
  }, [orderId]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (
      order?.orderDetails?.statusText === 'In Progress' ||
      order?.orderDetails?.statusText === 'Waiting for cancel'
    ) {
      intervalId = setInterval(() => {
        fetchOrderDetails(orderId as string);
      }, 3000); // Fetch order details every 3 seconds
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Cleanup interval on component unmount
      }
    };
  }, [order?.orderDetails?.statusText, orderId]);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>No order details found.</div>;
  }

  return (
    <>
      <div className="mt-10">
        <div className="px-4 sm:px-0">
          <h3 className="text-2xl font-bold font-semibold leading-7 text-gray-900">
            Order Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Personal details and application.
          </p>
        </div>
        <div className="mt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-bold leading-6 text-gray-900">
                Order Number
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {order.orderDetails.displayId}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-bold leading-6 text-gray-900">
                Placed On
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {order.orderDetails.createdAt}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-bold leading-6 text-gray-900">
                Amount
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {order.orderDetails.amountTotal}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-bold leading-6 text-gray-900">
                Status
              </dt>
              <dd
                className={`${
                  getStatusStyles(order.orderDetails.status).bgColor
                } inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  getStatusStyles(order.orderDetails.status).textColor
                } ring-1 ring-inset ring-${
                  getStatusStyles(order.orderDetails.status).ringColor
                }/20`}
              >
                {order.orderDetails.statusText}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
              <dt className="text-sm font-bold leading-6 text-gray-900">
                About
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                This order, identified by order number{' '}
                {order.orderDetails.displayId}, was placed on{' '}
                {order.orderDetails.createdAt}. The total amount for this order
                is {order.orderDetails.amountTotal}, and its current status is
                marked as `&apos;`{order.orderDetails.statusText}`&apos;`. This
                order includes a variety of items/services that were carefully
                selected by the customer. For more details, please refer to the
                attached invoice.
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Attachments
              </dt>
              <dd className="mt-2 text-sm text-gray-900">
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
                        <span className="truncate font-medium">
                          {`Invoice-${order.orderDetails.id}.pdf`}
                        </span>
                        <span className="flex-shrink-0 text-gray-400">
                          2.4mb
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleDownload(order.orderDetails.id)}
                        className={`$ ml-4 rounded-md px-3 py-1 text-indigo-600 transition duration-150 hover:bg-indigo-100 hover:text-indigo-500 active:bg-indigo-200 active:text-indigo-700 ${
                          order.orderDetails.statusText !== 'Complete' &&
                          'cursor-not-allowed opacity-50'
                        }`}
                        disabled={order.orderDetails.statusText !== 'Complete'}
                      >
                        Download
                      </button>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
};

const OrderDetailsPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OrderDetailsContent />
  </Suspense>
);

export default OrderDetailsPage;
