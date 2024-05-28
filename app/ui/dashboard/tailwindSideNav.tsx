'use client';
import { Fragment, useEffect, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';

import NavLinks from '@/app/ui/dashboard/nav-links';
import Logo from '@/app/ui/logo';
import { authStore, Auth } from '@/state/auth';
import { userStore } from '@/state/user';
import { User } from '@/app/lib/types/user';
import { useRouter } from 'next/navigation';

import ShoppingCartModal from '../../ui/dashboard/shopingCart/shoppingCartModal';

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function TailwindSideNav({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openShoppingCart, setOpenShoppingCart] = useState(false);

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

  const handleUserProfile = () => {
    router.push('/dashboard/userProfile');
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

  const userNavigation = [
    { name: 'Your profile', action: handleUserProfile },
    { name: 'Sign out', action: handleLogout },
  ];

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            //see if removing the z-index braks anything else
            ///className="relative z-50 lg:hidden"
            className="relative lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <Logo />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            <NavLinks setSidebarOpen={setSidebarOpen} />
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <a
                            href=""
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-[#50C8ED]"
                          >
                            <Cog6ToothIcon
                              className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-[#50C8ED]"
                              aria-hidden="true"
                            />
                            Settings
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <Logo />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    <NavLinks setSidebarOpen={setSidebarOpen} />
                  </ul>
                </li>

                <li className="mt-auto">
                  <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-[#50C8ED]"
                  >
                    <Cog6ToothIcon
                      className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-[#50C8ED]"
                      aria-hidden="true"
                    />
                    Settings
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-72">
          {/* Static topbar for desktop */}
          <div
            //see if removing the z-index braks anything else
            //className="sticky top-0 z-40 lg:mx-auto lg:max-w-7xl lg:px-8"
            className="sticky top-0 lg:mx-auto lg:max-w-7xl lg:px-8"
          >
            <div className="flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
              <button
                type="button"
                className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Separator */}
              <div
                className="h-6 w-px bg-gray-200 lg:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                {/*added this div istead of the search bar*/}
                <div className="relative flex flex-1"></div>

                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <button
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setOpenShoppingCart(!openShoppingCart)}
                    type="button"
                    className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">View picked items</span>
                    <ShoppingBagIcon className="h-6 w-6" aria-hidden="true" />
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

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50">
                        <p className="text-blue-600">
                          {user.name[0].toLocaleUpperCase()}
                        </p>
                      </div>
                      <span className="hidden lg:flex lg:items-center">
                        <span
                          className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                          aria-hidden="true"
                        >
                          {user.name}
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

          <main className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              {children}
            </div>
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
