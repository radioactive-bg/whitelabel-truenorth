'use client';
import SideNav from '@/app/ui/dashboard/sidenav';
import TailwindSideNav from '@/app/ui/dashboard/tailwindSideNav';
import { useEffect } from 'react';
import { authStore } from '@/state/auth';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { initializeAuth } = authStore() as { initializeAuth: () => void };

  useEffect(() => {
    initializeAuth(); // Initialize authentication state when component mounts
  }, []);
  return (
    <>
      <TailwindSideNav> {children}</TailwindSideNav>
      {/*<div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
       <div className="w-full flex-none md:w-64">
         <SideNav /> 
        
      </div> 
       <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div> 
    </div> */}
    </>
  );
}
