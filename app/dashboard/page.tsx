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

  const popularProducts = [
    {
      src: '/flightgift-popular.png',
      name: 'Flight Gift',
    },
    {
      src: '/Frame 26086500-popular.png',
      name: 'Hotel Gift',
    },
    {
      src: '/rewarble-popular.png',
      name: 'Rewarble',
    },
    {
      src: '/stel-hosting-popular.png',
      name: 'Stel Hosting',
    },
    {
      src: '/tripgift-popular.png',
      name: 'Trip Gift',
    },
    {
      src: '/activitygift.png',
      name: 'Activity Gift',
    },
  ];

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
      router.push('/');
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
      {/* Popular Products Banner */}
      <section
        className="my-3 w-full rounded-md py-8"
        style={{
          background: '#1b3b67',
        }}
      >
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col items-center justify-between gap-3">
            <h2 className="text-5xl font-bold text-background dark:text-white">
              Popular Products
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {popularProducts.map((product, index) => (
              <div
                key={index}
                className="group relative h-[150px] w-[150px] transform cursor-pointer overflow-hidden rounded-2xl bg-white p-2 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {loadingStates[index] && (
                    <div className="absolute h-full w-full animate-pulse bg-gray-300 dark:bg-gray-700"></div>
                  )}
                  <Image
                    src={product.src}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                    onLoad={() => handleImageLoad(index)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-center text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="flex w-full flex-col items-center justify-center overflow-hidden rounded-md 
        md:!min-h-[400px] md:min-w-0"
        style={{
          background:
            'linear-gradient(135deg,#a5d36b 10%, #0d9551 50%, #0b2a62 100%)',
        }}
      >
        <div className="container mt-16 flex flex-col items-center px-4 text-center md:mt-0 md:items-start md:px-6">
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
    </>
  );
}
