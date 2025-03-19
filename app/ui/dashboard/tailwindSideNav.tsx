'use client';
import { Fragment, useEffect, useState, useRef } from 'react';
import {
  Dialog,
  Menu,
  Transition,
  DialogPanel,
  TransitionChild,
} from '@headlessui/react';
import {
  Bars3Icon,
  PhoneIcon,
  XMarkIcon,
  ShoppingBagIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';

import { useThemeStore } from '@/state/theme';

import NavLinks from '@/app/ui/dashboard/nav-links';
import Logo from '@/app/ui/logo';
import LogoWhite from '@/app/ui/logo-white';
import { authStore, Auth } from '@/state/auth';
import { userStore } from '@/state/user';
import { useCartStore } from '@/state/shoppingCart';
import { User } from '@/app/lib/types/user';
import { useRouter } from 'next/navigation';

import ShoppingCartModal from '../../ui/dashboard/shopingCart/shoppingCartModal';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ThemeToggle from '@/app/ui/ThemeToggle';

//import { getWalletsList } from '@/app/lib/api/wallet';
import { useWalletStore, Wallet } from '@/state/wallets';
import clsx from 'clsx';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

// Debounce function
function debounce(func: (...args: any[]) => void, delay: number) {
  let timer: NodeJS.Timeout | null = null;
  let firstCall = true;

  return (...args: any[]) => {
    if (firstCall) {
      func(...args); // Execute immediately on first call
      firstCall = false;
    }

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export default function TailwindSideNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openShoppingCart, setOpenShoppingCart] = useState(false);

  const { cartItems } = useCartStore(); // Access cart items from the cart store
  const totalItemsInCart = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // const [searchTerm, setSearchTerm] = useState(''); // Input state

  const [searchProductGroup, setSearchProductGroup] = useState(''); // Input state
  const [loading, setLoading] = useState(false); // Loading state
  const [results, setResults] = useState([]); // Search results

  const { theme } = useThemeStore();

  const [isFocused, setIsFocused] = useState(false); // Track input focus state

  const { wallets, loadingWallets, error, fetchWallets, removeWallet } =
    useWalletStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { auth, setAuth } = authStore() as {
    auth: Auth;
    setAuth: (auth: Auth) => void;
  };
  const { user, updateUserProperty } = userStore() as {
    user: User;
    updateUserProperty: (propertyKey: keyof User, propertyValue: any) => void;
  };
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  let iContactUsActive = pathname === '/dashboard/contact-us';

  useEffect(() => {
    const localValue = localStorage.getItem('username') || '';
    //console.log('localValue in  page - dashboard: ', localValue);
    //console.log('auth.access_token in  page - dashboard: ', auth.access_token);
    updateUserProperty('name', localValue);
    if (localValue === '' || !localValue) {
      router.push('/login');
      return;
    }
  }, [auth.access_token]);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    let walletInfo = await fetchWallets();
    //console.log('walletInfo:', JSON.stringify(walletInfo));
  };

  const handleLogout = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/logout`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.access_token}`,
          },
        },
      );
      const data = await response.json();
      console.log('logout request data: ', JSON.stringify(data));

      let authInfo: Auth = {
        access_token: '',
        access_token_expires: 0,
        refresh_token: '',
        isLoggedIn: false,
      };
      localStorage.setItem('access_token', '');
      localStorage.setItem('refresh_token', '');
      localStorage.setItem('access_token_expires', '');
      setAuth(authInfo);
      router.push('/');
    } catch (error) {
      console.error('catch handleLogout Error:', error);
      alert('Failed to logout');
    }
  };

  const fetchSearchResults = async (query: string) => {
    console.log('fetchSearchResults');
    console.log('query: ', query);

    if (!query) {
      console.log('No query');
      setResults([]);
      return;
    }
    setLoading(true);

    try {
      // Use axios.get with query parameters
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/product-groups`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          params: {
            productGroupName: query,
          },
        },
      );

      setResults(response.data.data || []); // Adjust according to the API response
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useRef(debounce(fetchSearchResults, 500)).current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchProductGroup(query);
    debouncedFetch(query);
  };

  const userNavigation = [{ name: 'Sign out', action: handleLogout }];

  const handleSearchItemClick = (e: any, result: any) => {
    console.log('handleSearchItemClick: ', result);
    console.log('result.name: ', result.name);
    router.push(
      `/dashboard/catalog?ProductGroups=${encodeURIComponent(result.name)}`,
    );
  };

  return (
    <>
      <>
        <Transition show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            //see if removing the z-index breaks anything else
            //className="relative z-50 lg:hidden"
            className="relative lg:hidden"
            onClose={() => setSidebarOpen(false)}
          >
            <TransitionChild
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div className=" fixed inset-0 flex">
              <TransitionChild
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel
                  onClick={(e) => e.stopPropagation()}
                  className="relative mr-16 flex w-full max-w-xs flex-1 "
                >
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 dark:bg-gray-800">
                    <div className="-mx-2 mt-16 flex h-16 shrink-0  items-center">
                      {theme === 'dark' ? <LogoWhite /> : <Logo />}
                    </div>
                    <div
                      onClick={() => {
                        router.push('/dashboard/wallet');
                        setSidebarOpen(false);
                      }}
                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 rounded-lg border border-gray-300 bg-white px-4 py-5 shadow-md hover:cursor-pointer dark:border-gray-900 dark:bg-gray-900 dark:hover:bg-gray-700 xl:px-8"
                    >
                      <div className="flex w-full items-center">
                        <WalletIcon
                          className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-[#50C8ED] dark:text-gray-300 dark:group-hover:text-[#50C8ED]"
                          aria-hidden="true"
                        />
                        <dt className="ml-[10px] text-sm font-bold leading-6 text-gray-500 dark:text-gray-300">
                          {'Wallet'}
                        </dt>
                      </div>
                      {loadingWallets ? (
                        <div className="h-10 w-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
                      ) : (
                        <dd className="w-full flex-none text-2xl font-medium leading-10 tracking-tight text-gray-900 dark:text-white">
                          {wallets[0].availableAmount
                            ? wallets[0].availableAmount
                            : '$ 0'}
                        </dd>
                      )}
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="space-y-1">
                            <NavLinks
                              setSidebarOpen={setSidebarOpen}
                              setOpenShoppingCart={setOpenShoppingCart}
                            />
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <Link
                            href="/dashboard/contact-us"
                            onClick={() => {
                              console.log(
                                '/dashboard/contact-us  setSidebarOpen(false);',
                              );
                              setSidebarOpen(false);
                              setOpenShoppingCart(false);
                            }}
                            className={clsx(
                              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition duration-300',
                              iContactUsActive
                                ? 'bg-black text-white dark:bg-white dark:text-black'
                                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                            )}
                          >
                            <PhoneIcon
                              className={clsx(
                                'w-6 transition duration-300',
                                iContactUsActive
                                  ? 'text-white dark:text-black'
                                  : 'text-gray-600 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white',
                              )}
                            />
                            Contact Us
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto  bg-white px-4 pb-4 dark:bg-gray-800 dark:text-white">
            <div className="-mx-2 flex h-24 shrink-0  items-center">
              {theme && theme === 'dark' ? <LogoWhite /> : <Logo />}
            </div>
            {/* add the wallet  */}
            <div
              onClick={() => router.push('/dashboard/wallet')}
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 rounded-lg border border-gray-300 bg-white px-4 py-5 shadow-md hover:cursor-pointer dark:border-gray-900 dark:bg-gray-900 dark:hover:bg-gray-700 xl:px-8"
            >
              <div className="flex w-full items-center">
                <WalletIcon
                  className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-[#50C8ED] dark:text-gray-300 dark:group-hover:text-[#50C8ED]"
                  aria-hidden="true"
                />
                <dt className="ml-[10px] text-sm font-bold leading-6 text-gray-500 dark:text-gray-300">
                  {'Wallet'}
                </dt>
              </div>
              {loadingWallets ? (
                <div className="h-10 w-40 animate-pulse rounded-md bg-gray-200 dark:bg-gray-600"></div>
              ) : (
                <dd className="w-full flex-none text-2xl font-medium leading-10 tracking-tight text-gray-900 dark:text-white">
                  {wallets[0].availableAmount
                    ? wallets[0].availableAmount
                    : '$ 0'}
                </dd>
              )}
            </div>

            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className=" space-y-1">
                    <NavLinks
                      setSidebarOpen={setSidebarOpen}
                      setOpenShoppingCart={setOpenShoppingCart}
                    />
                  </ul>
                </li>

                <li className="mt-auto">
                  <Link
                    href="/dashboard/contact-us"
                    onClick={() => {
                      console.log(
                        '/dashboard/contact-us  setSidebarOpen(false);',
                      );
                      setSidebarOpen(false);
                      setOpenShoppingCart(false);
                    }}
                    className={clsx(
                      'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition duration-300',
                      iContactUsActive
                        ? 'bg-black text-white dark:bg-white dark:text-black'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
                    )}
                  >
                    <PhoneIcon
                      className={clsx(
                        'w-6 transition duration-300',
                        iContactUsActive
                          ? 'text-white dark:text-black'
                          : 'text-gray-600 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white',
                      )}
                    />
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className=" lg:pl-72">
          {/* Static topbar for desktop */}
          <div
            //see if removing the z-index braks anything else
            className="sticky top-0 z-40 md:pt-4 lg:mx-auto lg:px-8"
          >
            <div className="flex h-16 items-center gap-x-4 bg-white px-4 shadow-sm dark:bg-gray-800 sm:gap-x-6 sm:px-6 md:rounded-md lg:shadow-none">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('clicks the Bars3Icon sidebar button');
                  setSidebarOpen((prev) => !prev);
                }}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon
                  className="pointer-events-none h-6 w-6 dark:text-gray-100 "
                  aria-hidden="true"
                />
              </button>

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-200 lg:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                {pathname !== '/dashboard/orders' && (
                  <div className=" flex w-full max-w-[400px] items-center">
                    {/* Search Input */}
                    <div className="relative flex w-full max-w-[400px] items-center">
                      <input
                        type="text"
                        placeholder="Search"
                        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black/70 dark:bg-gray-800 dark:text-white"
                        value={searchProductGroup}
                        onChange={handleSearchChange}
                        onFocus={() => setIsFocused(true)} // Input gained focus
                        onBlur={() => setIsFocused(false)} // Input lost focus
                      />

                      <button
                        disabled={true}
                        //onClick={handleSearchAction}
                        className="absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 transform"
                      >
                        <MagnifyingGlassIcon className="h-5 w-5" />
                      </button>
                      {/* Loading Indicator and Results */}
                      {isFocused && ( // Only show if input is focused
                        <>
                          {loading && (
                            <div className="absolute top-[100%] w-full rounded-md bg-gray-800 p-2 text-center text-white shadow-md">
                              Loading...
                            </div>
                          )}

                          {!loading && results.length > 0 && (
                            <ul className="absolute top-[100%] w-full rounded-md bg-white text-black shadow-md dark:bg-gray-800 dark:text-white">
                              {results.map((result: any, index) => (
                                <li
                                  key={index}
                                  className="flex cursor-pointer items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                  onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                                  onClick={(event) =>
                                    handleSearchItemClick(event, result)
                                  }
                                >
                                  {/* Product Group Logo */}
                                  {result.logo && (
                                    <img
                                      src={result.logo}
                                      alt={result.name}
                                      className="mr-3 h-6 w-6 rounded-md"
                                    />
                                  )}
                                  {/* Product Group Name */}
                                  <span>{result.name || 'Unnamed Result'}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}

                      {/* No Results */}
                      {!loading &&
                        searchProductGroup &&
                        results.length === 0 && (
                          <div className="absolute top-[100%] w-full max-w-[400px] rounded-md bg-gray-100 text-center text-sm text-gray-400 shadow-md">
                            No results found
                          </div>
                        )}
                    </div>
                  </div>
                )}

                <div className="ml-auto flex items-center gap-x-4 lg:gap-x-6">
                  <span className="sr-only">View notifications</span>
                  <ThemeToggle />

                  {/* Shopping Cart Button with Badge */}
                  <button
                    id="ShoppingBagIconButton"
                    onClick={() => setOpenShoppingCart(!openShoppingCart)}
                    type="button"
                    className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View picked items</span>
                    <ShoppingBagIcon
                      className=" h-6 w-6 dark:text-gray-100"
                      aria-hidden="true"
                    />
                    {totalItemsInCart > 0 && (
                      <span className="absolute right-1 top-1 flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] text-white">
                        {totalItemsInCart > 99 ? '99+' : totalItemsInCart}
                      </span>
                    )}
                  </button>

                  {/* Separator */}
                  <div
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                    aria-hidden="true"
                  />
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative">
                    <Menu.Button className="-m-1.5 flex items-center p-1.5">
                      <span className="sr-only">Open user menu</span>
                      {/* replace this image with the one of the user */}

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 dark:text-white">
                        <p className="text-blue-600">
                          {user?.name?.[0]?.toLocaleUpperCase() || ''}
                        </p>
                      </div>
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                          aria-hidden="true"
                        >
                          {user?.name || ''}
                        </span>
                        <ChevronDownIcon
                          className="ml-2 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className=" absolute right-0 z-10 mt-2.5  w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <button
                                onClick={item.action}
                                className={classNames(
                                  active ? 'bg-gray-50' : '',
                                  'block w-full px-3 py-1 text-sm leading-6 text-gray-900',
                                )}
                              >
                                {item.name}
                              </button>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl flex-row flex-wrap content-start items-start px-4 py-10 sm:px-6 lg:max-w-7xl lg:px-8">
            {children}
          </main>
          <ShoppingCartModal
            open={openShoppingCart}
            setOpen={setOpenShoppingCart}
          />
        </div>
      </>
    </>
  );
}
