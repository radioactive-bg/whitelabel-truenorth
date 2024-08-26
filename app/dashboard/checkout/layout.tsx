'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  //const currentPath = router.pathname;

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
    <div>
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {step.status === 'complete' ? (
                <Link
                  href={
                    step.href !== '/dashboard/checkout/checkout'
                      ? '#'
                      : step.href
                  }
                >
                  <p className="group flex flex-col border-l-4 border-indigo-600 py-2 pl-4 hover:border-indigo-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800">
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
                    className="flex flex-col border-l-4 border-indigo-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                    aria-current="step"
                  >
                    <span className="text-sm font-medium text-indigo-600">
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
                  <p className="group flex flex-col border-l-4 border-gray-200 py-2 pl-4 hover:border-gray-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
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
      <div>{children}</div>
    </div>
  );
};

export default Layout;
