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

  // Image loading states
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(6).fill(true),
  );

  const handleImageLoad = (index: number) => {
    setLoadingStates((prev) => {
      const newState = [...prev];
      newState[index] = false; // Set the state to false when the image loads
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
      <section
        className="rounded bg-gradient-to-r from-primary to-primary-foreground py-20 md:py-32"
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
              <h1 className="mb-4 text-4xl font-bold text-background md:text-6xl">
                Find the Perfect Gift Card
              </h1>
              <p className="mb-8 text-lg text-background/80 md:text-xl">
                Browse our wide selection of gift cards for any occasion.
              </p>
              <Link
                href="/dashboard/catalog"
                className="inline-flex items-center justify-center rounded-md bg-background px-6 py-3 font-medium text-primary hover:bg-background/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2"
                prefetch={false}
              >
                Browse Gift Cards
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Brands Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">
            Popular Brands
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
            {[
              // Array of brands
              {
                href: '/dashboard/catalog?ProductGroups=Amazon US',
                src: '/gift-card-10.webp',
              },
              {
                href: '/dashboard/catalog?ProductGroups=PSN',
                src: 'https://crm-duegate-public-staging.s3.eu-central-1.amazonaws.com/product_group_logo/1400cd8f-bcca-47fc-9476-afd3ca52f9bd.png',
              },
              {
                href: '/dashboard/catalog?ProductGroups=Google Play USA',
                src: '/gift-card-15.webp',
              },
              {
                href: '/dashboard/catalog?ProductGroups=Apple Card US',
                src: '/gift-card-16.webp',
              },
              {
                href: '/dashboard/catalog?ProductGroups=Steam USA',
                src: '/gift-card-4.webp',
              },
              {
                href: '/dashboard/catalog?ProductGroups=Nintendo',
                src: '/gift-card-2.webp',
              },
            ].map((item, index) => (
              <Link key={index} href={item.href} prefetch={false}>
                <div className="relative flex items-center justify-center">
                  {loadingStates[index] && (
                    <div className="absolute h-[175px] w-full animate-pulse rounded-md bg-gray-300"></div>
                  )}
                  <Image
                    src={item.src}
                    alt={`Brand ${index + 1}`}
                    width={120}
                    height={120}
                    className={`h-auto w-full rounded-md object-contain ${
                      loadingStates[index] ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={() => handleImageLoad(index)} // Track image load
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
