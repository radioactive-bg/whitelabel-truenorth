import React, { useState, useEffect } from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/24/outline';

import { getPreview } from '@/app/lib/api/priceList';

const ProductsTable = (data: any, allFilters: any) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const orders = [
    {
      number: 'WU88191111',
      date: 'January 22, 2021',
      datetime: '2021-01-22',
      invoiceHref: '#',
      total: '$238.00',
      products: [
        {
          id: 1,
          name: 'Machined Pen and Pencil Set',
          href: '#',
          price: '$70.00',
          status: 'Delivered Jan 25, 2021',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/order-history-page-02-product-01.jpg',
          imageAlt:
            'Detail of mechanical pencil tip with machined black steel shaft and chrome lead tip.',
        },
      ],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPreview(currentPage);
        console.log(' fetchData getPreview  response.data: ', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Fetch Error:', error);
      }
    };
    fetchData();
  }, [currentPage]);

  return (
    <div className="w-full">
      {/* ProductsTable */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="mt-16">
            <h2 className="sr-only">Recent orders</h2>

            <div className="space-y-20">
              {products.length > 2 ? (
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
                                src={product.logo}
                                alt={
                                  product.imageAlt
                                    ? product.imageAlt
                                    : 'product image'
                                }
                                className="mr-6 h-16 w-16 rounded object-cover object-center"
                              />
                              <div>
                                <div className="font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="mt-1 sm:hidden">
                                  {product.price}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="hidden py-6 pr-8 sm:table-cell">
                            {product.groupName}
                          </td>
                          <td className="hidden py-6 pr-8 sm:table-cell">
                            {product.price}
                          </td>

                          <td className="hidden py-6 pr-8 sm:table-cell">
                            {'test'}
                          </td>
                          <td className="hidden py-6 pr-8 sm:table-cell">
                            <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                              Active
                            </span>
                          </td>

                          <td className="whitespace-nowrap py-6 text-right font-medium">
                            <a href={product.href} className="text-indigo-600">
                              View
                              <span className="hidden lg:inline"> Product</span>
                              <span className="sr-only">, {product.name}</span>
                            </a>
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

      <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
        <div className="-mt-px flex w-0 flex-1">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            <ArrowLongLeftIcon
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Previous
          </button>
        </div>
        <div className="hidden md:-mt-px md:flex">
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            1
          </a>
          {/* Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300" */}
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600"
            aria-current="page"
          >
            2
          </a>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            3
          </a>
          <span className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500">
            ...
          </span>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            8
          </a>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            9
          </a>
          <a
            href="#"
            className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            10
          </a>
        </div>
        <div className="-mt-px flex w-0 flex-1 justify-end">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          >
            Next
            <ArrowLongRightIcon
              className="ml-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ProductsTable;
