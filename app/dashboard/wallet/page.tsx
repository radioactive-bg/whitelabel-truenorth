'use client';
import { useState, useEffect } from 'react';
import { useWalletStore, Wallet } from '@/state/wallets';
import { getUserProfile, userStore } from '@/state/user';
import { User } from '@/app/lib/types/user';
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
import { PaymentMethodDialog } from '@/app/ui/dashboard/wallet/PaymentMethodDialog';

import HistoryTable from '@/app/ui/dashboard/wallet/HistoryTable';

// Define a type for each column
interface Column {
  header: string;
  accessor: string;
}

// ----------------------------------------------------------------------
// Main WalletPage Component
// ----------------------------------------------------------------------
export default function WalletPage() {
  const { wallets, selectedWallet } = useWalletStore();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserProfile(
        localStorage.getItem('access_token') || '',
      );
      setUser(userData);
    };
    fetchUser();
  }, []);

  // -------------------------
  // ACL Flags based on the user object
  // -------------------------
  const canViewTopup = user?.acl.wallet.list.crud.view; // TopUp history permission
  const canViewPayout = user?.acl.payoutTransaction.list.crud.view; // Payout history permission

  // Allowed table types array based on ACL
  const allowedTableTypes: ('topup' | 'payout')[] = [];
  if (canViewTopup) allowedTableTypes.push('topup');
  if (canViewPayout) allowedTableTypes.push('payout');

  // -------------------------
  // Dialog states
  // -------------------------

  const [isRedeemCardDialogOpen, setIsRedeemCardDialogOpen] = useState(false);
  const [isRedeemInvoiceDialogOpen, setIsRedeemInvoiceDialogOpen] =
    useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // -------------------------
  // TopUp Transactions State
  // -------------------------
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // -------------------------
  // Payout Transactions State
  // -------------------------
  const [payoutTransactions, setPayoutTransactions] = useState<any[]>([]);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutCurrentPage, setPayoutCurrentPage] = useState(1);
  const [payoutTotalPages, setPayoutTotalPages] = useState(1);

  const itemsPerPage = 10;

  // -------------------------
  // Table Type: 'topup' or 'payout'
  // -------------------------
  // If both types are allowed, default to 'topup'. If only one, use that.

  const [tableType, setTableType] = useState<'topup' | 'payout'>(
    allowedTableTypes.length === 1 ? allowedTableTypes[0] : 'topup',
  );

  // In case the allowedTableTypes change later, ensure tableType is valid.
  useEffect(() => {
    if (
      !allowedTableTypes.includes(tableType) &&
      allowedTableTypes.length > 0
    ) {
      setTableType(allowedTableTypes[0]);
    }
  }, [allowedTableTypes, tableType]);

  // ----------------------------------------------------------------------
  // 3. Create fetchTransactions (TopUp) and fetchPayoutTransactions functions
  // ----------------------------------------------------------------------
  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/wallets/${selectedWallet?.id}/transactions?page=${page}&type=credit&per_page=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );
      console.log('Fetched transactions:', response.data.data);
      const { current_page, last_page } = response.data.meta;
      setCurrentPage(current_page);
      setTotalPages(last_page);

      const mappedTransactions = response.data.data.map((transaction: any) => ({
        date: new Date(transaction.created_at).toLocaleDateString(),
        currency: transaction.amount.includes('$') ? 'USD' : '',
        amount: transaction.amount,
        method: transaction.method ? transaction.method : 'TopUp',
      }));

      setTransactions(mappedTransactions);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayoutTransactions = async (page = 1) => {
    setPayoutLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/payout-transactions?page=${page}&per_page=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );
      console.log('Fetched payout transactions:', response.data.data);
      const { current_page, last_page } = response.data.meta;
      setPayoutCurrentPage(current_page);
      setPayoutTotalPages(last_page);

      const mappedPayoutTransactions = response.data.data.map(
        (transaction: any) => ({
          date: transaction.createdAt, // Already a formatted string per your sample response
          payoutMethod: transaction.payoutMethod,
          status: transaction.status,
          totalAmount: transaction.totalAmountInSourceCurrency,
          totalFees: transaction.totalFeesAmountInSourceCurrency,
          payoutAmountSource: transaction.payoutAmountInSourceCurrency,
          payoutAmountTarget: transaction.payoutAmountInTargetCurrency,
          receiver: `${transaction.receiver.type}: ${transaction.receiver.value}`,
        }),
      );

      setPayoutTransactions(mappedPayoutTransactions);
    } catch (error) {
      console.error('Failed to fetch payout transactions:', error);
    } finally {
      setPayoutLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // useEffect to fetch data when wallet, page or table type changes.
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (selectedWallet?.id) {
      if (tableType === 'topup') {
        fetchTransactions(currentPage);
      } else {
        fetchPayoutTransactions(payoutCurrentPage);
      }
    }
  }, [selectedWallet?.id, currentPage, payoutCurrentPage, tableType]);

  const updateTransactions = (page: number) => {
    setCurrentPage(page);
  };

  const updatePayoutTransactions = (page: number) => {
    setPayoutCurrentPage(page);
  };

  // ----------------------------------------------------------------------
  // Column definitions for each table type
  // ----------------------------------------------------------------------
  const topupColumns: Column[] = [
    { header: 'Date', accessor: 'date' },
    { header: 'Currency', accessor: 'currency' },
    { header: 'TopUp Type', accessor: 'method' },
    { header: 'Amount', accessor: 'amount' },
  ];

  const payoutColumns: Column[] = [
    { header: 'Date', accessor: 'date' },
    { header: 'Payout Method', accessor: 'payoutMethod' },
    { header: 'Status', accessor: 'status' },
    { header: 'Total Amount', accessor: 'totalAmount' },
    { header: 'Total Fees', accessor: 'totalFees' },
    { header: 'Payout (Source)', accessor: 'payoutAmountSource' },
    { header: 'Payout (Target)', accessor: 'payoutAmountTarget' },
    { header: 'Receiver', accessor: 'receiver' },
  ];
  console.log('user', user);
  // ----------------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------------
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
          <div>
            {/* {user && user.acl?.payoutTransaction?.list?.crud?.store && (
              <button
                onClick={() => setIsPaymentDialogOpen(true)}
                className="mr-4 mt-4 inline-flex items-center justify-between rounded-md bg-[#1b3b67] px-4 py-[11px] text-sm font-semibold text-white shadow-sm hover:bg-[#162b49] dark:bg-white dark:text-[#000] dark:hover:bg-gray-100 md:py-2"
              >
                Payout
              </button>
            )} */}
            {user && user.acl?.wallet?.list?.crud?.view && (
              <Dropdown>
                <DropdownButton
                  className="inline-flex w-[120px] items-center justify-between rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#162b49] dark:bg-white dark:!text-black dark:hover:bg-gray-100"
                  color="customblue"
                >
                  TopUp
                  <ChevronDownIcon className="h-4 w-4 text-white dark:text-black" />
                </DropdownButton>
                <DropdownMenu
                  anchor="bottom end"
                  className="dark:bg-gray-800 dark:text-white"
                >
                  <DropdownItem onClick={() => setIsRedeemCardDialogOpen(true)}>
                    Redeem a card
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => setIsRedeemInvoiceDialogOpen(true)}
                  >
                    Redeem by invoice code
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </div>
      </div>

      <div className="w-full rounded-lg bg-white p-6 shadow dark:bg-gray-800">
        <div className="mb-4 flex items-center justify-between">
          {allowedTableTypes.length > 1 ? (
            <select
              value={tableType}
              onChange={(e) => {
                const value = e.target.value as 'topup' | 'payout';
                setTableType(value);
                // Reset pagination when switching table types
                if (value === 'topup') {
                  setCurrentPage(1);
                } else {
                  setPayoutCurrentPage(1);
                }
              }}
              className="w-full max-w-[250px] rounded-md border border-gray-300 bg-white px-3 py-2 text-lg font-semibold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              {canViewTopup && <option value="topup">TopUp History</option>}

              {canViewPayout && (
                <option value="payout">Payout Transactions</option>
              )}
            </select>
          ) : (
            <div className="mb-4">
              <span className="text-lg font-semibold dark:text-white">
                {allowedTableTypes[0] === 'payout'
                  ? 'Payout Transactions'
                  : 'TopUp History'}
              </span>
            </div>
          )}
        </div>

        {/* Render the appropriate table based on selection */}
        {tableType === 'topup' ? (
          <HistoryTable
            columns={topupColumns}
            data={transactions}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={updateTransactions}
          />
        ) : (
          <HistoryTable
            columns={payoutColumns}
            data={payoutTransactions}
            loading={payoutLoading}
            currentPage={payoutCurrentPage}
            totalPages={payoutTotalPages}
            onPageChange={updatePayoutTransactions}
          />
        )}
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
      <PaymentMethodDialog
        open={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        fetchTransactions={() => fetchPayoutTransactions(currentPage)}
        selectedWallet={selectedWallet}
      />
    </>
  );
}
