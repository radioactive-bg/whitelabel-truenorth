'use client';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { roboto } from '@/app/ui/fonts';
import Logo from '@/app/ui/logo';
import Image from 'next/image';

import userImage from '@/public/young-man-working.jpg';

export default function Page() {
  return (
    <main className="flex h-screen w-screen flex-col p-6">
      <div className="relative h-full w-full bg-white">
        <div className="mx-auto h-full max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
          <div className="justify-top flex h-full flex-col px-6 pt-10 sm:pt-32 lg:col-span-7 lg:px-0 lg:pt-24 xl:col-span-6">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <Logo />
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:mt-10 sm:text-6xl">
                Distribution Hub
              </h1>
              <p className="mt-6 whitespace-nowrap text-lg leading-8  text-gray-600">
                Empower your business with streamlined distribution of digital
                products
              </p>
              <div className="mt-10 flex items-center gap-x-6">
                <Link
                  href="/login"
                  className="text-m rounded-md bg-[#50C8ED] px-3.5 py-2.5 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
          <div className="relative lg:col-span-5 xl:absolute xl:inset-0 xl:left-1/2">
            <Image
              className="lg:aspect-auto aspect-[3/2] bg-gray-50 object-cover lg:absolute lg:inset-0"
              style={{ width: '80vw', height: '80vh' }} // 80% of the viewport width and height
              width={800}
              height={800}
              src="https://images.unsplash.com/photo-1498758536662-35b82cd15e29?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2102&q=80"
              alt="home img"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
