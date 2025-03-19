'use client';

import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/20/solid';

interface NotificationProps {
  message: string;
  subMessage?: string;
  type: 'success' | 'error';
}

export default function Notification({
  message,
  subMessage,
  type,
}: NotificationProps) {
  const [show, setShow] = useState(true);

  const icon =
    type === 'success' ? (
      <CheckCircleIcon aria-hidden="true" className="h-6 w-6 text-green-400" />
    ) : (
      <XMarkIcon aria-hidden="true" className="h-5 w-5 text-red-400" />
    );

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-[45] mb-4 flex items-end sm:mb-0 sm:items-start sm:p-4"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={show}
          enter="transform ease-out duration-300 transition"
          enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          enterTo="translate-y-0 opacity-100 sm:translate-x-0"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 dark:bg-gray-800 dark:ring-gray-700">
            <div className="p-4">
              <div className="flex items-start">
                <div className="shrink-0">{icon}</div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {message}
                  </p>
                  {subMessage && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {subMessage}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex shrink-0">
                  <button
                    type="button"
                    onClick={() => setShow(false)}
                    className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-gray-200"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon aria-hidden="true" className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
}
