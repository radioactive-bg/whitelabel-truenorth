'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useThemeStore } from '@/state/theme'; // Import the theme store

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  //const currentPath = router.pathname;
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // Determine the status based on the current path
  const steps = [
    {
      id: 'Step 1',
      name: 'Checkout',
      href: '/dashboard/checkout',
      status: pathname === '/dashboard/checkout' ? 'current' : 'complete',
    },
    {
      id: 'Step 2',
      name: 'Payment',
      href: '/dashboard/checkout/payment',
      status:
        pathname === '/dashboard/checkout/payment'
          ? 'current'
          : pathname === '/dashboard/checkout'
          ? 'upcoming'
          : 'complete',
    },
    {
      id: 'Step 3',
      name: 'Download',
      href: '/dashboard/checkout/downloadCodes',
      status:
        pathname === '/dashboard/checkout/downloadCodes'
          ? 'current'
          : 'upcoming',
    },
  ];

  return (
    <div className={`w-full  rounded-md`}>
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step) => (
            <li key={step.name} className="md:flex-1">
              {step.status === 'complete' ? (
                <Link
                  href={
                    step.href !== '/dashboard/checkout/checkout'
                      ? '#'
                      : step.href
                  }
                >
                  <p
                    className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                      isDark
                        ? 'border-gray-500 hover:border-gray-400'
                        : 'border-black hover:border-black/70'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isDark
                          ? 'text-gray-300 group-hover:text-gray-100'
                          : 'text-black group-hover:text-indigo-800'
                      }`}
                    >
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </p>
                </Link>
              ) : step.status === 'current' ? (
                <Link
                  href={
                    step.href !== '/dashboard/checkout/checkout'
                      ? '#'
                      : step.href
                  }
                >
                  <p
                    className={`flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                      isDark ? 'border-white' : 'border-black'
                    }`}
                    aria-current="step"
                  >
                    <span
                      className={`text-sm font-medium ${
                        isDark ? 'text-white' : 'text-black'
                      }`}
                    >
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </p>
                </Link>
              ) : (
                <Link
                  href={
                    step.href !== '/dashboard/checkout/checkout'
                      ? '#'
                      : step.href
                  }
                >
                  <p
                    className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                      isDark
                        ? 'border-gray-700 hover:border-gray-500'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${
                        isDark
                          ? 'text-gray-400 group-hover:text-gray-200'
                          : 'text-gray-500 group-hover:text-gray-700'
                      }`}
                    >
                      {step.id}
                    </span>
                    <span className="text-sm font-medium">{step.name}</span>
                  </p>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="mt-4 rounded-md">{children}</div>
    </div>
  );
};

export default Layout;
