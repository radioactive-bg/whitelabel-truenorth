'use client';
import { useEffect } from 'react';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CatalogPage() {
  const router = useRouter();
  const { auth, initializeAuth } = authStore() as {
    auth: Auth;
    initializeAuth: () => void;
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
          backgroundImage:
            'url(https://hksglobal.group/wp-content/uploads/2024/07/product-hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '400px',
        }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="test">
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
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">
            Featured Categories
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div
              className="relative overflow-hidden rounded-lg"
              style={{
                backgroundImage:
                  'url(https://hksglobal.group/wp-content/uploads/2024/07/cd-keys.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '200px',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <h3 className="text-lg font-medium text-background md:text-xl">
                  Birthday
                </h3>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-lg"
              style={{
                backgroundImage:
                  'url(https://hksglobal.group/wp-content/uploads/2024/07/airtime.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '200px',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <h3 className="text-lg font-medium text-background md:text-xl">
                  Holiday
                </h3>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-lg"
              style={{
                backgroundImage:
                  'url(https://hksglobal.group/wp-content/uploads/2024/07/prepaid-cards.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '200px',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <h3 className="text-lg font-medium text-background md:text-xl">
                  Thank You
                </h3>
              </div>
            </div>

            <div
              className="relative overflow-hidden rounded-lg"
              style={{
                backgroundImage:
                  'url(https://hksglobal.group/wp-content/uploads/2024/07/gift-cards-item.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '200px',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <h3 className="text-lg font-medium text-background md:text-xl">
                  Congratulations
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="rounded bg-muted py-16 md:py-24">
        <div className="container mx-auto rounded-md px-4 md:px-6">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">
            Popular Brands
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6">
            <div className="flex items-center justify-center">
              <img
                src="https://hksglobal.group/wp-content/uploads/2024/07/gift-card-10.png"
                alt="Brand 1"
                width={120}
                height={60}
                className="h-auto w-full rounded-md object-contain"
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://hksglobal.group/wp-content/uploads/2024/07/gift-card-1.png"
                alt="Brand 2"
                width={120}
                height={60}
                className="h-auto w-full rounded-md object-contain"
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://hksglobal.group/wp-content/uploads/2024/07/gift-card-15.png"
                alt="Brand 3"
                width={120}
                height={60}
                className="h-auto w-full rounded-md object-contain"
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://hksglobal.group/wp-content/uploads/2024/07/gift-card-16.png"
                alt="Brand 4"
                width={120}
                height={60}
                className="h-auto w-full rounded-md object-contain"
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://hksglobal.group/wp-content/uploads/2024/07/gift-card-4.png"
                alt="Brand 5"
                width={120}
                height={60}
                className="h-auto w-full rounded-md object-contain"
              />
            </div>
            <div className="flex items-center justify-center">
              <img
                src="https://hksglobal.group/wp-content/uploads/2024/07/gift-card-2.png"
                alt="Brand 6"
                width={120}
                height={60}
                className="h-auto w-full rounded-md object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
