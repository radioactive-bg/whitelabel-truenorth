'use client';
import React, { useState, useEffect } from 'react';
import { Radio, RadioGroup } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
import { getWalletsList } from '@/app/lib/api/wallet';
import { createOrder } from '@/app/lib/api/orders';
import { useCartStore } from '@/state/shoppingCart';
import { useRouter } from 'next/navigation';

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

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

  // Add state for error messages
  const [errorMessages, setErrorMessages] = useState<{ [key: number]: string }>(
    {},
  );

  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };
  const calculateTax = (subtotal: string) => {
    const taxRate = 0.1; // Assuming a tax rate of 10%
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
    cartItems.forEach((item) => {
      // if (item.quantity > 4) {
      //   // should change 4 with an actual number we get from the DB
      //   newErrorMessages[item.id] =
      //     'You cannot purchase more than 4 from this product';
      // }

    });

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

      let createdOrderData = await createOrder(products, vat);
      console.log('createdOrderData: ', JSON.stringify(createdOrderData));

      const orderId = createdOrderData.data.id;
      //clearCart();
      router.push(`/dashboard/checkout/payment?orderId=${orderId}`);
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
    <div className="mt-[20px] rounded-md bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>

        <Dialog open={open} onClose={setOpen} className="relative z-10">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-red-600"
                    />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Delete Item
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
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
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
              <legend className="text-lg font-medium text-gray-900">
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
                      // aria-label={walletInfo.currency}
                      // aria-description={`${walletInfo.currency} for ${walletInfo.availableAmount}`}
                      className={
                        ({ checked, focus }) =>
                          `${checked ? 'border-transparent' : 'border-gray-300'}
                          ${focus ? 'ring-2 ring-indigo-500' : ''}
                          'relative focus:outline-none', flex  rounded-lg border bg-white p-4 shadow-sm
                          ${
                            index !== 0
                              ? 'cursor-not-allowed opacity-50'
                              : 'cursor-pointer'
                          }` // Add styles to show it is disabled
                      }
                    >
                      {({ checked, focus }) => (
                        <>
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <span className="block text-sm font-medium text-gray-900">
                                {walletInfo.currency}
                              </span>
                              {/* <span className="mt-1 flex items-center text-sm text-gray-500">
                                {walletInfo.turnaround}
                              </span> */}
                              <span className="mt-6 text-sm font-medium text-gray-900">
                                {walletInfo.availableAmount}
                              </span>
                            </span>
                          </span>
                          {checked ? (
                            <CheckCircleIcon
                              className="h-5 w-5 text-indigo-600"
                              aria-hidden="true"
                            />
                          ) : null}
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
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
              <h3 className="sr-only">Items in your cart</h3>
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.length === 0
                  ? Array(2)
                      .fill(0)
                      .map((_, index) => (
                        <>
                          <SkeletonCheckout />
                        </>
                      ))
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
                                <p className="font-medium text-gray-700 hover:text-gray-800">
                                  {product.groupName}
                                </p>
                              </h4>
                              {/* <p className="mt-1 text-sm text-gray-500">
                                {product.name}
                              </p> */}
                            </div>

                            <div className="ml-4 flow-root flex-shrink-0">
                              <button
                                // onClick={() => removeFromCart(product.id)}
                                onClick={() => {
                                  setOpen(true);
                                  setCartItemToDelete(product.id);
                                }}
                                type="button"
                                className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500"
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
                                className="w-20 rounded-md border border-gray-300 py-1.5 text-center text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                              />
                            </div>

                            <div className="ml-4">
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {product.currency === 'USD' ? '$' : '€'}
                                {Number(product.price) * product.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {subtotal}
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-sm">Taxes</dt>
                  <dd className="text-sm font-medium text-gray-900">{tax}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium">Total</dt>
                  <dd className="text-base font-medium text-gray-900">
                    {total}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
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
