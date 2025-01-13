'use client';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

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

  useEffect(() => {
    setOptions(fullFilter.options);
  }, [fullFilter.options]);

  const handleCheckbox = (option: any) => {
    const newValue = !option.checked;

    const newOptions = fullFilter.options.map((opt: any) => {
      if (opt.value === option.value) {
        return { ...opt, checked: newValue };
      }
      return opt;
    });

    setOptions(newOptions);
    setFullFilter({ ...fullFilter, options: newOptions });

    const currentParams = new URLSearchParams(window.location.search);
    let productGroups = currentParams.get('productGroups') || '';

    if (newValue) {
      productGroups = productGroups
        ? `${productGroups},${option.value}`
        : option.value;
      setFiltersActive(true);
    } else {
      productGroups = productGroups
        .split(',')
        .filter((group) => group !== option.value)
        .join(',');
      checkIfAnyFiltersActive();
    }
    currentParams.set('productGroups', productGroups);
    window.history.pushState({}, '', `?${currentParams.toString()}`);
  };

  const filterOptions = (allOptions: any, query: string) => {
    if (query === '') {
      setOptions(allOptions);
    } else {
      const filteredArray = allOptions.filter((option: any) =>
        option.label.toLowerCase().includes(query.toLowerCase()),
      );
      setOptions(filteredArray);
    }
  };

  useEffect(() => {
    // Whenever the query changes, filter the options
    filterOptions(fullFilter.options, query);
  }, [query, fullFilter.options]);

  return (
    <>
      <Popover
        as="div"
        key={fullFilter.name}
        id="menu"
        className="relative inline-block pl-[20px] text-left"
      >
        <Popover.Button className="group inline-flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900 sm:w-full sm:justify-between">
          <span>{fullFilter.name}</span>
          <ChevronDownIcon className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
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
          <Popover.Panel className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:w-auto">
            <input
              type="text"
              placeholder="Search options..."
              className="mb-4 w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
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
                    className="ml-[5px] h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`filter-${fullFilter.name}-${optidx}`}
                    className="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
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
