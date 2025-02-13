'use client';
import { useState, useEffect, Fragment, Suspense } from 'react';
import { authStore, Auth } from '@/state/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import { Dialog, Transition } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

//import { filters } from '@/app/lib/constants';
import { getRegions, getCurrencies } from '@/app/lib/api/filters';
import { getProductGroupsList } from '@/app/lib/api/productGroup';

import FilterPopover from '@/app/ui/dashboard/catalog/FilterPopover';
import ProductsTable from '@/app/ui/dashboard/catalog/ProductsTable';

import { CatalogSkeleton } from '@/app/ui/skeletons';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const Catalog = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // filter states
  const [allFilters, setAllFilters] = useState<any[] | null>(null);

  // const [allFilters, setAllFilters] = useState<any[]>(() => {
  //   if (typeof window !== 'undefined') {
  //     const storedFilters = localStorage.getItem('catalogFilters');
  //     const accessTokenExpires = localStorage.getItem('access_token_expires');
  //     const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

  //     if (
  //       storedFilters &&
  //       accessTokenExpires &&
  //       parseInt(accessTokenExpires) > currentTime
  //     ) {
  //       try {
  //         console.log('returns stored filters');
  //         return JSON.parse(storedFilters);
  //       } catch (error) {
  //         console.error(
  //           'Error parsing catalogFilters from localStorage:',
  //           error,
  //         );
  //         return filters; // Fallback to default filters if parsing fails
  //       }
  //     }
  //   }

  //   return filters; // Default filters for SSR
  // });

  //const [updatedAllFilters, setUpdatedAllFilters] = useState(filters);
  const [filtersActive, setFiltersActive] = useState(false);

  const router = useRouter();

  const searchParams = useSearchParams();

  const { auth, initializeAuth } = authStore() as {
    auth: Auth;
    initializeAuth: () => void;
  };

  const [hasFetchedFilters, setHasFetchedFilters] = useState(false);

  const [forceUpdate, setForceUpdate] = useState(false);
  const triggerUpdate = () => {
    setForceUpdate((prev) => !prev);
  };

  useEffect(() => {
    const initializeFilters = async () => {
      // Only fetch if we haven't fetched filters before
      if (hasFetchedFilters) return; // Prevent re-fetch
      setLoading(true);
      try {
        await fetchAndBuildFilters();

        console.log('filters initialized');
        const productGroup = findQueryParam('ProductGroups');
        const denominationCurrency = findQueryParam('DenominationCurrencys');
        const activationRegion = findQueryParam('ActivationRegions');
        if (productGroup && productGroup.trim() !== '') {
          console.log(
            'fetchProductsFromQuery in useEffect initializeFilters :',
          );
          await fetchProductsFromQuery(
            productGroup,
            denominationCurrency,
            activationRegion,
          );
        }
        setHasFetchedFilters(true); // Mark as fetched
      } catch (error) {
        console.error('Failed to initialize filters:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeFilters();
  }, []);

  useEffect(() => {
    const productGroups = findQueryParam('ProductGroups');
    const denominationCurrency = findQueryParam('DenominationCurrencys');
    const activationRegions = findQueryParam('ActivationRegions');

    // Only call fetchProductsFromQuery if at least one parameter has a value
    if (!productGroups && !denominationCurrency && !activationRegions) return;

    fetchProductsFromQuery(
      productGroups,
      denominationCurrency,
      activationRegions,
    );
  }, [searchParams]);

  useEffect(() => {
    initializeAuth();
    const localValue = localStorage.getItem('access_token') || 'no value';
    //console.log('localValue in catalog: ', localValue);
    if (!localValue) {
      router.push('/login');
      return;
    }
  }, [auth.access_token]);

  const findQueryParam = (param: string) => {
    if (typeof window === 'undefined') return ''; // Prevent server-side errors
    const searchParams = new URLSearchParams(window.location.search);
    const value = searchParams.get(param) || '';
    return value.trim() || ''; // Normalize whitespace or empty values to an empty string
  };

  const fetchAndBuildFilters = async () => {
    try {
      const storedFilters = localStorage.getItem('catalogFilters');
      const accessTokenExpires = localStorage.getItem('access_token_expires');
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

      console.log('Access Token Expiry:', accessTokenExpires);
      console.log('Current Time:', currentTime);

      // Check if access token has expired
      if (accessTokenExpires && parseInt(accessTokenExpires) > currentTime) {
        if (storedFilters) {
          const parsedFilters = JSON.parse(storedFilters);
          console.log('Using stored filters from localStorage:', parsedFilters);
          setAllFilters(parsedFilters);
          return;
        }
      }

      const [productGroupsResponse, regionsResponse, currenciesResponse] =
        await Promise.all([
          getProductGroupsList(400),
          getRegions(),
          getCurrencies(),
        ]);

      console.log('regionsResponse: ' + JSON.stringify(regionsResponse));
      console.log('currenciesResponse: ' + JSON.stringify(currenciesResponse));

      const filters = [
        {
          id: 'Product Group',
          name: 'Product Group',
          options: productGroupsResponse.data.data.map((group: any) => ({
            value: group.id.toString(),
            label: group.name,
            checked: false,
            logo: group.logo || null,
          })),
        },
        {
          id: 'Activation Region',
          name: 'Activation Region',
          options: Object.entries(regionsResponse)
            .filter(([key, value]) => typeof value === 'string')
            .map(([key, value]) => ({
              value: key,
              label: value,
              checked: false,
            })),
        },
        {
          id: 'Denomination Currency',
          name: 'Denomination Currency',
          options: Object.entries(currenciesResponse)
            .filter(([key, value]) => typeof value === 'string')
            .map(([key, value]) => ({
              value: key,
              label: value,
              checked: false,
            })),
        },
      ];

      console.log('Built filters:', filters);
      setAllFilters(filters);
      localStorage.setItem('catalogFilters', JSON.stringify(filters));
      console.log('Product Group Options:', filters[0].options);
    } catch (error) {
      console.error('Error fetching filters:', error);
      throw error;
    }
  };

  const fetchProductsFromQuery = async (
    productGroups: any,
    denominationCurrency: any,
    activationRegion: any,
  ) => {
    setLoading(true);
    try {
      const productGroupsArray = productGroups ? productGroups.split(',') : [];
      const currenciesArray = denominationCurrency
        ? denominationCurrency.split(',')
        : [];
      const regionsArray = activationRegion ? activationRegion.split(',') : [];

      const newAllFilters = allFilters?.map((filter) => {
        if (filter.id === 'Product Group') {
          return {
            ...filter,
            options: filter.options.map((option: any) => ({
              ...option,
              checked: productGroupsArray.includes(option.label),
            })),
          };
        }
        if (filter.id === 'Denomination Currency') {
          return {
            ...filter,
            options: filter.options.map((option: any) => ({
              ...option,
              checked: currenciesArray.includes(option.label),
            })),
          };
        }
        if (filter.id === 'Activation Region') {
          return {
            ...filter,
            options: filter.options.map((option: any) => ({
              ...option,
              checked: regionsArray.includes(option.label),
            })),
          };
        }
        return filter;
      });

      setAllFilters(newAllFilters ? newAllFilters : []);
      console.log('fetchProductsFromQuery setFiltersActive(true);');
      setFiltersActive(true);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProductGroupIcon = (productLabel: any) => {
    console.log('handleSelectProductGroupIcon productLabel: ', productLabel);
    let newAllFilters = allFilters?.map((filter) => {
      if (filter.id === allFilters[0].id) {
        let newOptions = filter.options.map((option: any) => {
          if (option.label === productLabel) {
            return {
              ...option,
              checked: true,
            };
          }
          return option;
        });
        return { ...filter, options: newOptions };
      }
      return filter;
    });

    setAllFilters(newAllFilters ? newAllFilters : []);
    console.log('handleSelectProductGroupIcon setFiltersActive(true);');
    setFiltersActive(true);

    const currentParams = new URLSearchParams(window.location.search);
    let productGroups = currentParams.get('ProductGroups') || '';

    if (!productGroups.split(',').includes(productLabel)) {
      productGroups = productGroups
        ? `${productGroups},${productLabel}`
        : productLabel;
    }

    currentParams.set('ProductGroups', productGroups);
    window.history.pushState({}, '', `?${currentParams.toString()}`);
  };

  const checkIfAnyFiltersActive = () => {
    console.log('checkIfAnyFiltersActive');
    console.log('allfilters: ' + allFilters);
    console.log('allfilters.length: ' + allFilters?.length);

    const isActive = allFilters?.some((filter) =>
      filter.options.some((option: any) => option.checked),
    );
    console.log('isActive: ' + isActive);
    setFiltersActive(isActive ? isActive : false);
  };

  return (
    <div className="w-full ">
      <main className="mx-auto max-w-2xl rounded-md bg-white px-4 dark:bg-gray-800 lg:max-w-7xl lg:px-8">
        {loading === true ? (
          <CatalogSkeleton />
        ) : (
          <>
            {/* Mobile filter dialog */}
            <Transition.Root show={mobileFiltersOpen} as={Fragment}>
              <Dialog
                className="relative z-40 lg:hidden"
                onClose={setMobileFiltersOpen}
              >
                <Transition.Child
                  as={Fragment}
                  enter="transition-opacity ease-linear duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 z-40 flex">
                  <Transition.Child
                    as={Fragment}
                    enter="transition ease-in-out duration-300 transform"
                    enterFrom="translate-x-full"
                    enterTo="translate-x-0"
                    leave="transition ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="translate-x-full"
                  >
                    <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl dark:bg-gray-900">
                      <div className="flex items-center justify-between px-4">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-300">
                          Filters
                        </h2>
                        <button
                          type="button"
                          className="relative -mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 dark:bg-gray-800 dark:text-gray-300"
                          onClick={() => setMobileFiltersOpen(false)}
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Close menu</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Mobile Filters */}
                      <div className="mt-4 border-t border-gray-200">
                        <h3 className="sr-only">Categories</h3>

                        <div className="flex flex-col space-y-4 px-4 py-6">
                          {allFilters?.map((filter) => (
                            <FilterPopover
                              key={filter.id}
                              fullFilter={filter}
                              setFullFilter={(updatedFilter: any) => {
                                const newAllFilters = allFilters.map((f) =>
                                  f.id === updatedFilter.id ? updatedFilter : f,
                                );
                                setAllFilters(newAllFilters);
                              }}
                              checkIfAnyFiltersActive={checkIfAnyFiltersActive}
                              setFiltersActive={setFiltersActive}
                            />
                          ))}
                        </div>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </Dialog>
            </Transition.Root>

            <div className=" hidden items-center justify-end border-b border-gray-300 pb-10 pt-10 dark:border-gray-500 lg:flex">
              <div className="flex hidden items-center lg:block">
                <div className="flex items-center">
                  {allFilters?.map((filter) => (
                    <FilterPopover
                      key={filter.id}
                      fullFilter={filter}
                      setFullFilter={(updatedFilter: any) => {
                        const newAllFilters = allFilters.map((f) =>
                          f.id === updatedFilter.id ? updatedFilter : f,
                        );
                        setAllFilters(newAllFilters);
                      }}
                      checkIfAnyFiltersActive={checkIfAnyFiltersActive}
                      setFiltersActive={setFiltersActive}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="pb-10 pt-10  lg:grid lg:grid-cols-3 lg:gap-x-8">
              <aside className="mb-4 lg:hidden">
                <h2 className="sr-only">Filters</h2>

                <button
                  type="button"
                  className="inline-flex items-center lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Filters
                  </span>
                  <PlusIcon
                    className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400  dark:text-gray-300"
                    aria-hidden="true"
                  />
                </button>
              </aside>

              <section
                aria-labelledby="product-heading"
                className="md:col-span-6 lg:col-span-3  xl:col-span-3"
              >
                <h2 id="product-heading" className="sr-only">
                  Products
                </h2>

                {filtersActive === true ? (
                  <ProductsTable
                    allFilters={allFilters}
                    checkIfAnyFiltersActive={checkIfAnyFiltersActive}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-2 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-8 xl:grid-cols-6">
                    {allFilters !== null &&
                      allFilters[0]?.options?.map(
                        (product: any, index: number) =>
                          product.label === 'All' ? null : (
                            <button
                              key={product.value}
                              onClick={(e) =>
                                handleSelectProductGroupIcon(product.label)
                              }
                              className="group flex flex-col items-center"
                            >
                              <div className="relative aspect-[1/1] w-full overflow-hidden rounded-lg bg-gray-200  dark:bg-gray-700">
                                <Image
                                  src={
                                    product.logo ? product.logo : '/NoPhoto.jpg'
                                  }
                                  width={200}
                                  height={200}
                                  alt={
                                    product.imageAlt
                                      ? product.imageAlt
                                      : 'Default description'
                                  }
                                  className=" h-full w-full rounded-lg border border-gray-200 object-cover object-center  group-hover:opacity-75  dark:border-gray-700"
                                />
                              </div>
                              <h3 className="dark: mt-4 text-xs text-black text-gray-700 dark:text-gray-300">
                                {product.label}
                              </h3>
                            </button>
                          ),
                      )}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </main>
      <footer aria-labelledby="footer-heading" className="bg-white">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
      </footer>
    </div>
  );
};

const CatalogPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Catalog />
  </Suspense>
);

export default CatalogPage;
