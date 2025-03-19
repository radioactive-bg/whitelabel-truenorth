import { Fragment, useEffect, useState } from 'react';
import {
  Dialog,
  Transition,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/state/shoppingCart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useThemeStore } from '@/state/theme';

export default function ShoppingCartModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: any;
}) {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCartStore();
  const router = useRouter();

  const [subtotal, setSubtotal] = useState('0.00');
  const [tax, setTax] = useState('0.00');
  const [total, setTotal] = useState('0.00');

  const { theme } = useThemeStore(); // Get theme from Zustand
  const isDark = theme === 'dark';

  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => {
        return total + parseFloat(item.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const continueToPayment = () => {
    setOpen(false);
    router.push(`/dashboard/checkout`);
  };

  const calculateTax = (subtotal: string) => {
    const taxRate = 0.0; // Assuming a tax rate of 10%
    return (parseFloat(subtotal) * taxRate).toFixed(2);
  };

  const handleQuantityChange = (productId: any, quantity: number) => {
    console.log('productId:', productId, 'quantity:', quantity);
    updateQuantity(productId, quantity);
  };

  useEffect(() => {
    const newSubtotal = calculateSubtotal();
    setSubtotal(newSubtotal);
    const newTax = calculateTax(newSubtotal);
    setTax(newTax);
    setTotal((parseFloat(newSubtotal) + parseFloat(newTax)).toFixed(2));
  }, [cartItems]);

  return (
    <Transition show={open}>
      <Dialog className="relative rounded-md" onClose={setOpen}>
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="z-50 hidden sm:fixed sm:inset-0 sm:block sm:bg-gray-500 sm:bg-opacity-75 sm:transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-[75]  mt-[60px] w-screen overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center sm:items-center sm:px-6 lg:px-8">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-105"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-105"
            >
              <Dialog.Panel
                className={`  flex w-full max-w-3xl transform rounded-md text-left text-base transition sm:my-8 ${
                  isDark
                    ? 'bg-gray-900 text-gray-200'
                    : 'bg-white text-gray-900'
                }`}
              >
                <form className="relative flex w-full flex-col overflow-hidden  pb-8 pt-6 sm:rounded-lg sm:pb-6 lg:py-8">
                  <div className="lg:px48 flex items-center justify-between px-4 pb-4 sm:px-6">
                    <h2 className="text-lg font-medium">Shopping Cart</h2>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setOpen(false)}
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <section aria-labelledby="cart-heading">
                    <h2 id="cart-heading" className="sr-only">
                      Items in your shopping cart
                    </h2>
                    <ul
                      role="list"
                      className={`divide-y px-4 sm:px-6 lg:px-8 ${
                        isDark ? 'divide-gray-700' : 'divide-gray-200'
                      }`}
                    >
                      {cartItems.map((cartItem, cartItemIdx) => (
                        <li
                          key={cartItem.id}
                          className={`flex py-8 text-sm sm:items-center ${
                            isDark ? 'text-gray-300' : 'text-gray-900'
                          }`}
                        >
                          <Image
                            width={200}
                            height={200}
                            src={cartItem.logo ? cartItem.logo : '/NoPhoto.jpg'}
                            alt={cartItem.groupName}
                            className={`h-24 w-24 flex-none rounded-lg border sm:h-32 sm:w-32 ${
                              isDark ? 'border-gray-700' : 'border-gray-200'
                            }`}
                          />
                          <div className="ml-4 grid flex-auto grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-3 sm:ml-6 sm:flex sm:items-center sm:gap-0">
                            <div className="row-end-1 flex-auto sm:pr-6">
                              <h3 className="font-medium">{cartItem.group}</h3>
                              <p className="mt-1 text-gray-500 dark:text-gray-400">
                                {cartItem.name}
                              </p>
                            </div>
                            <p className="row-span-2 row-end-2 ml-[20px] font-medium sm:order-1 sm:ml-6 sm:w-1/3 sm:flex-none sm:text-center">
                              {cartItem.currency === 'USD' ? '$' : '€'}
                              {Number(cartItem.price) * cartItem.quantity}
                            </p>
                            <div className="flex items-center sm:block sm:flex-none sm:text-center">
                              <label
                                htmlFor={`quantity-${cartItemIdx}`}
                                className="sr-only"
                              >
                                Quantity, {cartItem.name}
                              </label>

                              <input
                                type="number"
                                id={`quantity-${cartItemIdx}`}
                                name={`quantity-${cartItemIdx}`}
                                min="1"
                                max="1000"
                                value={cartItem.quantity}
                                onChange={(e) => {
                                  const value = Math.min(
                                    1000,
                                    Math.max(1, Number(e.target.value) || 1),
                                  );
                                  handleQuantityChange(cartItem.id, value);
                                }}
                                className={`ml-[10px] w-20 rounded-md border py-1.5 text-center text-base font-medium shadow-sm focus:ring-1 sm:text-sm ${
                                  isDark
                                    ? 'border-gray-600 bg-gray-800 text-gray-300 focus:border-indigo-400 focus:ring-indigo-400'
                                    : 'border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500'
                                }`}
                              />

                              <button
                                onClick={() => removeFromCart(cartItem.id)}
                                type="button"
                                className="ml-4 font-medium hover:text-indigo-500 sm:ml-0 sm:mt-2 lg:ml-6"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section
                    aria-labelledby="summary-heading"
                    className="mt-auto sm:px-6 lg:px-8"
                  >
                    <div
                      className={`p-6 sm:rounded-lg sm:p-8 ${
                        isDark ? 'bg-gray-800' : 'bg-gray-50'
                      }`}
                    >
                      <h2 id="summary-heading" className="sr-only">
                        Order summary
                      </h2>

                      <div className="flow-root">
                        <dl className="-my-4 divide-y text-sm">
                          <div className="flex items-center justify-between py-4">
                            <dt className="text-gray-600 dark:text-gray-400">
                              Subtotal
                            </dt>
                            <dd className="font-medium">{subtotal}</dd>
                          </div>

                          <div className="flex items-center justify-between py-4">
                            <dt className="text-gray-600 dark:text-gray-400">
                              Tax
                            </dt>
                            <dd className="font-medium">{tax}</dd>
                          </div>
                          <div className="flex items-center justify-between py-4">
                            <dt className="text-base font-medium">
                              Order total
                            </dt>
                            <dd className="text-base font-medium">{total}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </section>

                  <div className="mt-8 flex justify-end px-4 sm:px-6 lg:px-8">
                    <button
                      onClick={continueToPayment}
                      id="ContinueToPaymentButton"
                      disabled={cartItems.length === 0}
                      type="button"
                      className={`ml-4 rounded-md bg-black px-3 py-1 text-white transition duration-150 hover:bg-black/70 dark:bg-gray-700 dark:hover:bg-gray-800 ${
                        cartItems.length === 0
                          ? 'cursor-not-allowed opacity-50'
                          : ''
                      }`}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
