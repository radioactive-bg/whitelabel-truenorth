import React, { useState, useEffect, useRef } from 'react';

import { getPreview } from '@/app/lib/api/priceList';
import axios, { CancelTokenSource } from 'axios';
import Pagination from '../../../ui/dashboard/pagination';
import { useCartStore } from '../../../../state/shoppingCart';

const ProductsTable = ({
  allFilters,
  checkIfAnyFiltersActive,
}: {
  allFilters: any;
  checkIfAnyFiltersActive: () => void;
}) => {
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } =
    useCartStore();
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

  // we must focus on htese filters
  const [regionIDs, setRegionIDs] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [productGroupIDs, setProductGroupIDs] = useState([]);

  //functionallity for these will be aded later
  const [availability, setAvailability] = useState(null);
  const [hasBasePrice, setHasBasePrice] = useState(null);
  const [hasSalePrice, setHasSalePrice] = useState(null);

  const [productName, setProductName] = useState(null);

  const cancelTokenSource = useRef<CancelTokenSource | null>(null);
  const latestRequestId = useRef<number>(0);

  const fetchData = async () => {
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
      //console.log(' fetchData getPreview  response.data: ', response.data);
      if (requestId === latestRequestId.current) {
        let data = response.data ? response.data : [];

        console.log('fetchData response: ', JSON.stringify(response));
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
      {/* ProductsTable */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4  sm:px-6 lg:px-8 lg:pb-24">
          <div className="">
            <h2 className="sr-only">Recent orders</h2>

            <div className="space-y-20">
              {products.length > 0 ? (
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
                              <img
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
                            <select
                              id={`quantity-${product.id}`}
                              name={`quantity-${product.id}`}
                              onChange={(e) =>
                                handleQuantityChange(
                                  product.id,
                                  parseInt(e.target.value),
                                )
                              }
                              className="max-h-24 max-w-full overflow-y-auto rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            >
                              {product.isEnabled ? (
                                Array.from({ length: 50 }, (_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                  </option>
                                ))
                              ) : (
                                <option value="0">0</option>
                              )}
                            </select>
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
                <div> No Products Found</div>
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
