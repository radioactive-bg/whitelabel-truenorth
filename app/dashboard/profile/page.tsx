'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  FolderIcon,
  GlobeAltIcon,
  ServerIcon,
  SignalIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';

import { userStore, getUserProfile } from '@/state/user';
import { User } from '@/app/lib/types/user';
import Image from 'next/image';


const navigation = [
  { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  { name: 'Deployments', href: '#', icon: ServerIcon, current: false },
  { name: 'Activity', href: '#', icon: SignalIcon, current: false },
  { name: 'Domains', href: '#', icon: GlobeAltIcon, current: false },
  { name: 'Usage', href: '#', icon: ChartBarSquareIcon, current: false },
  { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: true },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function Example() {
  const { user, setUser } = userStore() as {
    user: User;
    setUser: (user: User) => void;
  };

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [enable2FA, setEnable2FA] = useState(false);

  useEffect(() => {
    getUserProfile(localStorage.getItem('access_token') as string);
  }, []);

  return (
    <>
      <div>
        <main>
          <h1 className="sr-only">Account Settings</h1>

          {/* Settings forms */}
          <div className="divide-y divide-white/5">
            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base font-semibold leading-7 text-black">
                  Personal Information
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Use a permanent address where you can receive mail.
                </p>
              </div>

              <form className="md:col-span-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full flex items-center gap-x-8">
                    <Image
                      width={80}
                      height={80}

                      alt=""
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
                    />
                    <div>
                      <button
                        type="button"
                        className="bg-indigo/10 rounded-md px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-white/20"
                      >
                        Change avatar
                      </button>
                      <p className="mt-2 text-xs leading-5 text-gray-400">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-full">
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium leading-6 text-black"
                    >
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        id="first-name"
                        name="first-name"
                        type="text"
                        autoComplete="given-name"
                        className=" block w-full rounded-md border border-indigo-600 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 hover:border-indigo-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-black"
                    >
                      Email address
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className="block w-full rounded-md border border-indigo-600 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 hover:border-indigo-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                    <div className="mt-4 flex items-center gap-x-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-black"
                      >
                        2FA Status
                      </label>
                      <Switch
                        checked={enable2FA}
                        onChange={setEnable2FA}
                        className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
                      >
                        <span className="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                        />
                      </Switch>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-black"
                      >
                        {enable2FA ? 'Enabled' : 'Disabled'}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>

            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base font-semibold leading-7 text-black">
                  Change password
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Update your password associated with your account.
                </p>
              </div>

              <form className="md:col-span-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="current-password"
                      className="block text-sm font-medium leading-6 text-black"
                    >
                      Current password
                    </label>
                    <div className="mt-2">
                      <input
                        id="current-password"
                        name="current_password"
                        type="password"
                        autoComplete="current-password"
                        className="block w-full rounded-md border border-indigo-600 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 hover:border-indigo-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="new-password"
                      className="block text-sm font-medium leading-6 text-black"
                    >
                      New password
                    </label>
                    <div className="mt-2">
                      <input
                        id="new-password"
                        name="new_password"
                        type="password"
                        autoComplete="new-password"
                        className="block w-full rounded-md border border-indigo-600 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 hover:border-indigo-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium leading-6 text-black"
                    >
                      Confirm password
                    </label>
                    <div className="mt-2">
                      <input
                        id="confirm-password"
                        name="confirm_password"
                        type="password"
                        autoComplete="new-password"
                        className="block w-full rounded-md border border-indigo-600 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 hover:border-indigo-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>

            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base font-semibold leading-7 text-black">
                  Log out other sessions
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  Please enter your password to confirm you would like to log
                  out of your other sessions across all of your devices.
                </p>
              </div>

              <form className="md:col-span-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
                  <div className="col-span-full">
                    <label
                      htmlFor="logout-password"
                      className="block text-sm font-medium leading-6 text-black"
                    >
                      Your password
                    </label>
                    <div className="mt-2">
                      <input
                        id="logout-password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        className="block w-full rounded-md border border-indigo-600 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 hover:border-indigo-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Log out other sessions
                  </button>
                </div>
              </form>
            </div>

            <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
              <div>
                <h2 className="text-base font-semibold leading-7 text-black">
                  Delete account
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-400">
                  No longer want to use our service? You can delete your account
                  here. This action is not reversible. All information related
                  to this account will be deleted permanently.
                </p>
              </div>

              <form className="flex items-center md:col-span-2">
                <button
                  type="submit"
                  className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-400"
                >
                  Yes, delete my account
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
