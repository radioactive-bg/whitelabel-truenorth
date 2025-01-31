'use client';
import { useEffect, useState, useMemo } from 'react';
import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash'; // Import debounce

const FilterPopover = ({
  fullFilter,
  setFullFilter,
  checkIfAnyFiltersActive,
  setFiltersActive,
}: {
  fullFilter: any;
  setFullFilter: (fullFilter: any) => void;
  checkIfAnyFiltersActive: () => void;
  setFiltersActive: (someValue: any) => void;
}) => {
  const [options, setOptions] = useState(fullFilter.options);
  const [query, setQuery] = useState('');
  const debouncedQuery = useMemo(() => debounce(setQuery, 300), []);
  const router = useRouter();
  //const pathname = usePathname(); // Get the current path

  // Debounced function for updating query parameters
  const handleDebouncedUpdate = debounce((queryString: string) => {
    router.push(`/dashboard/catalog${queryString ? `?${queryString}` : ''}`);
  }, 300);

  const filterOptions = useMemo(() => {
    if (query === '') {
      setOptions(fullFilter.options);
    } else {
      const filteredArray = fullFilter.options.filter((option: any) =>
        option.label.toLowerCase().includes(query.toLowerCase()),
      );
      setOptions(filteredArray);
    }
  }, [query, fullFilter.options]);

  useEffect(() => {
    setOptions(fullFilter.options);
  }, [filterOptions]);

  const handleCheckbox = (option: any) => {
    console.log('option: ' + JSON.stringify(option));
    const newValue = !option.checked;

    if (option.checked === newValue) return; // Skip update if no change

    const newOptions = fullFilter.options.map((opt: any) => {
      if (opt.value === option.value) {
        return { ...opt, checked: newValue };
      }
      return opt;
    });

    setOptions(newOptions);
    setFullFilter({ ...fullFilter, options: newOptions });

    const currentParams = new URLSearchParams(window.location.search);
    let productGroups = currentParams.get('ProductGroups') || '';
    console.log('ProductGroups: ' + productGroups);

    if (newValue) {
      productGroups = productGroups
        ? `${productGroups},${option.label}`
        : option.label;
      setFiltersActive(true);
      console.log('productGroups in newValue: ' + productGroups);
    } else {
      productGroups = productGroups
        .split(',')
        .filter((group) => group !== option.label)
        .join(',');
      console.log('productGroups remove value: ' + productGroups);
      checkIfAnyFiltersActive();
    }
    const newQuery = {
      ...Object.fromEntries(currentParams.entries()),
      ProductGroups: productGroups,
    };

    const currentQueryString = new URLSearchParams(currentParams).toString();
    const newQueryString = new URLSearchParams(newQuery).toString();

    if (currentQueryString !== newQueryString) {
      handleDebouncedUpdate(newQueryString);
    }
  };

  return (
    <>
      <Popover
        as="div"
        key={fullFilter.name}
        id="menu"
        className="relative inline-block pl-[20px] text-left"
      >
        <Popover.Button className="group inline-flex items-center justify-center text-sm  font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 sm:w-full sm:justify-between">
          <span>{fullFilter.name}</span>
          <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300" />
        </Popover.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Popover.Panel className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-600 sm:w-auto">
            <input
              type="text"
              placeholder="Search options..."
              className="dark:text-whites mb-4 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-black focus:ring focus:ring-black focus:ring-opacity-75 focus:ring-opacity-75 dark:border-gray-600 dark:bg-gray-700 dark:focus:border-white dark:focus:ring-white"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="max-h-60 space-y-4 overflow-y-auto">
              {options.map((option: any, optidx: any) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`filter-${fullFilter.name}-${optidx}`}
                    name={`${fullFilter.name}[]`}
                    defaultValue={option.value}
                    defaultChecked={option.checked}
                    onClick={() => handleCheckbox(option)}
                    type="checkbox"
                    className="ml-[5px] h-4 w-4 rounded border-gray-300 bg-white text-black checked:bg-black checked:text-white focus:ring-black dark:border-gray-600 dark:bg-white dark:checked:bg-black dark:checked:text-white dark:focus:ring-white"
                  />
                  <label
                    htmlFor={`filter-${fullFilter.name}-${optidx}`}
                    className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900 dark:text-gray-200"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
    </>
  );
};

export default FilterPopover;
