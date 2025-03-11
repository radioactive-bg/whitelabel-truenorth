import { useState, useEffect } from 'react';
import {
  getStatuses,
  getProductGroups,
  getProducts,
} from '@/app/lib/api/filters';
import { getOrdersList, FetchInvoicesParams } from '@/app/lib/api/orders';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FiltersSectionProps {
  fetchOrders: (page: number, filters: FetchInvoicesParams) => void;
  setFilters: (filters: FetchInvoicesParams) => void;
  setOrders: (orders: any) => void;
  setLoading: (loading: boolean) => void;
  setCurrentPage: (page: number) => void;
  page: number;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  fetchOrders,
  setFilters,
  setOrders,
  setLoading,
  setCurrentPage,
  page,
}) => {
  const [orderId, setOrderId] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const [statusOptions, setStatusOptions] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [productGroupOptions, setProductGroupOptions] = useState([]);

  const [productObject, setProductObject] = useState<Record<string, string>>(
    {},
  );
  const [productGroupObject, setProductGroupObject] = useState<
    Record<string, string>
  >({});
  const [statusObject, setStatusObject] = useState<Record<string, string>>({});

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    // Fetch Status Options
    const fetchStatuses = async () => {
      const response = await getStatuses();

      setStatusOptions(Object.values(response));
      setStatusObject(response);
    };

    // Fetch Product Options
    const fetchProductGroups = async () => {
      try {
        const response = await getProductGroups();
        setProductGroupOptions(Object.values(response));

        setProductGroupObject(response);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductGroupOptions([]);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProductOptions(Object.values(response));

        setProductObject(response);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProductOptions([]);
      }
    };

    fetchStatuses();
    //fetchProducts();
    fetchProductGroups();
  }, []);

  const applyFilters = () => {
    const productKey = selectedProduct
      ? Object.keys(productObject).find(
          (key) => productObject[key] === selectedProduct,
        )
      : null;

    const productGroupKey = selectedProduct
      ? Object.keys(productGroupObject).find(
          (key) => productGroupObject[key] === selectedProduct,
        )
      : null;

    const statusKey = selectedStatus
      ? Object.keys(statusObject).find(
          (key) => statusObject[key] === selectedStatus,
        )
      : null;

    const sanitizedFilters: FetchInvoicesParams = {
      ...(orderId && { orderId }),
      ...(dateFrom && { dateFrom: format(dateFrom, 'yyyy-MM-dd') }),
      ...(dateTo && { dateTo: format(dateTo, 'yyyy-MM-dd') }),
      ...(productGroupKey && { productGroupId: productGroupKey }),
      //...(productKey && { product: productKey }), // Use product key
      ...(statusKey && { status: [Number(statusKey)] }), // Use status key
      perPage: itemsPerPage,
      page, // Ensure 'page' is always present
    };

    setFilters(sanitizedFilters);
    setCurrentPage(1);
    fetchOrders(1, sanitizedFilters);
  };

  const handleReset = () => {
    setOrderId('');
    setItemsPerPage(10);
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedStatus('');
    setSelectedProduct('');
    setCurrentPage(1); // Reset pagination to the first page

    // Create default filters for fetching all items
    const defaultFilters: FetchInvoicesParams = {
      perPage: 10,
      page: 1, // Always fetch the first page
    };

    // Update filters and fetch all orders
    setFilters(defaultFilters);
    fetchOrders(1, defaultFilters);
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-md dark:border dark:border-gray-700 dark:bg-gray-800">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {/* Order ID */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
            Order ID
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-white"
          />
        </div>

        {/* Items Per Page */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
            Items on Page
          </label>
          <input
            type="number"
            id="perPage"
            min={1}
            max={20}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-white"
          />
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
            Date From
          </label>
          <Popover>
            <PopoverTrigger asChild className="mt-1 w-full">
              <Button
                variant={'outline'}
                className={cn(
                  'min-h-[42px] w-full justify-start rounded-md border-gray-300 text-left font-normal shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-white',
                  !dateFrom && 'text-muted-foreground dark:text-gray-400',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? (
                  format(dateFrom, 'PPP')
                ) : (
                  <span className="text-grey-700 dark:text-white">
                    Pick a date
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={(value) => {
                  setDateFrom(value);
                  console.log('Date From Selected:', value);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
            Date To
          </label>
          <Popover>
            <PopoverTrigger asChild className="mt-1 w-full">
              <Button
                variant={'outline'}
                className={cn(
                  'min-h-[42px] w-full justify-start rounded-md border border-gray-300 text-left font-normal shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-white',
                  !dateTo && 'text-muted-foreground dark:text-gray-400',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? (
                  format(dateTo, 'PPP')
                ) : (
                  <span className="text-grey-700 dark:text-white">
                    Pick a date
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={(value) => {
                  setDateTo(value);
                  console.log('Date To Selected:', value);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            id="orderStatusFilter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-white"
          >
            <option value="">All</option>
            {statusOptions.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Product */}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">
            Product Group
          </label>
          <select
            value={selectedProduct}
            id="productGroupSelect"
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:ring-white"
          >
            <option value="">All</option>
            {productGroupOptions?.map((product, index) => (
              <option key={index} value={product}>
                {product}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={handleReset}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700"
        >
          Reset
        </button>
        <button
          id="filterButton"
          onClick={applyFilters}
          className="rounded-md bg-black px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-black/70 dark:bg-white dark:text-black dark:hover:bg-gray-300"
        >
          Filter
        </button>
      </div>
    </div>
  );
};

export default FiltersSection;
