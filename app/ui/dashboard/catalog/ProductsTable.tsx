import React, { useState, useEffect, useRef } from 'react';
import { getPreview } from '@/app/lib/api/priceList';
import axios, { CancelTokenSource } from 'axios';
import Pagination from '../../../ui/dashboard/pagination';
import { useCartStore } from '../../../../state/shoppingCart';
import { ProductsTableSkeleton } from '@/app/ui/skeletons';
import Image from 'next/image';

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
    //const existingItem = cartItems.find((item: any) => item.id === product.id);

    // const totalQuantity = existingItem
    //   ? existingItem.quantity + quantity
    //   : quantity;

    // const orderLimit = 4; // Example limit; adjust based on product or user settings

    // if (totalQuantity > orderLimit) {
    //   setErrorText({
    //     mainText: 'Order Limit Exceeded',

    //     secondairyText: `You can only order a maximum of ${orderLimit} units for this product.`,
    //   });

    //   setShowError(true);

    //   return;
    // }

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

  const fetchData = async () => {
    setLoading(true); // Set loading to true before fetching data

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
        regionIDs,
        currencies,
        null,
        productGroupIDs,
        null,
        null,
        null,
      );

      if (requestId === latestRequestId.current) {
        let data = response.data ? response.data : [];

        setCurrentPage(response.meta.current_page);
        setTotalPages(response.meta.last_page);
        setProducts(data);
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Fetch Error:', error);
      }
    } finally {
      setLoading(false); // Set loading to false after fetching data
    }
  };

  useEffect(() => {
    fetchData();
  }, [regionIDs, currencies, productGroupIDs]);

  useEffect(() => {
    // Extracting the checked options' ids from allFilters

    const newRegionIDs = allFilters
      .find((filter: any) => filter.id === 'Activation Region')
      ?.options.filter((option: any) => option.checked)
      .map((option: any) => option.value);

    const newCurrencies = allFilters
      .find((filter: any) => filter.id === 'Denomination currency')
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
    <div className="w-full">
      {/* Error Notification */}

      {/* <ErrorNotification
        show={showError}
        setShow={setShowError}
        mainText={errorText.mainText}
        secondairyText={errorText.secondairyText}
      /> */}

      {/* ProductsTable */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pb-24">
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

                  <table className="mt-4 w-full text-gray-500 sm:mt-6">
                    <caption className="sr-only">Products</caption>
                    <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                      <tr>
                        <th
                          scope="col"
                          className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3"
                        >
                          Product
                        </th>
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
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                      {products.map((product: any) => (
                        <tr key={product.id}>
                          <td className="py-6 pr-8">
                            <div className="flex items-center">
                              <Image
                                width={200}
                                height={200}

                                src={
                                  product.logo ? product.logo : '/NoPhoto.jpg'
                                }
                                alt={
                                  product.imageAlt
                                    ? product.imageAlt
                                    : 'product image'
                                }
                                className="mr-6 h-16 w-16 rounded object-cover object-center"
                              />
                              <div>
                                <div className="mr-2 font-medium text-gray-900">
                                  {product.groupName}
                                </div>
                                <div className="mt-1 sm:hidden">
                                  {product.price}
                                  {product.currency === 'USD' ? '$' : '€'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden py-6 pr-8 sm:table-cell">
                            {product.group}
                          </td>
                          <td className="hidden py-6 pr-8 sm:table-cell">
                            {product.price}
                            {product.currency === 'USD' ? '$' : '€'}
                          </td>

                          <td className=" py-6 sm:table-cell sm:pr-8">
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
                              className="w-20 rounded-md border border-gray-300 py-1.5 text-center text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            />

                          </td>

                          {product.isEnabled ? (
                            <td className=" hidden min-w-[100px] py-6 pr-8 sm:table-cell">
                              <span className=" inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                In Stock
                              </span>
                            </td>
                          ) : (
                            <td className="hidden min-w-[100px] py-6 pr-8 sm:table-cell">
                              <span className=" inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                Sold Out
                              </span>
                            </td>
                          )}

                          <td className="whitespace-nowrap py-6 text-right font-medium">
                            <button
                              disabled={!product.isEnabled}
                              onClick={() => handleAddToCart(product)}
                              className={`ml-4 rounded-md px-3 py-1 text-indigo-600 transition duration-150 hover:bg-indigo-100 hover:text-indigo-500 active:bg-indigo-200 active:text-indigo-700 ${
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500">No items found</div>
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
    </div>
  );
};

export default ProductsTable;
