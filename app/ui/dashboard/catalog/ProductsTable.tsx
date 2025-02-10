import React, { useState, useEffect, useRef } from 'react';
import { getPreview } from '@/app/lib/api/priceList';
import axios, { CancelTokenSource } from 'axios';
import Pagination from '../../../ui/dashboard/pagination';
import { useCartStore } from '../../../../state/shoppingCart';
import { ProductsTableSkeleton } from '@/app/ui/skeletons';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import PreorderDialog from '@/app/ui/dashboard/catalog/PreorderDialog'; // Import the PreorderDialog

//import ErrorNotification from '@/components/shared/ErrorNotification';

const ProductsTable = ({
  allFilters,
  checkIfAnyFiltersActive,
}: {
  allFilters: any;
  checkIfAnyFiltersActive: () => void;
}) => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCartStore();

  // State for error notification
  // const [showError, setShowError] = useState(false);
  // const [errorText, setErrorText] = useState({
  //   mainText: '',
  //   secondairyText: '',
  // });

  const searchParams = useSearchParams();

  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: number]: number;
  }>({});
  const handleQuantityChange = (productId: number, quantity: number) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  const handleAddToCart = (product: any) => {
    const quantity = selectedQuantities[product.id] || 1;

    addToCart({ ...product, quantity });
  };

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // we must focus on these filters
  const [regionIDs, setRegionIDs] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [productGroupIDs, setProductGroupIDs] = useState([]);

  //functionality for these will be added later
  const [availability, setAvailability] = useState(null);
  const [hasBasePrice, setHasBasePrice] = useState(null);
  const [hasSalePrice, setHasSalePrice] = useState(null);

  const [productName, setProductName] = useState(null);

  const cancelTokenSource = useRef<CancelTokenSource | null>(null);
  const latestRequestId = useRef<number>(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state
  const [selectedProduct, setSelectedProduct] = useState(null); // Selected product for the dialog

  const handleOpenPreorderDialog = (product: any) => {
    console.log(
      'handleOpenPreorderDialog in ProductsTable: ',
      JSON.stringify(product),
    );
    setSelectedProduct(product); // Set the selected product
    setIsDialogOpen(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close the dialog
    setSelectedProduct(null); // Clear the selected product
  };

  const findQueryParam = (param: string) => {
    if (typeof window === 'undefined') return ''; // Prevent server-side errors
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(param) || '';
  };

  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching data

    // Extract values from URL query parameters
    const searchQuery = findQueryParam('ProductGroups');
    const denominationQuery = findQueryParam('DenominationCurrencys');
    const regionQuery = findQueryParam('ActivationRegions');

    let ProductGroups = searchQuery ? searchQuery : null;
    let selectedRegionIDs = regionQuery ? regionQuery.split(',') : regionIDs;
    let selectedCurrencies = denominationQuery
      ? denominationQuery.split(',')
      : currencies;

    console.log('Fetching data with:');
    console.log('ProductGroups:', ProductGroups);
    console.log('Regions:', selectedRegionIDs);
    console.log('Currencies:', selectedCurrencies);

    // Cancel the previous request if there was one
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel(
        'Operation canceled due to new request.',
      );
    }

    // Create a new token for the current request
    cancelTokenSource.current = axios.CancelToken.source();
    const requestId = ++latestRequestId.current;

    try {
      const response = await getPreview(
        currentPage,
        selectedRegionIDs, // Ensure region filters are applied
        selectedCurrencies, // Ensure currency filters are applied
        productName,
        productGroupIDs,
        null,
        null,
        null,
      );

      if (requestId === latestRequestId.current) {
        let data = response.data ? response.data : [];
        setCurrentPage(response.meta.current_page);
        setTotalPages(response.meta.last_page);
        console.log('Fetched product data:', JSON.stringify(data));
        setProducts(data);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Fetch Error:', error);
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 750);
    }
  };

  useEffect(() => {
    fetchData();
  }, [regionIDs, currencies, productGroupIDs]);

  useEffect(() => {
    // Extracting the checked options' ids from allFilters
    console.log(
      'useEffect in ProductsTable for allFilters, currentPage, searchParams',
    );
    const newRegionIDs = allFilters
      .find((filter: any) => filter.id === 'Activation Region')
      ?.options.filter((option: any) => option.checked)
      .map((option: any) => option.value);

    const newCurrencies = allFilters
      .find((filter: any) => filter.id === 'Denomination Currency')
      ?.options.filter((option: any) => option.checked)
      .map((option: any) => option.value);

    const newProductGroupIDs = allFilters
      .find((filter: any) => filter.id === 'Product Group')
      ?.options.filter((option: any) => option.checked)
      .map((option: any) => option.value);

    // Update state with the new arrays of ids
    setRegionIDs(newRegionIDs || []);
    setCurrencies(newCurrencies || []);
    setProductGroupIDs(newProductGroupIDs || []);

    checkIfAnyFiltersActive();
    fetchData();
  }, [allFilters, currentPage]);

  return (
    <div className="w-full  ">
      {/* Error Notification */}

      {/* <ErrorNotification
        show={showError}
        setShow={setShowError}
        mainText={errorText.mainText}
        secondairyText={errorText.secondairyText}
      /> */}

      {/* ProductsTable */}
      <div className="rounded-lg bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4  pt-2 sm:px-6 lg:px-8 lg:pb-12 ">
          <div className="">
            <h2 className="sr-only">Recent orders</h2>

            <div className="space-y-20">
              {loading ? (
                <ProductsTableSkeleton />
              ) : products.length > 0 ? (
                <div key={'test'}>
                  <h3 className="sr-only">
                    Order placed on <time dateTime={'test'}>{'test'}</time>
                  </h3>

                  <table className="mt-4 w-full text-gray-500 dark:bg-gray-900 sm:mt-6">
                    <caption className="sr-only">Products</caption>
                    <thead className="sr-only text-left text-sm text-gray-500 dark:bg-gray-900 sm:not-sr-only">
                      <tr>
                        <th
                          scope="col"
                          className="hidden w-1/6 font-normal sm:table-cell"
                        >
                          Product
                        </th>
                        <th
                          scope="col"
                          className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                        ></th>
                        <th
                          scope="col"
                          className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                        >
                          Group
                        </th>
                        <th
                          scope="col"
                          className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell"
                        >
                          Quantity
                        </th>
                        <th
                          scope="col"
                          className="hidden py-3 pr-8 font-normal sm:table-cell"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="w-0 py-3 text-right font-normal"
                        ></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm dark:divide-gray-700 dark:border-gray-700 sm:border-t">
                      {products.map((product: any) => (
                        <tr key={product.id}>
                          <td className="py-4">
                            <Image
                              width={200}
                              height={200}
                              src={product.logo ? product.logo : '/NoPhoto.jpg'}
                              alt={
                                product.imageAlt
                                  ? product.imageAlt
                                  : 'product image'
                              }
                              className="mr-6 max-h-14 w-auto rounded-lg border border-gray-700 object-cover object-center md:max-h-16"
                            />
                          </td>
                          <td>
                            {' '}
                            <div>
                              <div className="mr-2 font-medium text-gray-900 text-gray-900 dark:text-gray-100">
                                {product.groupName}
                              </div>
                              <div className="mt-1 sm:hidden">
                                {product.price}
                                {product.currency}
                              </div>
                            </div>
                          </td>
                          <td className="hidden py-4  pr-8 dark:text-gray-300 sm:table-cell  md:py-6">
                            {product.group}
                          </td>
                          <td className="hidden py-4  pr-8 dark:text-gray-300 sm:table-cell  md:py-6">
                            {product.price}
                            {product.currency}
                          </td>

                          <td className=" py-4   sm:table-cell sm:pr-8  md:py-6">
                            <input
                              type="number"
                              id={`quantity-${product.id}`}
                              name={`quantity-${product.id}`}
                              min="1"
                              max="1000"
                              value={selectedQuantities[product.id] || 1}
                              onChange={(e) => {
                                const value = Math.min(
                                  1000,
                                  Math.max(1, parseInt(e.target.value) || 1),
                                );
                                handleQuantityChange(product.id, value);
                              }}
                              className="w-16 rounded-md border border-gray-300 py-1.5 text-center text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 sm:text-sm md:w-20"
                            />
                          </td>

                          {product.isEnabled ? (
                            <td className=" hidden min-w-[100px] py-6 pr-8 sm:table-cell">
                              <span className=" inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900 dark:text-green-300">
                                In Stock
                              </span>
                            </td>
                          ) : (
                            <td className="hidden min-w-[100px] py-6 pr-8 sm:table-cell">
                              <span className=" inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-900 dark:text-red-300">
                                Sold Out
                              </span>
                            </td>
                          )}

                          <td className="whitespace-nowrap py-4  text-right font-medium md:py-6">
                            <button
                              disabled={!product.isEnabled}
                              onClick={() => handleAddToCart(product)}
                              className={`ml-4 rounded-md bg-black px-3 py-1 text-white transition duration-150 hover:bg-black/70 dark:bg-gray-700 dark:hover:bg-gray-800 ${
                                !product.isEnabled
                                  ? 'cursor-not-allowed opacity-50'
                                  : ''
                              }`}
                            >
                              Add
                              <span className="hidden lg:inline"> Product</span>
                              <span className="sr-only">, {product.name}</span>
                            </button>
                          </td>

                          {/* {product.isEnabled ? (
                            <td className="whitespace-nowrap py-6 text-right font-medium">
                              <button
                                disabled={!product.isEnabled}
                                onClick={() => handleAddToCart(product)}
                                className={`ml-4 rounded-md bg-black px-3 py-1 text-white transition duration-150 hover:bg-black/70   ${
                                  !product.isEnabled
                                    ? 'cursor-not-allowed opacity-50'
                                    : ''
                                }`}
                              >
                                Add
                                <span className="hidden lg:inline">
                                  {' '}
                                  Product
                                </span>
                                <span className="sr-only">
                                  , {product.name}
                                </span>
                              </button>
                            </td>
                          ) : (
                            <td className="whitespace-nowrap py-6 text-right font-medium">
                              <button
                                onClick={() =>
                                  handleOpenPreorderDialog(product)
                                }
                                className={`ml-4 rounded-md border border-gray-300 px-3 py-1 text-black transition duration-150 hover:border-white hover:bg-black hover:text-white active:bg-indigo-200 active:text-indigo-700`}
                              >
                                Preorder
                              </button>
                            </td>
                          )} */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 text-gray-500 dark:text-gray-300">
                  No items found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      {/* Preorder Dialog */}
      {isDialogOpen && selectedProduct && (
        <PreorderDialog
          product={selectedProduct}
          isDialogOpen={isDialogOpen}
          setIsOpenDialog={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default ProductsTable;
