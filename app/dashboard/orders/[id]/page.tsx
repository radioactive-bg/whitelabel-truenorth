'use client';
import { useParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import {
  fetchOrderById,
  downloadInvoice,
  getInvoiceCards,
} from '@/app/lib/api/orders';
import { PaperClipIcon } from '@heroicons/react/20/solid';
import { getStatusStyles } from '@/app/lib/utils';
import { useThemeStore } from '@/state/theme';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { userStore } from '@/state/user';
import { User } from '@/app/lib/types/user';
import { authStore, Auth } from '@/state/auth';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { theme } = useThemeStore();
  const [themeKey, setThemeKey] = useState(0);
  const { auth, initializeAuth } = authStore() as {
    auth: Auth;
    initializeAuth: () => void;
  };

  const { user } = userStore() as { user: User };
  let permissionToDownloadCodes = user.acl.orders.list.special.downloadInvoice
    ? user.acl.orders.list.special.downloadInvoice
    : false;

  const [openCardsDialog, setOpenCardsDialog] = useState(false);

  const [orderCards, setOrderCards] = useState<any>(null);
  useEffect(() => {
    setThemeKey((prev) => prev + 1); // Update state to trigger re-render
  }, [theme]);

  // First, initialize auth if needed
  useEffect(() => {
    if (!auth.access_token) {
      initializeAuth();
    }
  }, [auth.access_token, initializeAuth]);

  useEffect(() => {
    if (id) {
      console.log('id:', id, typeof id);
      fetchOrderDetails(id as string, true);
    }
  }, [id]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (
      order?.orderDetails?.statusText === 'In process' ||
      order?.orderDetails?.statusText === 'Waiting for cancel' ||
      order?.orderDetails?.statusText === 'Waiting for completion'
    ) {
      intervalId = setInterval(() => {
        // Do not set the loading indicator during polling if data is already present.
        fetchOrderDetails(id as string, false);
      }, 3000);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId); // Cleanup interval on component unmount
      }
    };
  }, [order?.orderDetails?.statusText, id]);

  const fetchOrderDetails = async (orderId: string, setLoadingState = true) => {
    if (setLoadingState) {
      setLoading(true);
    }
    try {
      const orderResponse = await fetchOrderById(orderId);

      console.log('Order details:', JSON.stringify(orderResponse.data));
      setOrder(orderResponse.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  };

  const showCards = async (orderId: number) => {
    try {
      const cardsResponse = await getInvoiceCards(String(orderId));
      setOrderCards(cardsResponse.data);
      //setOpenCardsDialog(true);
    } catch (error) {
      console.error('Error fetching invoice cards:', error);
    } finally {
      setOpenCardsDialog(true);
    }
  };

  // Download functions (without shared caching)
  const DownloadPDF = async (orderId: number, downloadFirstPage: boolean) => {
    try {
      const blob = await downloadInvoice(orderId, 'pdf', downloadFirstPage);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF invoice:', error);
    }
  };

  const DownloadCSV = async (orderId: number) => {
    try {
      const blob = await downloadInvoice(orderId, 'csv', false);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Set the file extension to .csv
      link.setAttribute('download', `Invoice-${orderId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading CSV invoice:', error);
    }
  };

  const DownloadXLSX = async (orderId: number) => {
    try {
      const blob = await downloadInvoice(orderId, 'xlsx', false);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Set the file extension to .xlsx
      link.setAttribute('download', `Invoice-${orderId}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading XLSX invoice:', error);
    }
  };

  if (!order && loading === false) {
    return <div>No order details found.</div>;
  }

  if (!order && loading === true) {
    return (
      <div className="mt-10 w-full space-y-6">
        <div className="px-4 sm:px-0">
          <h3 className="text-2xl font-bold leading-7 text-gray-900">
            Order Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
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
                className="border-t border-gray-200 px-4 py-6 sm:col-span-1"
              >
                <div className="mb-2 h-4 w-1/3 animate-pulse rounded-md bg-gray-200"></div>
                <div className="h-5 w-2/3 animate-pulse rounded-md bg-gray-300"></div>
              </div>
            ))}
        </div>

        {/* Attachments Section */}
        <div className="border-t border-gray-200 px-4 py-6 sm:col-span-2">
          <div className="mb-2 h-4 w-1/3 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-10 w-full animate-pulse rounded-md bg-gray-300"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="mt-10 rounded-lg bg-white px-0 py-6 shadow  dark:bg-gray-800 md:p-6">
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
          <div className="dark: border-t border-gray-100 px-4 py-6 dark:border-gray-400 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-bold leading-6 text-gray-900 dark:text-white">
              Order Number
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2 ">
              {order.orderDetails.displayId}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 dark:border-gray-400 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-bold leading-6 text-gray-900 dark:text-white">
              Placed On
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
              {order.orderDetails.createdAt}
            </dd>
          </div>
          <div className="border-t border-gray-100  px-4 py-6 dark:border-gray-400 sm:col-span-1 sm:px-0">
            <dt className="text-sm font-bold leading-6 text-gray-900 dark:text-white">
              Amount
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-400 sm:mt-2">
              {order.orderDetails.amountTotal}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 dark:border-gray-400 sm:col-span-1 sm:px-0">
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
                </div>
              )}
            </dd>
          </div>
          <div className="border-t border-gray-100 px-4 py-6 dark:border-gray-400 sm:col-span-2 sm:px-0">
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
                    {order.orderProducts.map((product: any, index: number) => (
                      <li key={index} className="flex justify-between">
                        <span>
                          {product.count} × {product.groupName} ({product.name})
                        </span>
                        <span className="font-semibold">
                          {product.clientPrice}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </dd>
          </div>

          <div className="border-t border-gray-100 px-4 py-6 dark:border-gray-400 sm:col-span-2 sm:px-0">
            <dt className="text-sm font-bold leading-6 text-gray-900 dark:text-white">
              Card Download Log:
            </dt>
            <dd className="mt-1 max-h-40 overflow-y-auto rounded-md text-sm leading-6 text-gray-700 dark:bg-gray-900 dark:text-gray-400 sm:mt-2">
              {order.orderInfo.clientDownloadInvoices.map(
                (invoice: any, index: number) => (
                  <div key={index} className="flex items-center">
                    <span className="ml-2 text-sm text-gray-900 dark:text-white">
                      {invoice}
                    </span>
                  </div>
                ),
              )}
            </dd>
          </div>

          {/* Attachments Section - Only visible if status is "Completed" */}
          {order.orderDetails.statusText === 'Completed' &&
            permissionToDownloadCodes && (
              <div className="border-t border-gray-100 px-4 py-6 dark:border-gray-400 sm:col-span-2 sm:px-0">
                <div className="md:direction-row mt-6 flex flex-wrap gap-4 md:justify-end">
                  <button
                    onClick={() => DownloadPDF(order.orderDetails.id, true)}
                    className="rounded-md bg-black px-3 py-2 text-[14px] text-white transition duration-150 hover:bg-black/70 hover:text-white active:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900 dark:hover:text-gray-300 dark:active:bg-gray-600 dark:active:text-gray-200 md:text-[1rem]"
                  >
                    Download Summary
                  </button>
                  <button
                    onClick={() => showCards(order.orderDetails.id)}
                    className="rounded-md bg-black px-3 py-2 text-[14px] text-white transition duration-150 hover:bg-black/70 hover:text-white active:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900 dark:hover:text-gray-300 dark:active:bg-gray-600 dark:active:text-gray-200 md:text-[1rem]"
                  >
                    Cards
                  </button>

                  <button
                    className=" rounded-md bg-black px-3 py-2 text-[14px] text-white transition duration-150 hover:bg-black/70 hover:text-white active:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900 dark:hover:text-gray-300 dark:active:bg-gray-600 dark:active:text-gray-200  md:text-[1rem]"
                    onClick={() => DownloadXLSX(order.orderDetails.id)}
                  >
                    Download XLSX
                  </button>
                  <button
                    className=" rounded-md bg-black px-3  py-2 text-[14px] text-white transition duration-150 hover:bg-black/70 hover:text-white active:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-gray-900 dark:hover:text-gray-300 dark:active:bg-gray-600 dark:active:text-gray-200 md:text-[1rem]"
                    onClick={() => DownloadCSV(order.orderDetails.id)}
                  >
                    Download CSV
                  </button>
                </div>
              </div>
            )}
        </dl>
      </div>
      <Dialog
        open={openCardsDialog}
        onClose={setOpenCardsDialog}
        className="relative z-[75] dark:bg-gray-900"
      >
        <DialogBackdrop
          transition
          className="data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in fixed inset-0 bg-gray-500/75 transition-opacity dark:bg-gray-900/75"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto dark:text-white">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in data-closed:sm:translate-y-0 data-closed:sm:scale-95 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all dark:bg-gray-900 sm:my-8 sm:w-full sm:max-w-4xl sm:p-6"
            >
              <div>
                {orderCards &&
                orderCards.cards &&
                orderCards.cards.length > 0 ? (
                  <div className="px-4 sm:px-6 lg:px-8">
                    <div className="mt-8 flow-root">
                      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                              <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                                  >
                                    Name
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                                  >
                                    Serial
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                                  >
                                    URL
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                                  >
                                    Voucher Number
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                                  >
                                    PIN
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                                  >
                                    Expiration
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-600 dark:bg-gray-700">
                                {orderCards.cards.map(
                                  (card: any, index: number) => (
                                    <tr key={index}>
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                        {card.name}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {card.serial}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {card.url}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {card.number}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {card.pin}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                                        {card.expiration}
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div className="itmes-center mt-5 flex flex-row justify-center sm:mt-6">
                <button
                  type="button"
                  onClick={() => setOpenCardsDialog(false)}
                  className="ml-3 rounded-md bg-black px-3 py-1 text-[14px] text-white transition duration-150 hover:bg-black/70 hover:text-white active:text-white dark:bg-gray-600 dark:text-white dark:hover:bg-gray-900 dark:hover:text-gray-300 dark:active:bg-gray-700 dark:active:text-gray-200 md:ml-4 md:text-[1rem]"
                >
                  Go back to Order Details
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default OrderDetails;
