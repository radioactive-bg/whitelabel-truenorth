'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import TagManager from 'react-gtm-module';
import LogoWhite from '@/app/ui/logo-white';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function Page() {
  const [isStaging, setIsStaging] = useState(false);
  const router = useRouter(); // Initialize the router

  // useEffect(() => {
  //   router.push('/login'); // Redirect to /login
  // }, []);

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
      <div className="flex w-full  flex-col justify-between bg-gradient-to-t from-white to-blue-700 px-8 py-8 md:order-last md:h-full md:w-1/2 lg:px-16 lg:py-16">
        {/* Logo at the top */}
        <div className="flex justify-start">
          <LogoWhite />
        </div>

        {/* Content at the bottom */}
        <div className="flex flex-col items-start text-left lg:pb-12">
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-black sm:mt-6 md:text-5xl">
            Distribution Hub
          </h1>
          <p className="mt-4 text-lg leading-8 text-black md:text-2xl">
            Empower your business with streamlined distribution of digital
            products
          </p>
        </div>
      </div>
      {/* Left Section - Button Centered */}
      <div className="flex h-1/3 w-full items-center justify-center bg-white md:h-full md:w-1/2 md:items-center">
        <div className="max-w-[400px]">
          <Link
            href="/login"
            className="text-m rounded-md bg-black px-6 py-3 font-semibold text-white shadow-sm hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
