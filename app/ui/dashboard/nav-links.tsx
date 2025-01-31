'use client';
import {
  HomeIcon,
  DocumentDuplicateIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { id: 'HomeButton', name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    id: 'CatalogButton',
    name: 'Catalog',
    href: '/dashboard/catalog',
    icon: BuildingStorefrontIcon,
  },
  {
    id: 'OrderListButton',
    name: 'Order List',
    href: '/dashboard/orders',
    icon: DocumentDuplicateIcon,
  },
];

export default function NavLinks({
  setSidebarOpen,
  setOpenShoppingCart,
}: {
  setSidebarOpen: (open: any) => void;
  setOpenShoppingCart: (open: any) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        let isActive = pathname === link.href;

        return (
          <Link
            id={link.id}
            key={link.name}
            href={link.href}
            onClick={() => {
              setSidebarOpen(false);
              setOpenShoppingCart(false);
            }}
            className={clsx(
              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition duration-300',
              isActive
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700',
            )}
          >
            <LinkIcon
              className={clsx(
                'w-6 transition duration-300',
                isActive
                  ? 'text-white dark:text-black'
                  : 'text-gray-600 group-hover:text-black dark:text-gray-300 dark:group-hover:text-white',
              )}
            />
            <p className="md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
