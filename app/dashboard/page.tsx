'use client';
import { useEffect, useState } from 'react';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductGroupsList } from '@/app/lib/api/productGroup';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useThemeStore } from '@/state/theme';

export default function CatalogPage() {
  const router = useRouter();
  const { auth, initializeAuth } = authStore() as {
    auth: Auth;
    initializeAuth: () => void;
  };
  const { theme } = useThemeStore();

  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(6).fill(true),
  );

  const [popularProducts, setPopularProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const baseColor = theme === 'dark' ? '#374151' : '#d1d5db';
  const highlightColor = theme === 'dark' ? '#4b5563' : '#e5e7eb';

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

    // Fetch product groups for popular products
    const fetchPopularProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProductGroupsList(400); // Get all products first
        if (response.data && response.data.data) {
          // Filter for specific product groups
          const specificGroups = [
            'Activity Gift',
            'Flight Gift',
            'Hotel Gift',
            'Rewarble',
            'Stel Hosting',
            'Trip Gift',
          ];

          const filteredProducts = response.data.data.filter((product: any) =>
            specificGroups.includes(product.name),
          );

          console.log('Filtered popular products:', filteredProducts);
          setPopularProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching popular products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularProducts();
  }, [auth.access_token]);

  const handleProductClick = (productName: string) => {
    // Create URLSearchParams to handle the parameters like the catalog page
    const params = new URLSearchParams();
    params.set('ProductGroups', productName);
    router.push(`/dashboard/catalog?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <>
        {/* Popular Products Banner Skeleton */}
        <section
          className="my-3 w-full rounded-md py-8"
          style={{
            background: '#1b3b67',
          }}
        >
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col items-center justify-between gap-3">
              <Skeleton
                height={48}
                width={300}
                baseColor={baseColor}
                highlightColor={highlightColor}
                className="bg-white/20"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="group relative h-[150px] w-[150px] transform cursor-pointer overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative h-full w-full overflow-hidden rounded-xl">
                    <div className="relative h-full w-full">
                      <Skeleton
                        height={150}
                        width={150}
                        baseColor={baseColor}
                        highlightColor={highlightColor}
                        className="h-full w-full rounded-xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="absolute bottom-0 left-0 right-0 top-0 text-center text-white opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <Skeleton
                          height={32}
                          width={120}
                          baseColor={baseColor}
                          highlightColor={highlightColor}
                          className="mx-auto bg-white/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Banner Section Skeleton */}
        <section
          className="flex w-full flex-col items-center justify-center overflow-hidden rounded-md 
          md:!min-h-[400px] md:min-w-0"
          style={{
            background:
              'linear-gradient(135deg,#a5d36b 10%, #0d9551 50%, #0b2a62 100%)',
          }}
        >
          <div className="container mt-16 flex flex-col items-center px-4 text-center md:mt-0 md:items-start md:px-6">
            <Skeleton
              height={48}
              width={400}
              baseColor={baseColor}
              highlightColor={highlightColor}
              className="mb-4 bg-white/20"
            />
            <Skeleton
              height={24}
              width={300}
              baseColor={baseColor}
              highlightColor={highlightColor}
              className="mb-8 bg-white/20"
            />
            <Skeleton
              height={48}
              width={200}
              baseColor={baseColor}
              highlightColor={highlightColor}
              className="bg-white/20"
            />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
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
                key={product.id}
                onClick={() => handleProductClick(product.name)}
                className="group relative h-[150px] w-[150px] transform cursor-pointer overflow-hidden rounded-2xl bg-white p-1 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  {loadingStates[index] && (
                    <div className="absolute h-full w-full animate-pulse bg-gray-300 dark:bg-gray-700"></div>
                  )}
                  <Image
                    src={product.logo || '/NoPhoto.jpg'}
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
