'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TagManager from 'react-gtm-module';
import LogoWhite from '@/app/ui/logo-white';

export default function Page() {
  const [isStaging, setIsStaging] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    router.push('/login');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.origin === 'https://staging.b2b.hksglobal.group') {
        setIsStaging(true);
      }
    }

    TagManager.initialize({ gtmId: 'GTM-5JLP32N8' });
  }, []);

  return (
    <main className="flex h-screen w-screen flex-col flex-wrap md:flex-row">
      {/* Right Section with Dynamic Login Content */}
      <div
        className="flex w-full flex-col justify-between px-8 py-8 md:order-last md:h-full md:w-1/2 lg:px-16 lg:py-16"
        style={{
          background:
            'linear-gradient(135deg, white 0%,#0d9551 50%, #000000 100%)',
        }}
      >
        {/* Logo at the top */}
        <div className="flex justify-start">
          <LogoWhite />
        </div>

        {/* Content at the bottom */}
        <div className="flex flex-col items-start text-left lg:pb-12">
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:mt-6 md:text-5xl">
            Distribution Hub
          </h1>
          <p className="mt-4 text-lg leading-8 text-white md:text-2xl">
            Empower your business with streamlined distribution of digital
            products
          </p>
        </div>
      </div>
      {/* Left Section - Loading State */}
      <div className="flex h-1/3 w-full items-center justify-center bg-white md:h-full md:w-1/2 md:items-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    </main>
  );
}
