'use client';
import { useEffect, useState } from 'react';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function CatalogPage() {
  const router = useRouter();
  const { auth, initializeAuth } = authStore() as {
    auth: Auth;
    initializeAuth: () => void;
  };

  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(6).fill(true),
  );

  const handleImageLoad = (index: number) => {
    setLoadingStates((prev) => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  useEffect(() => {
    initializeAuth();
    const localValue = localStorage.getItem('access_token') || '';
    if (localValue === '' || !localValue) {
      router.push('/login');
      return;
    }
  }, [auth.access_token]);

  return (
    <div>
      {/* Hero Section */}
      <section
        className="rounded bg-gradient-to-r from-primary to-primary-foreground py-20 dark:from-gray-900 dark:to-gray-700 md:py-32"
        style={{
          backgroundImage: 'url(/products-hero.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '400px',
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <h1 className="mb-4 text-4xl font-bold text-background dark:text-white sm:text-5xl md:text-6xl">
                Find the Perfect Gift Card
              </h1>
              <p className="mb-8 text-lg text-background/80 dark:text-gray-300 sm:text-xl">
                Browse our wide selection of gift cards for any occasion.
              </p>
              <Link
                href="/dashboard/catalog"
                className="inline-flex items-center justify-center rounded-md bg-background px-6 py-3 font-medium text-primary hover:bg-background/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:focus-visible:ring-gray-600"
                prefetch={false}
              >
                Browse Gift Cards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Brands Section */}
      <section className=" py-16  md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold dark:text-white sm:text-3xl">
            Popular Brands
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {[
              // Array of brands
              {
                href: '/dashboard/catalog?ProductGroups=Amazon US',
                src: '/amazon-fb-cat.png',
              },
              {
                href: '/dashboard/catalog?ProductGroups=PSN',
                src: '/playstation-store-fb-cat.png',
              },
              {
                href: '/dashboard/catalog?ProductGroups=Google Play USA',
                src: '/google-play-fb-cat.png',
              },
              {
                href: '/dashboard/catalog?ProductGroups=Apple Card US',
                src: '/appstore-fb-cat.png',
              },
              {
                href: '/dashboard/catalog?ProductGroups=Steam USA',
                src: '/steam-fb-cat.png',
              },
              {
                href: '/dashboard/catalog?ProductGroups=Nintendo',
                src: '/nintendo-fb-cat.png',
              },
            ].map((item, index) => (
              <Link key={index} href={item.href} prefetch={false}>
                <div className="relative flex items-center justify-center">
                  {loadingStates[index] && (
                    <div className="absolute h-[120px] w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700 sm:h-[175px]"></div>
                  )}
                  <Image
                    src={item.src}
                    alt={`Brand ${index + 1}`}
                    width={240}
                    height={240}
                    className={`h-auto w-full rounded-md object-contain transition-opacity duration-300 dark:bg-gray-800 ${
                      loadingStates[index] ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
