import { useState, useEffect } from 'react';
import { getStatuses, getProducts } from '@/app/lib/api/filters';
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

  const [productObject, setProductObject] = useState<Record<string, string>>(
    {},
  );
  const [statusObject, setStatusObject] = useState<Record<string, string>>({});

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    // Fetch Status Options
    const fetchStatuses = async () => {
      const response = await getStatuses();
      console.log('Statuses:', JSON.stringify(response));
      setStatusOptions(Object.values(response));
      setStatusObject(response);
    };

    // Fetch Product Options
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
    fetchProducts();
  }, []);

  const applyFilters = () => {
    const productKey = selectedProduct
      ? Object.keys(productObject).find(
          (key) => productObject[key] === selectedProduct,
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
      ...(productKey && { product: productKey }), // Use product key
      ...(statusKey && { status: [Number(statusKey)] }), // Use status key
      perPage: itemsPerPage,
      page, // Ensure 'page' is always present
    };

    console.log('Sanitized Filters:', sanitizedFilters); // Debugging

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
    <div className="mb-6 rounded-lg bg-gray-50 p-4 shadow-md">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {/* Order ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Order ID
          </label>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>

        {/* Items Per Page */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Items on Page
          </label>
          <input
            type="number"
            min={1}
            max={20}
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date From
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start rounded-md border-gray-300 text-left font-normal shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50',
                  !dateFrom && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
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
          <label className="block text-sm font-medium text-gray-700">
            Date To
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start rounded-md border-gray-300 text-left font-normal shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50',
                  !dateTo && 'text-muted-foreground',
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
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
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
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
          <label className="block text-sm font-medium text-gray-700">
            Product
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          >
            <option value="">All</option>
            {productOptions?.map((product, index) => (
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
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          //onClick={handleFilter}
          onClick={applyFilters}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
        >
          Filter
        </button>
      </div>
    </div>
  );
};

export default FiltersSection;
