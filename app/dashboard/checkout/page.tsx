'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { Radio, RadioGroup } from '@headlessui/react';
import { CheckCircleIcon, TrashIcon } from '@heroicons/react/20/solid';
import { getWalletsList } from '@/app/lib/api/wallet';
import { useCartStore } from '@/state/shoppingCart';

import { SkeletonCheckout, SkeletonWallet } from '@/app/ui/skeletons';

const Checkout = () => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCartStore();

  const [walletsInfo, setWalletsInfo] = useState([]);
  const [loadingWallets, setLoadingWallets] = useState(true);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    let walletInfo = await getWalletsList();
    setWalletsInfo(walletInfo);
    setLoadingWallets(false);
  };

  return (
    <div className="mt-[20px] rounded-md bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h2 className="sr-only">Checkout</h2>

        <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          <div>
            <fieldset>
              <legend className="text-lg font-medium text-gray-900">
                Wallet
              </legend>
              {loadingWallets ? (
                <SkeletonWallet />
              ) : (
                <RadioGroup
                  value={selectedDeliveryMethod}
                  onChange={setSelectedDeliveryMethod}
                  className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
                >
                  {walletsInfo.map((walletInfo: any) => (
                    <Radio
                      key={walletInfo.id}
                      value={walletInfo.availableAmount}
                      aria-label={walletInfo.currency}
                      aria-description={`${walletInfo.currency} for ${walletInfo.availableAmount}`}
                      className={({ checked, focus }) =>
                        `${checked ? 'border-transparent' : 'border-gray-300'}
                          ${focus ? 'ring-2 ring-indigo-500' : ''}
                          'relative focus:outline-none', flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm
                        `
                      }
                    >
                      {({ checked, focus }) => (
                        <>
                          <span className="flex flex-1">
                            <span className="flex flex-col">
                              <span className="block text-sm font-medium text-gray-900">
                                {walletInfo.currency}
                              </span>
                              <span className="mt-1 flex items-center text-sm text-gray-500">
                                {walletInfo.turnaround}
                              </span>
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
                  ? Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <li key={index} className="flex px-4 py-6 sm:px-6">
                          <SkeletonCheckout />
                        </li>
                      ))
                  : cartItems.map((product) => (
                      <li key={product.id} className="flex px-4 py-6 sm:px-6">
                        <div className="flex-shrink-0">
                          <img
                            src={product.logo}
                            alt={product.groupName}
                            className="w-20 rounded-md"
                          />
                        </div>

                        <div className="ml-6 flex flex-1 flex-col">
                          <div className="flex">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm">
                                <p className="font-medium text-gray-700 hover:text-gray-800">
                                  {product.groupName}
                                </p>
                              </h4>

                              <p className="mt-1 text-sm text-gray-500">
                                {product.quantity}
                              </p>
                            </div>

                            <div className="ml-4 flow-root flex-shrink-0">
                              <button
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
                            <p className="mt-1 text-sm font-medium text-gray-900">
                              {product.basePrice}
                            </p>

                            <div className="ml-4">
                              <label htmlFor="quantity" className="sr-only">
                                Quantity
                              </label>
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
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
              </ul>
              <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">$64.00</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Shipping</dt>
                  <dd className="text-sm font-medium text-gray-900">$5.00</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm">Taxes</dt>
                  <dd className="text-sm font-medium text-gray-900">$5.52</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base font-medium">Total</dt>
                  <dd className="text-base font-medium text-gray-900">
                    $75.52
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
