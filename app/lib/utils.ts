import { Revenue } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const generateYAxis = (revenue: Revenue[]) => {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};

export const getStatusStyles = (status: number) => {
  const isDarkMode =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('dark');

  switch (status) {
    case 3: // Complete
      return isDarkMode
        ? {
            text: 'Complete',
            bgColor: 'bg-green-700',
            textColor: 'text-green-50',
            ringColor: 'ring-green-400',
          }
        : {
            text: 'Complete',
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            ringColor: 'ring-green-600',
          };

    case 6: // Cancelled
      return isDarkMode
        ? {
            text: 'Cancelled',
            bgColor: 'bg-red-700',
            textColor: 'text-red-50',
            ringColor: 'ring-red-400',
          }
        : {
            text: 'Cancelled',
            bgColor: 'bg-red-50',
            textColor: 'text-red-700',
            ringColor: 'ring-red-600',
          };

    case 7: // In Process
      return isDarkMode
        ? {
            text: 'In process',
            bgColor: 'bg-[#FFF]',
            textColor: 'text-[#FAAD14]',
            ringColor: 'ring-[#FAAD14]',
          }
        : {
            text: 'In process',
            bgColor: 'bg-[#FAAD14]',
            textColor: 'text-[#FFF]',
            ringColor: 'ring-[#FFF]',
          };

    default: // Unknown Status
      return isDarkMode
        ? {
            text: 'Unknown',
            bgColor: 'bg-gray-700',
            textColor: 'text-gray-50',
            ringColor: 'ring-gray-400',
          }
        : {
            text: 'Unknown',
            bgColor: 'bg-gray-50',
            textColor: 'text-gray-700',
            ringColor: 'ring-gray-600',
          };
  }
};
