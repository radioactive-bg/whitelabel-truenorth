'use client';
import { useEffect } from 'react';
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
                backgroundImage: 'url(/cd-keys.webp)',
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
                backgroundImage: 'url(/airtime.webp)',
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
                backgroundImage: 'url(/prepaid-cards.webp)',
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
                backgroundImage: 'url(/gift-cards-item.webp)',
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
            <Link
              href="/dashboard/catalog?ProductGroup=Amazon US"
              prefetch={false}
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/gift-card-10.webp"
                  alt="Brand 1"
                  width={120}
                  height={60}
                  className="h-auto w-full rounded-md object-contain"
                />
              </div>
            </Link>
            <Link href="/dashboard/catalog?ProductGroup=PSN" prefetch={false}>
              <div className="flex items-center justify-center">
                <Image
                  src="https://crm-duegate-public-staging.s3.eu-central-1.amazonaws.com/product_group_logo/1400cd8f-bcca-47fc-9476-afd3ca52f9bd.png"
                  alt="Brand 2"
                  width={120}
                  height={60}
                  className="h-auto w-full rounded-md object-contain"
                />
              </div>
            </Link>
            <Link
              href="/dashboard/catalog?ProductGroup=Google Play USA"
              prefetch={false}
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/gift-card-15.webp"
                  alt="Brand 3"
                  width={120}
                  height={60}
                  className="h-auto w-full rounded-md object-contain"
                />
              </div>
            </Link>
            <Link
              href="/dashboard/catalog?ProductGroup=Apple Card US"
              prefetch={false}
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/gift-card-16.webp"
                  alt="Brand 4"
                  width={120}
                  height={60}
                  className="h-auto w-full rounded-md object-contain"
                />
              </div>
            </Link>
            <Link
              href="/dashboard/catalog?ProductGroup=Steam USA"
              prefetch={false}
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/gift-card-4.webp"
                  alt="Brand 5"
                  width={120}
                  height={60}
                  className="h-auto w-full rounded-md object-contain"
                />
              </div>
            </Link>
            <Link
              href="/dashboard/catalog?ProductGroup=Nintendo"
              prefetch={false}
            >
              <div className="flex items-center justify-center">
                <Image
                  src="/gift-card-2.webp"
                  alt="Brand 6"
                  width={120}
                  height={60}
                  className="h-auto w-full rounded-md object-contain"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
