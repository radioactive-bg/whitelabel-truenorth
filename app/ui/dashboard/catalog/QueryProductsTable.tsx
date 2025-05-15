import React, { useState, useEffect } from 'react';
import { getOrderProducts } from '@/app/lib/api/filters';
import { getProductGroupsList } from '@/app/lib/api/productGroup';
import { useCartStore } from '@/state/shoppingCart';
import { ProductsTableSkeleton } from '@/app/ui/skeletons';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/app/ui/dashboard/pagination';

interface Product {
  id: number;
  name: string;
  group: string;
  basePrice: string;
  salePrice: string;
  isEnabled: boolean;
  price: string;
}

interface ProductGroup {
  id: number;
  name: string;
  logo: string;
}

interface CartItem extends Product {
  quantity: number;
  logo: string;
  currency: string;
  regions: string[];
  groupName: string;
}

const QueryProductsTable = () => {
  const { addToCart } = useCartStore();
  const searchParams = useSearchParams();

  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: number]: number;
  }>({});

  // Get specific group name from query parameters
  const getGroupName = (): string => {
    const groupName = searchParams.get('ProductGroups');
    console.log('Getting group name from URL:', groupName);
    return groupName ? groupName.split(',')[0] : '';
  };

  // Get logo for a product group
  const getGroupLogo = (groupName: string): string => {
    const group = productGroups.find((g) => g.name === groupName);
    return group?.logo || '/NoPhoto.jpg';
  };

  // Handle quantity changes
  const handleQuantityChange = (productId: number, quantity: number) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: Math.min(1000, Math.max(1, quantity)),
    }));
  };

  // Add product to cart
  const handleAddToCart = (product: Product) => {
    const quantity = selectedQuantities[product.id] || 1;
    const cartItem: CartItem = {
      ...product,
      quantity,
      logo: getGroupLogo(product.group),
      currency: 'USD',
      regions: [],
      groupName: product.group,
    };
    addToCart(cartItem);
  };

  // Fetch products based on specific group name
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const groupName = getGroupName();
      console.log('Fetching products for group name:', groupName);

      if (!groupName) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Fetch product groups first
      const groupsResponse = await getProductGroupsList();
      if (groupsResponse.data?.data) {
        setProductGroups(groupsResponse.data.data);
      }

      // Get all products
      const orderProductsResponse = await getOrderProducts();
      console.log('Order Products Response:', orderProductsResponse);

      if (orderProductsResponse) {
        // Filter products to match the group name
        const filteredProducts = orderProductsResponse.filter(
          (product: Product) => {
            const matches = product.group === groupName;
            console.log('Product match check:', {
              productId: product.id,
              productGroup: product.group,
              searchGroupName: groupName,
              matches,
            });
            return matches;
          },
        );

        console.log('Filtered products:', filteredProducts);

        const sortedProducts = filteredProducts
          .map((product: Product) => ({
            ...product,
            price: product.price.toString(),
          }))
          .sort((a: Product, b: Product) => {
            // Sort by price
            return parseFloat(a.price) - parseFloat(b.price);
          });

        // Calculate pagination
        const itemsPerPage = 5;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = sortedProducts.slice(startIndex, endIndex);

        setProducts(paginatedProducts);

        // Calculate total pages based on filtered products
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        setTotalPages(totalPages);

        // If current page is greater than total pages, reset to page 1
        if (currentPage > totalPages) {
          setCurrentPage(1);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when query parameters or page changes
  useEffect(() => {
    fetchProducts();
  }, [searchParams, currentPage]);

  if (loading) {
    return <ProductsTableSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="rounded-lg bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 lg:px-8 lg:pb-12">
          <div className="space-y-20">
            {products.length > 0 ? (
              <div>
                <table className="mt-4 w-full text-gray-500 dark:bg-gray-900 sm:mt-6">
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
                      >
                        Details
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
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm dark:divide-gray-700 dark:border-gray-700 sm:border-t">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="py-4">
                          <Image
                            width={200}
                            height={200}
                            src={getGroupLogo(product.group)}
                            alt={product.name}
                            className="mr-6 max-h-14 w-auto rounded-lg border border-gray-700 object-cover object-center md:max-h-16"
                          />
                        </td>
                        <td>
                          <div>
                            <div className="mr-2 font-medium text-gray-900 dark:text-gray-100">
                              {product.group}
                            </div>
                            <div className="mt-1 sm:hidden">
                              {product.price} USD
                            </div>
                          </div>
                        </td>
                        <td className="hidden py-4 pr-8 dark:text-gray-300 sm:table-cell md:py-6">
                          {product.group}
                        </td>
                        <td className="hidden py-4 pr-8 dark:text-gray-300 sm:table-cell md:py-6">
                          {product.price} USD
                        </td>
                        <td className="py-4 sm:table-cell sm:pr-8 md:py-6">
                          <input
                            type="number"
                            min="1"
                            max="1000"
                            value={selectedQuantities[product.id] || 1}
                            onChange={(e) =>
                              handleQuantityChange(
                                product.id,
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="w-16 rounded-md border border-gray-300 py-1.5 text-center text-base font-medium text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 sm:text-sm md:w-20"
                          />
                        </td>
                        <td className="hidden min-w-[100px] py-6 pr-8 sm:table-cell">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              product.isEnabled
                                ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 dark:bg-red-900 dark:text-red-300'
                            }`}
                          >
                            {product.isEnabled ? 'In Stock' : 'Sold Out'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap py-4 text-right font-medium md:py-6">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-300">
                No products found for this group
              </div>
            )}
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

export default QueryProductsTable;
