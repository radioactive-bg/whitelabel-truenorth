'use client';
import { useState, useEffect } from 'react';
import { useWalletStore, Wallet } from '@/state/wallets';
import axios from 'axios';

import { ChevronRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
} from '@/app/ui/catslyst-ui/dropdown';
import { RedeemCardDialog } from '@/app/ui/dashboard/wallet/redeem-card-dialog';
import { RedeemInvoiceDialog } from '@/app/ui/dashboard/wallet/redeem-invoice-dialog';

import Pagination from '../../ui/dashboard/pagination';

import { WalletTableSkeleton } from '@/app/ui/skeletons';

interface Transaction {
  date: string;
  currency: string;
  amount: string;
  method: string | null;
}

export default function WalletPage() {
  const { wallets, selectedWallet } = useWalletStore();

  const [isRedeemCardDialogOpen, setIsRedeemCardDialogOpen] = useState(false);
  const [isRedeemInvoiceDialogOpen, setIsRedeemInvoiceDialogOpen] =
    useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const transactionsPerPage = 10;

  // Fetch transactions with API-based pagination
  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/wallets/${selectedWallet?.id}/transactions?page=${page}&type=credit`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );

      console.log('Fetched transactions:', response.data.data);

      // Extract pagination metadata
      const { current_page, last_page } = response.data.meta;
      setCurrentPage(current_page);
      setTotalPages(last_page);

      // Filter transactions for "redeem card" or "redeem invoice code"
      const filteredTransactions = response.data.data
        //.filter((transaction: any) => transaction.method === 'redeem card')
        .map((transaction: any) => ({
          date: new Date(transaction.created_at).toLocaleDateString(),
          // change
          currency: transaction.amount.includes('$') ? 'USD' : '',
          amount: transaction.amount,
          method: transaction.method ? transaction.method : 'manual',
        }));

      console.log(
        'filteredTransactions: ' + JSON.stringify(filteredTransactions),
      );

      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedWallet?.id && currentPage !== null) {
      fetchTransactions(currentPage);
    }
  }, [selectedWallet?.id, currentPage]);

  const updateTransactions = (page: number) => {
    setCurrentPage(page); // This triggers useEffect
  };

  return (
    <>
      <div className="mb-4 w-full rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h1 className="mb-6 text-xl font-semibold dark:text-white">Wallet</h1>
        <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
          <div>
            <div className="mb-1 text-sm text-gray-500 dark:text-gray-300">
              My Balance
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-gray-500 dark:text-gray-300">
                {selectedWallet?.currency}
              </span>
              <span className="text-3xl font-semibold dark:text-white">
                {selectedWallet?.availableAmount}
              </span>
            </div>
          </div>

          <Dropdown>
            <DropdownButton className="mt-4 inline-flex h-[42px] w-[150px] items-center rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:ring-gray-500 dark:hover:bg-gray-600">
              TopUp
              <ChevronDownIcon className="mr-2 h-4 w-4" />
            </DropdownButton>
            <DropdownMenu className="dark:bg-gray-800 dark:text-white">
              <DropdownItem onClick={() => setIsRedeemCardDialogOpen(true)}>
                Redeem a card
              </DropdownItem>
              <DropdownItem onClick={() => setIsRedeemInvoiceDialogOpen(true)}>
                Redeem by invoice code
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="w-full rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold dark:text-white">
          TopUp History
        </h2>
        <div className="overflow-x-auto rounded-lg bg-white shadow dark:bg-gray-800">
          <table className=" min-w-full dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300">
                  TopUp Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-300">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:bg-gray-900">
              {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    {Array.from({ length: 4 }).map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4">
                        <div
                          className={`h-5 ${
                            colIndex % 2 === 1 ? 'w-12' : 'w-20'
                          } rounded bg-gray-200 dark:bg-gray-600`}
                        ></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {transaction.date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {transaction.currency}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {transaction.method}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                      {transaction.amount}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500 dark:text-gray-300"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={updateTransactions}
          totalPages={totalPages}
        />
      </div>

      <RedeemCardDialog
        open={isRedeemCardDialogOpen}
        onClose={() => setIsRedeemCardDialogOpen(false)}
        fetchTransactions={() => fetchTransactions(currentPage)}
      />
      <RedeemInvoiceDialog
        open={isRedeemInvoiceDialogOpen}
        onClose={() => setIsRedeemInvoiceDialogOpen(false)}
        fetchTransactions={() => fetchTransactions(currentPage)}
      />
    </>
  );
}
