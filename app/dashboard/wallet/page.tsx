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
import { Link } from '@/app/ui/catslyst-ui/link';
import { RedeemCardDialog } from '@/app/ui/dashboard/wallet/redeem-card-dialog';
import { RedeemInvoiceDialog } from '@/app/ui/dashboard/wallet/redeem-invoice-dialog';

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

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/wallets/${selectedWallet?.id}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );
      console.log(
        'transactions response.data.data: ' +
          JSON.stringify(response.data.data),
      );
      // Filter data for "redeem card" or "redeem invoice code"
      const filteredTransactions = response.data.data
        .filter(
          (transaction: any) =>
            transaction.method === 'redeem card' ||
            transaction.method === 'redeem invoice code',
        )
        .map((transaction: any) => ({
          date: new Date(transaction.created_at).toLocaleDateString(), // Format date
          currency: transaction.amount.includes('$') ? 'USD' : '', // Assumption: USD if amount includes $
          amount: transaction.amount,
          method: transaction.method,
        }));

      setTransactions(filteredTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedWallet?.id) {
      fetchTransactions();
    }
  }, [selectedWallet?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-500/10 text-green-500';
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'Rejected':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <>
      <div>
        <div className="mb-4 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
          <h1 className="mb-6 text-xl font-semibold dark:text-white">Wallet</h1>
          <div className="flex items-center justify-between">
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
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Show account balance in USD
              </div>
            </div>

            <Dropdown>
              <DropdownButton className="inline-flex h-[42px] w-[150px] items-center rounded-md bg-white px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:ring-gray-500 dark:hover:bg-gray-600">
                TopUp
                <ChevronDownIcon className="mr-2 h-4 w-4" />
              </DropdownButton>
              <DropdownMenu className="dark:bg-gray-800 dark:text-white">
                <DropdownItem
                  className="flex justify-between dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsRedeemCardDialogOpen(true);
                  }}
                >
                  Redeem a card <ChevronRightIcon width={16} height={16} />
                </DropdownItem>
                <DropdownItem
                  className="dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsRedeemInvoiceDialogOpen(true);
                  }}
                >
                  Redeem by invoice code
                  <ChevronRightIcon width={16} height={16} />
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <h2 className="mb-4 text-lg font-semibold dark:text-white">
          TopUp History
        </h2>
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  TopUp Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-500 dark:text-gray-300"
                  >
                    Loading...
                  </td>
                </tr>
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
      </div>

      <RedeemCardDialog
        open={isRedeemCardDialogOpen}
        onClose={() => setIsRedeemCardDialogOpen(false)}
      />
      <RedeemInvoiceDialog
        open={isRedeemInvoiceDialogOpen}
        onClose={() => setIsRedeemInvoiceDialogOpen(false)}
      />
    </>
  );
}
