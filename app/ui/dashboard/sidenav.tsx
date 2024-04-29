'use client';
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import Logo from '@/app/ui/logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { use } from 'react';

import { userStore } from '@/state/user';
import { authStore, Auth } from '@/state/auth';
import { User } from '@/app/lib/types/user';
import { useRouter } from 'next/navigation';

export default function SideNav() {
  const { auth, setAuth } = authStore() as {
    auth: Auth;
    setAuth: (auth: Auth) => void;
  };
  const router = useRouter();

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

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className=" mb-2 flex h-20 items-center justify-start rounded-md bg-gray-50 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <Logo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
            onClick={handleLogout}
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
