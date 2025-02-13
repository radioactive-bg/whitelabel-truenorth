'use client';
import Pagination from '@/app/ui/dashboard/pagination';

interface Column {
  header: string;
  accessor: string;
}

interface HistoryTableProps {
  columns: Column[];
  data: any[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const HistoryTable = ({
  columns,
  data,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}: HistoryTableProps) => {
  return (
    <>
      <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
        <table className="min-w-full dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-3  text-left text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-900">
            {loading ? (
              Array.from({ length: 10 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300"
                    >
                      <div
                        className={`h-5 ${
                          colIndex % 2 === 1 ? 'w-12' : 'w-20'
                        } rounded bg-gray-200 dark:bg-gray-600`}
                      ></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300"
                    >
                      {row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-4 text-center text-gray-500 dark:text-gray-300"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={onPageChange}
        totalPages={totalPages}
      />
    </>
  );
};

export default HistoryTable;
