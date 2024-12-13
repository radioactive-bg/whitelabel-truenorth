'use client';
import { useEffect } from 'react';
import { authStore, Auth } from '@/state/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

import { filters } from '@/app/lib/constants';
import { getProductGroupsList } from '@/app/lib/api/productGroup';

import FilterPopover from '@/app/ui/dashboard/catalog/FilterPopover';
import ProductsTable from '@/app/ui/dashboard/catalog/ProductsTable';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function CatalogPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  //const searchParams = useSearchParams();


  // do we need this ???
  const [productGroups, setProductGroups] = useState([]);

  const [products, setProducts] = useState([]);

  // filter states
  const [allFilters, setAllFilters] = useState(filters);
  const [updatedAllFilters, setUpdatedAllFilters] = useState(filters);
  const [filtersActive, setFiltersActive] = useState(false);

  const router = useRouter();
  const { auth, initializeAuth } = authStore() as {
    auth: Auth;
    initializeAuth: () => void;
  };

  useEffect(() => {
    initializeAuth();
    const localValue = localStorage.getItem('access_token') || 'no value';
    //console.log('localValue in catalog: ', localValue);
    //console.log('auth.access_token in catalog: ', auth.access_token);
    if (!localValue) {
      router.push('/login');
      return;
    }

    const productGroup = findQueryParam('ProductGroup');

    if (productGroup !== '') {
      handleSelectProductGroupIcon(productGroup);
    }

    //fetchProducts();
  }, [auth.access_token]);

  const findQueryParam = (param: string) => {
    if (typeof window === 'undefined') return ''; // Ensure code doesn't break on server-side

    const searchParams = new URLSearchParams(window.location.search); // Use the browser's URL
    const productGroup = searchParams.get(param) || '';

    if (productGroup) {
      handleSelectProductGroupIcon(productGroup);
    }

    return productGroup;
  };

  const handleSelectProductGroupIcon = (productLabel: any) => {
    console.log('handleSelectProductGroupIcon productLabel: ', productLabel);
    let newAllFilters = allFilters.map((filter) => {
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
    setAllFilters(newAllFilters);
    setFiltersActive(true);
  };

  const checkIfAnyFiltersActive = () => {
    console.log('checkIfAnyFiltersActive');
    console.log('allFilters: ', allFilters);
    const isActive = allFilters.some((filter) =>
      filter.options.some((option) => option.checked),
    );
    console.log('isActive : ' + isActive);
    setFiltersActive(isActive);
  };

  return (
    <div className="bg-white">
      {loading === true ? (
        // add a skeleton for this when the time comes
        <>Loading...</>
      ) : (
        <div>
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
                  <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-lg font-medium text-gray-900">
                        Filters
                      </h2>
                      <button
                        type="button"
                        className="relative -mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
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
                        {allFilters.map((filter) => (
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

          <main className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
            <div className=" flex items-center justify-end border-b border-gray-200 pb-10 pt-24">
              <div className="flex hidden items-center lg:block">
                <div className="flex items-center">
                  {allFilters.map((filter) => (
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

            <div className="pb-24 pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8">
              <aside className="lg:hidden">
                <h2 className="sr-only">Filters</h2>

                <button
                  type="button"
                  className="inline-flex items-center lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="text-sm font-medium text-gray-700">
                    Filters
                  </span>
                  <PlusIcon
                    className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
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
                  <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:gap-x-8 xl:grid-cols-6">
                    {allFilters[0].options.map((product: any, index: number) =>
                      product.label === 'All' ? null : (
                        <button
                          key={product.value}
                          onClick={(e) =>
                            handleSelectProductGroupIcon(product.label)
                          }
                          className="group flex flex-col items-center"
                        >
                          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-7 xl:aspect-w-7">

                            <Image
                              src={product.logo ? product.logo : '/NoPhoto.jpg'}
                              width={200}
                              height={200}
                              alt={
                                product.imageAlt
                                  ? product.imageAlt
                                  : 'Default description'
                              }
                              className="h-full w-full object-cover object-center group-hover:opacity-75"
                            />
                          </div>
                          <h3 className="mt-4 text-sm text-gray-700">
                            {product.label}
                          </h3>
                        </button>
                      ),
                    )}
                  </div>
                )}
              </section>
            </div>
          </main>

          <footer aria-labelledby="footer-heading" className="bg-white">
            <h2 id="footer-heading" className="sr-only">
              Footer
            </h2>
          </footer>
        </div>
      )}
    </div>
  );
}
