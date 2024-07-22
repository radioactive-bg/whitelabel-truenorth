'use client';
//import { useRouter } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  // const router = useRouter();

  const secondaryNavigation = [
    { name: 'Account', href: '/dashboard/profile', current: true },
    {
      name: 'Notifications',
      href: '/dashboard/profile/notifications',
      current: false,
    },
    { name: 'Billing', href: '/dashboard/profile/billing', current: false },
    { name: 'Teams', href: '/dashboard/profile/teams', current: false },
    {
      name: 'Integrations',
      href: '/dashboard/profile/integrations',
      current: false,
    },
  ];

  return (
    <>
      <main>
        <h1 className="sr-only">Account Settings</h1>

        <header className="border-b border-white/5">
          {/* Secondary navigation */}
          <nav className="flex overflow-x-auto py-4">
            <ul
              role="list"
              className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
            >
              {secondaryNavigation.map((item) => (
                <li key={item.name}>
                  <Link href={item.href}>
                    <p className={item.current ? 'text-indigo-400' : ''}>
                      {item.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        {children}
      </main>
    </>
  );
}
