'use client';
import React, { useState, useEffect } from 'react';
import { Radio, RadioGroup } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
import { getWalletsList } from '@/app/lib/api/wallet';
import { createOrder } from '@/app/lib/api/orders';
import { useCartStore } from '@/state/shoppingCart';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/state/theme';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import Notification from '@/app/ui/dashboard/checkout/Notification'; // Adjust the import path accordingly

import {
  //SkeletonCheckout,
  SkeletonWallet,
} from '@/app/ui/skeletons';
import { useWalletStore, Wallet } from '@/state/wallets';
import Image from 'next/image';

//put this into themskeelton folder once you have fixed the issue
const SkeletonCheckout = () => {
  return (
    <li className="flex px-4 py-6 sm:px-6">
      {/* <div className="h-20 w-20 flex-shrink-0 rounded-md bg-gray-200"></div> */}

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
              <div className="h-4 w-3/4 rounded bg-gray-200"></div>
            </h4>
            {/* <div className="mt-1 h-4 w-1/2 bg-gray-200 rounded"></div> */}
          </div>
          <div className="ml-4 flow-root flex-shrink-0">
            <div className="h-5 w-5 rounded-full bg-gray-200"></div>
          </div>
        </div>
        <div className="flex flex-1 items-end justify-between pt-2">
          <div className="h-8 w-20 rounded-md bg-gray-200"></div>
          <div className="ml-4">
            <div className="h-4 w-12 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </li>
  );
};

const Checkout = () => {
  const router = useRouter();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCartStore();
  const [cartItemToDelete, setCartItemToDelete] = useState<number | null>(null);

  const {
    wallets,
    loadingWallets,
    selectedWallet,
    setSelectedWallet,
    fetchWallets,
  } = useWalletStore();
  //const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const [open, setOpen] = useState(false);

  const [subtotal, setSubtotal] = useState('0.00');
  const [tax, setTax] = useState('0.00');
  const [total, setTotal] = useState('0.00');

  // State for individual product errors
  const [errorMessages, setErrorMessages] = useState<{ [key: number]: string }>(
    {},
  );
  // State for order submission errors
  const [orderError, setOrderError] = useState('');

  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };
  const calculateTax = (subtotal: string) => {
    const taxRate = 0.0; // Assuming a tax rate of 10%
    return (parseFloat(subtotal) * taxRate).toFixed(2);
  };

  const handleQuantityChange = (productId: any, quantity: number) => {
    updateQuantity(productId, quantity);

    // Remove error message for this product if any
    setErrorMessages((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[productId];
      return newErrors;
    });
  };

  const confirmDelete = (id: any) => {
    removeFromCart(id);
    setOpen(false);
  };

  const submitOrder = async (e: any) => {
    e.preventDefault();
    console.log('cartItems: ', cartItems);

    const newErrorMessages: { [key: number]: string } = {};

    //fix when you can - take this from the backend
    // cartItems.forEach((item) => {
    // if (item.quantity > 4) {
    //   // should change 4 with an actual number we get from the DB
    //   newErrorMessages[item.id] =
    //     'You cannot purchase more than 4 from this product';
    // }
    //});

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);

      // Do not proceed with order submission

      return;
    } else {
      setErrorMessages({});

      // Proceed with order submission

      const products = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const vat = null;

      try {
        const createdOrderData = await createOrder(products, vat);

        // Clear any previous error message on successful creation
        setOrderError('');
        const orderId = createdOrderData.data.id;
        router.push(`/dashboard/checkout/payment?orderId=${orderId}`);

        clearCart();
        // fetchWallets();
      } catch (error: any) {
        console.log('Error during order submission:', error);
        setOrderError(error.message || 'Order creation failed.');
        return;
      }
    }
  };

  useEffect(() => {
    const fetchWalletInfo = async () => {
      if (wallets.length === 0) {
        await fetchWallets();
      }

      if (wallets.length > 0) {
        setSelectedWallet(wallets[0]);
      }
    };
    fetchWalletInfo();
  }, []);

  useEffect(() => {
    const newSubtotal = calculateSubtotal();
    setSubtotal(newSubtotal);
    const newTax = calculateTax(newSubtotal);
    setTax(newTax);
    setTotal((parseFloat(newSubtotal) + parseFloat(newTax)).toFixed(2));
  }, [cartItems]);

  return (
    <div className="mt-[20px] rounded-md">
      <div
        className={`mx-auto max-w-2xl rounded-md px-4 
          pb-24 pt-16 transition duration-300 sm:px-6 lg:max-w-7xl lg:px-8 ${
            theme === 'dark'
              ? 'bg-gray-900 text-gray-200'
              : 'bg-white text-gray-900'
          }`}
      >
        <h2 className="sr-only">Checkout</h2>

        <Dialog open={open} onClose={setOpen} className="relative z-10">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                className={`relative transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className={`text-base font-semibold leading-6 ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                      }`}
                    >
                      Delete Item
                    </DialogTitle>
                    <div className="mt-2">
                      <p
                        className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        Are you sure you want to delete this item from your
                        cart? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => confirmDelete(cartItemToDelete)}
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    data-autofocus
                    onClick={() => setOpen(false)}
                    className={`mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 ring-gray-600 hover:bg-gray-600'
                        : 'bg-white text-gray-900 ring-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
        <form
          className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
          onSubmit={submitOrder}
        >
          <div>
            <fieldset>
              <legend
                className={`text-lg font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}
              >
                Wallet
              </legend>
              {loadingWallets ? (
                <SkeletonWallet />
              ) : (
                <RadioGroup
                  value={selectedWallet}
                  onChange={setSelectedWallet}
                  className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
                >
                  {wallets.map((walletInfo: Wallet, index: number) => (
                    <Radio
                      disabled={index !== 0}
                      defaultChecked={
                        selectedWallet !== null
                          ? walletInfo.id === selectedWallet.id
                          : index === 0
                      }
                      key={walletInfo.id}
                      value={walletInfo}
                      className={({ checked, focus }) =>
                        `${
                          checked
                            ? 'border-transparent'
                            : 'border-gray-300 dark:border-gray-600'
                        }
                ${focus ? 'ring-2 ring-indigo-500' : ''}
                'relative flex rounded-lg border p-4 shadow-sm transition duration-200 focus:outline-none ${
                  theme === 'dark'
                    ? 'bg-gray-800 text-gray-200'
                    : 'bg-white text-gray-900'
                } ${
                  index !== 0
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer'
                }`
                      }
                    >
                      {({ checked }) => (
                        <>
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <span
                                className={`block text-sm font-medium ${
                                  theme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-900'
                                }`}
                              >
                                {walletInfo.currency}
                              </span>
                              <span
                                className={`mt-6 text-sm font-medium ${
                                  theme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-900'
                                }`}
                              >
                                {walletInfo.availableAmount}
                              </span>
                            </span>
                          </span>
                          {checked && (
                            <CheckCircleIcon
                              className="h-5 w-5 text-black dark:text-gray-200"
                              aria-hidden="true"
                            />
                          )}
                        </>
                      )}
                    </Radio>
                  ))}
                </RadioGroup>
              )}
            </fieldset>
          </div>

          {/* Order summary */}
          <div className="mt-10 lg:mt-0">
            <h2
              className={`text-lg font-medium ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              Order summary
            </h2>

            <div
              className={`mt-4 rounded-lg border border-gray-200 shadow-sm dark:border-gray-700 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <h3 className="sr-only">Items in your cart</h3>
              <ul
                role="list"
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                {cartItems.length === 0
                  ? Array(2)
                      .fill(0)
                      .map((_, index) => <SkeletonCheckout key={index} />)
                  : cartItems.map((product) => (
                      <li key={product.id} className="flex px-4 py-6 sm:px-6">
                        <Image
                          width={200}
                          height={200}
                          src={product.logo ? product.logo : '/NoPhoto.jpg'}
                          alt={product.groupName}
                          className="h-20 w-20 flex-shrink-0 rounded-md"
                        />

                        <div className="ml-6 flex flex-1 flex-col">
                          <div className="flex">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm">
                                <p
                                  className={`font-medium ${
                                    theme === 'dark'
                                      ? 'text-gray-300 hover:text-gray-400'
                                      : 'text-gray-700 hover:text-gray-800'
                                  }`}
                                >
                                  {product.groupName}
                                </p>
                              </h4>
                            </div>

                            <div className="ml-4 flow-root flex-shrink-0">
                              <button
                                onClick={() => {
                                  setOpen(true);
                                  setCartItemToDelete(product.id);
                                }}
                                type="button"
                                className={`-m-2.5 flex items-center justify-center rounded-md p-2.5 ${
                                  theme === 'dark'
                                    ? 'bg-gray-700 text-gray-300 hover:text-gray-100'
                                    : 'bg-white text-gray-400 hover:text-gray-500'
                                }`}
                              >
                                <span className="sr-only">Remove</span>
                                <TrashIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-1 items-end justify-between pt-2">
                            <div className="flex flex-col">
                              {errorMessages[product.id] && (
                                <div className="mb-1 text-sm text-red-500">
                                  {errorMessages[product.id]}
                                </div>
                              )}
                              <input
                                type="number"
                                id={`quantity-${product.id}`}
                                name="quantity"
                                min="1"
                                max="1000"
                                value={product.quantity}
                                onChange={(e) => {
                                  const value = Math.min(
                                    1000,
                                    Math.max(1, Number(e.target.value) || 1),
                                  );
                                  handleQuantityChange(product.id, value);
                                }}
                                className={`w-20 rounded-md border py-1.5 text-center text-base font-medium shadow-sm focus:ring-1 focus:ring-indigo-500 sm:text-sm ${
                                  theme === 'dark'
                                    ? 'border-gray-600 bg-gray-700 text-gray-300 focus:border-indigo-400'
                                    : 'border-gray-300 text-gray-700 focus:border-indigo-500'
                                }`}
                              />
                            </div>

                            <div className="ml-4">
                              <p
                                className={`mt-1 text-sm font-medium ${
                                  theme === 'dark'
                                    ? 'text-gray-300'
                                    : 'text-gray-900'
                                }`}
                              >
                                {product.currency === 'USD' ? '$' : '€'}
                                {Number(product.price) * product.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 dark:border-gray-700 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium">{subtotal}</dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-sm">Taxes</dt>
                  <dd className="text-sm font-medium">{tax}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
                  <dt className="text-base font-medium">Total</dt>
                  <dd className="text-base font-medium">{total}</dd>
                </div>
              </dl>

              <div className="border-t border-gray-200 px-4 py-6 dark:border-gray-700 sm:px-6">
                {orderError && (
                  <Notification message={orderError} type="error" />
                )}
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-black px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Confirm order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
