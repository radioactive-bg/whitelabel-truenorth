'use client';
import TailwindSideNav from '@/app/ui/dashboard/tailwindSideNav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TailwindSideNav>{children}</TailwindSideNav>
    </>
  );
}
