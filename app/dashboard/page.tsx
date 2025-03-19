'use client';
import { useEffect, useState } from 'react';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductGroups } from '@/app/lib/api/filters';

export default function CatalogPage() {
  const router = useRouter();
  const { auth, initializeAuth } = authStore() as {
    auth: Auth;
    initializeAuth: () => void;
  };

  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(6).fill(true),
  );

  const [brands, setBrands] = useState([
    { src: '/amazon-fb-cat.png', name: 'Amazon', href: '/dashboard/catalog' },
    {
      src: '/playstation-store-fb-cat.png',
      name: 'PSN',
      href: '/dashboard/catalog',
    },
    {
      src: '/google-play-fb-cat.png',
      name: 'Google Play',
      href: '/dashboard/catalog',
    },
    {
      src: '/appstore-fb-cat.png',
      name: 'Apple Card',
      href: '/dashboard/catalog',
    },
    { src: '/steam-fb-cat.png', name: 'Steam', href: '/dashboard/catalog' },
    {
      src: '/nintendo-fb-cat.png',
      name: 'Nintendo',
      href: '/dashboard/catalog',
    },
  ]);

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
    if (!localValue) {
      router.push('/login');
      return;
    }
  }, [auth.access_token]);

  // Fetch product groups on page load and log the result
  useEffect(() => {
    const fetchProductGroups = async () => {
      try {
        const productGroups = await getProductGroups();
        console.log('Product Groups:', productGroups);

        // Update brands array with correct hrefs
        const updatedBrands = brands.map((brand) => {
          // Find a product group that matches the brand name
          const matchedGroup = Object.entries(productGroups).find(
            ([_, name]) =>
              typeof name === 'string' &&
              (name as string).toLowerCase().includes(brand.name.toLowerCase()),
          );

          return {
            ...brand,
            href: matchedGroup
              ? `/dashboard/catalog?ProductGroups=${encodeURIComponent(
                  matchedGroup[1] as string,
                )}`
              : '/dashboard/catalog', // Default if not found
          };
        });

        setBrands(updatedBrands);
      } catch (error) {
        console.error('Error fetching product groups:', error);
      }
    };

    fetchProductGroups();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section
        className="flex w-full flex-col items-center justify-center overflow-hidden  rounded 
        rounded-md from-primary to-primary-foreground dark:from-gray-900 dark:to-gray-700 md:!min-h-[400px] md:min-w-0 md:!bg-cover md:!bg-center"
        style={{
          backgroundImage: 'url(/products-hero.webp)',
          backgroundPosition: 'calc(100% + 75px) 0',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'auto 30vh',
          minHeight: 'calc(100vh - 120px)',
          backgroundColor: '#00060b',
        }}
      >
        <div className="container mt-16 flex flex-col  items-center px-4 text-center md:mt-0 md:items-start md:px-6">
          <h1 className="mb-4 text-3xl font-bold text-background dark:text-white sm:text-4xl md:text-5xl">
            Find the Perfect Gift Card
          </h1>
          <p className="mb-8 text-lg text-background/80 dark:text-gray-300 sm:text-xl">
            Browse our wide selection of gift cards for any occasion.
          </p>
          <Link
            href="/dashboard/catalog"
            className="inline-flex items-center justify-center rounded-md bg-background px-6 py-3 font-bold 
      text-primary hover:bg-background/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-background 
      focus-visible:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-white dark:focus-visible:ring-gray-600"
            prefetch={false}
          >
            Browse Gift Cards
          </Link>
        </div>
      </section>

      {/* Popular Brands Section */}
      {/* <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-2xl font-bold dark:text-white sm:text-3xl">
            Popular Brands
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {brands.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                prefetch={false}
                className="pointer-events-none"
              >
                <div className="relative flex items-center justify-center">
                  {loadingStates[index] && (
                    <div className="absolute h-[120px] w-full animate-pulse rounded-md bg-gray-300 dark:bg-gray-700 sm:h-[175px]"></div>
                  )}
                  <Image
                    src={item.src}
                    alt={item.name}
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
      </section> */}
    </>
  );
}
