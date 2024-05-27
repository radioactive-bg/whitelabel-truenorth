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
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Catalog', href: '/dashboard/catalog', icon: BuildingStorefrontIcon },
  {
    name: 'Order List',
    href: '/dashboard/orders',
    icon: DocumentDuplicateIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        let isActive = pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',

              isActive
                ? 'bg-gray-50 text-[#50C8ED]'
                : 'text-gray-700 hover:bg-gray-50 hover:text-[#50C8ED]',
            )}
          >
            <LinkIcon className="w-6" />
            <p className=" md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
