'use client';
import { useEffect } from 'react';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';

import { Fragment, useState } from 'react';
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from '@headlessui/react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FunnelIcon, MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

import { filters } from '@/app/lib/constants';
import { getProductGroupsList } from '@/app/lib/api/productGroup';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function CatalogPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productGroups, setProductGroups] = useState([]);

  // search Bars states
  const [productGroupsSearchQuery, setProductGroupsSearchQuery] = useState('');
  const [regionSearchQuery, setRegionSearchQuery] = useState('');
  const [currencySearchQuery, setCurrencySearchQuery] = useState('');

  // filtered product groups states
  const [filteredProductGroups, setFilteredProductGroups] = useState(
    filters[0].options,
  );
  const [filteredRegions, setFilteredRegions] = useState(filters[1].options);
  const [filteredCurrences, setFilteredCurrences] = useState(
    filters[2].options,
  );

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
    fetchProductGroups();
  }, [auth.access_token]);

  const fetchProductGroups = async () => {
    setLoading(true);

    try {
      const response = await getProductGroupsList(auth.access_token);
      setProductGroups(response.data.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(true);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);

    try {
      const response = await getProductGroupsList(auth.access_token);
      setProductGroups(response.data.data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(true);
    }
  };

  // Generic function to filter options based on search input
  const filterOptions = (
    allOptions: any,
    query: any,
    setFilteredArrayFunc: any,
  ) => {
    let filteredArray = allOptions.filter((option: any) =>
      option.label.toLowerCase().includes(query.toLowerCase()),
    );

    setFilteredArrayFunc(filteredArray);
  };

  return (
    <div className="bg-white">
      {loading === true ? (
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

                      {filters.map((section) => (
                        <Disclosure
                          as="div"
                          key={section.id}
                          className="border-t border-gray-200 px-4 py-6"
                        >
                          {({ open }) => (
                            <>
                              <h3 className="-mx-2 -my-3 flow-root">
                                <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                  <span className="font-medium text-gray-900">
                                    {section.name}
                                  </span>
                                  <span className="ml-6 flex items-center">
                                    {open ? (
                                      <MinusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    ) : (
                                      <PlusIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    )}
                                  </span>
                                </Disclosure.Button>
                              </h3>
                              <Disclosure.Panel className="pt-6">
                                <div className="space-y-6">
                                  {section.options.map((option, optionIdx) => (
                                    <div
                                      key={option.value}
                                      className="flex items-center"
                                    >
                                      <input
                                        id={`filter-mobile-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        defaultValue={option.value}
                                        type="checkbox"
                                        defaultChecked={option.checked}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      />
                                      <label
                                        htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                        className="ml-3 min-w-0 flex-1 text-gray-500"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </Disclosure.Panel>
                            </>
                          )}
                        </Disclosure>
                      ))}
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
                  <Popover
                    as="div"
                    key={'Product Group'}
                    id="menu"
                    className="relative inline-block pl-[20px] text-left"
                  >
                    <div>
                      <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        <span>{'Product Group'}</span>
                        {/* {sectionIdx === 0 ? (
                          <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                            1
                          </span>
                        ) : null} */}
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Popover.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <input
                          type="text"
                          placeholder="Search options..."
                          className="mb-4 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                          value={productGroupsSearchQuery}
                          onChange={(e) => {
                            setProductGroupsSearchQuery(e.target.value);
                            filterOptions(
                              filters[0].options,
                              e.target.value,
                              setFilteredProductGroups,
                            );
                          }}
                        />
                        <form className="max-h-60 space-y-4 overflow-y-auto">
                          {filteredProductGroups.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-${'Product Group'}-${optionIdx}`}
                                name={`${'Product Group'}[]`}
                                defaultValue={option.value}
                                defaultChecked={option.checked}
                                type="checkbox"
                                className=" ml-[5px] h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-${'Product Group'}-${optionIdx}`}
                                className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </form>
                      </Popover.Panel>
                    </Transition>
                  </Popover>
                  <Popover
                    as="div"
                    key={'Activation Region'}
                    id="menu"
                    className="relative inline-block pl-[20px] text-left"
                  >
                    <div>
                      <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        <span>{'Activation Region'}</span>
                        {/* {sectionIdx === 0 ? (
                          <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                            1
                          </span>
                        ) : null} */}
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Popover.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <input
                          type="text"
                          placeholder="Search options..."
                          className="mb-4 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                          value={regionSearchQuery}
                          onChange={(e) => {
                            setRegionSearchQuery(e.target.value);
                            filterOptions(
                              filters[1].options,
                              e.target.value,
                              setFilteredRegions,
                            );
                          }}
                        />
                        <form className="max-h-60 space-y-4 overflow-y-auto">
                          {filteredRegions.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-${'Activation Region'}-${optionIdx}`}
                                name={`${'Activation Region'}[]`}
                                defaultValue={option.value}
                                defaultChecked={option.checked}
                                type="checkbox"
                                className=" ml-[5px] h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-${'Activation Region'}-${optionIdx}`}
                                className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </form>
                      </Popover.Panel>
                    </Transition>
                  </Popover>
                  <Popover
                    as="div"
                    key={'Denomination currency'}
                    id="menu"
                    className="relative inline-block pl-[20px] text-left"
                  >
                    <div>
                      <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        <span>{'Denomination currency'}</span>
                        {/* {sectionIdx === 0 ? (
                          <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-gray-700">
                            1
                          </span>
                        ) : null} */}
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </Popover.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Popover.Panel className="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <input
                          type="text"
                          placeholder="Search options..."
                          className="mb-4 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                          value={currencySearchQuery}
                          onChange={(e) => {
                            setCurrencySearchQuery(e.target.value);
                            filterOptions(
                              filters[2].options,
                              e.target.value,
                              setFilteredCurrences,
                            );
                          }}
                        />
                        <form className="max-h-60 space-y-4 overflow-y-auto">
                          {filteredCurrences.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center"
                            >
                              <input
                                id={`filter-${'Denomination currency'}-${optionIdx}`}
                                name={`${'Denomination currency'}[]`}
                                defaultValue={option.value}
                                defaultChecked={option.checked}
                                type="checkbox"
                                className=" ml-[5px] h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label
                                htmlFor={`filter-${'Denomination currency'}-${optionIdx}`}
                                className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </form>
                      </Popover.Panel>
                    </Transition>
                  </Popover>
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
                className="mt-6 md:col-span-6 lg:col-span-3 lg:mt-0 xl:col-span-3"
              >
                <h2 id="product-heading" className="sr-only">
                  Products
                </h2>

                <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:gap-x-8 xl:grid-cols-6">
                  {/* {products.map((product) => (
                    <div
                      key={product.id}
                      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
                    >
                      <div className="aspect-h-4 aspect-w-3 sm:aspect-none bg-gray-200 group-hover:opacity-75 sm:h-96">
                        <img
                          src={product.imageSrc}
                          alt={product.imageAlt}
                          className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                        />
                      </div>
                      <div className="flex flex-1 flex-col space-y-2 p-4">
                        <h3 className="text-sm font-medium text-gray-900">
                          <a href={product.href}>
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            />
                            {product.name}
                          </a>
                        </h3>
                        <p className="text-sm text-gray-500">
                          {product.description}
                        </p>
                        <div className="flex flex-1 flex-col justify-end">
                          <p className="text-sm italic text-gray-500">
                            {product.options}
                          </p>
                          <p className="text-base font-medium text-gray-900">
                            {product.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))} */}

                  {filteredProductGroups.map((product: any, index: number) =>
                    // if the index is 0 do not display the first product group
                    product.label === 'All' ? null : (
                      <a
                        key={product.value}
                        href={product.href}
                        className="group flex flex-col items-center"
                      >
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-7 xl:aspect-w-7">
                          <img
                            src={product.logo ? product.logo : '/NoPhoto.jpg'}
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
                      </a>
                    ),
                  )}
                </div>
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
