'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import {
  CustomDialog,
  CustomDialogBody,
  CustomDialogTitle,
} from '@/app/ui/catslyst-ui/dialog';
import axios from 'axios';
import { Wallet } from '@/state/wallets';
import clsx from 'clsx';

interface PayoutMethod {
  id: number;
  name: string;
  payoutCurrency: string;
  walletCurrency: string;
}

interface PaymentMethodDialogProps {
  open: boolean;
  onClose: () => void;
  fetchTransactions: () => void;
  selectedWallet: Wallet | null;
}

export function PaymentMethodDialog({
  open,
  onClose,
  fetchTransactions,
  selectedWallet,
}: PaymentMethodDialogProps) {
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PayoutMethod | null>(
    null,
  );
  const [amount, setAmount] = useState('');
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Fetch the payout methods when the dialog opens
  useEffect(() => {
    if (open) {
      fetchPayoutMethods();
    }
  }, [open]);

  const fetchPayoutMethods = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/payout-methods`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );
      console.log('Fetched Payout Methods:', response.data.data);
      setPayoutMethods(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedMethod(response.data.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch Payout Methods:', error);
      setErrorMessage('Failed to load payout methods.');
    }
  };

  const handlePreview = async () => {
    let fixedAmmount = Number(amount) * 10000;
    if (!selectedMethod) {
      setErrorMessage('Please select a payout method.');
      return;
    }
    if (!amount) {
      setErrorMessage('Please enter an amount.');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/payout-transactions/preview`,
        {
          amount: fixedAmmount,
          payoutMethodId: selectedMethod.id,
          walletId: selectedWallet?.id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );
      console.log('Preview Response:', response.data);
      setPreviewData(response.data.data);
    } catch (error: any) {
      console.error('Preview Error:', error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message || 'An error occurred during preview.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    let fixedAmmount = Number(amount) * 10000;
    if (!selectedMethod) {
      setErrorMessage('Please select a payout method.');
      return;
    }
    if (!amount) {
      setErrorMessage('Please enter an amount.');
      return;
    }
    setErrorMessage('');
    setCreateLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/payout-transactions?amount=${fixedAmmount}&payoutMethodId=${selectedMethod.id}&walletId=${selectedWallet?.id}`;
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      console.log('Create Response:', response);
      setSuccess(true);
      fetchTransactions();
    } catch (error: any) {
      console.error('Create Error:', error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message || 'An error occurred during creation.',
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setAmount('');
      setPreviewData(null);
      setErrorMessage('');
      setAgreed(false);
    }, 500);
  };

  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      className="flex items-center justify-center dark:bg-gray-900"
    >
      <div className="relative w-full max-w-md rounded-lg bg-white py-4 dark:bg-gray-900">
        <CustomDialogTitle className="flex items-center justify-between text-black dark:text-white">
          <span className="text-xl font-semibold">
            {success ? 'Payout Successful' : 'Payout'}
          </span>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </CustomDialogTitle>

        <CustomDialogBody className="mt-4">
          {!success ? (
            <div className="space-y-4">
              {errorMessage && (
                <div className="mb-2 text-sm text-red-500">{errorMessage}</div>
              )}

              <div>
                <label
                  htmlFor="payoutMethod"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Payout Method
                </label>
                <select
                  id="payoutMethod"
                  value={selectedMethod?.id || ''}
                  onChange={(e) => {
                    const methodId = parseInt(e.target.value);
                    const method = payoutMethods.find(
                      (pm) => pm.id === methodId,
                    );
                    setSelectedMethod(method || null);
                    setPreviewData(null); // Reset preview on change
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                >
                  {payoutMethods.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name} - {pm.payoutCurrency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Withdrawal Amount{' '}
                  {selectedMethod && `(${selectedMethod.walletCurrency})`}
                </label>
                <input
                  id="amount"
                  type="number"
                  placeholder={`Enter amount in ${
                    selectedMethod ? selectedMethod.walletCurrency : ''
                  }`}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setPreviewData(null); // Reset preview on change
                  }}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:ring-white"
                  required
                />
              </div>

              {/* Always show preview block with empty values if previewData is null */}
              <div className="mt-4 rounded">
                <div>
                  <strong>Total Amount:</strong>{' '}
                  {previewData?.totalAmount || ''}
                </div>
                <div>
                  <strong>Payout Amount (source):</strong>{' '}
                  {previewData?.payoutAmount?.source || ''}
                </div>
                <div>
                  <strong>Payout Amount (target):</strong>{' '}
                  {previewData?.payoutAmount?.target || ''}
                </div>
                <div>
                  <strong>Fees:</strong>{' '}
                  {previewData &&
                  previewData.fees &&
                  previewData.fees.length > 0
                    ? previewData.fees.join(', ')
                    : ''}
                </div>
                <div>
                  <strong>Receiver:</strong> {previewData?.receiver || ''}
                </div>
              </div>

              {/* "I Agree" Checkbox */}
              {previewData && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agree"
                    className="mr-2"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <label
                    htmlFor="agree"
                    className="text-sm text-gray-700 dark:text-gray-300"
                  >
                    I Agree
                  </label>
                </div>
              )}
              {/* <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agree"
                  className="mr-2"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <label
                  htmlFor="agree"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  I Agree
                </label>
              </div> */}

              <div className="flex justify-between">
                <button
                  onClick={handlePreview}
                  className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
                  disabled={loading}
                >
                  {loading ? 'Loading Preview...' : 'Preview'}
                </button>
                <button
                  onClick={handleCreate}
                  className={clsx(
                    'rounded-md px-4 py-2 text-sm font-semibold text-white dark:text-black',
                    createLoading || !previewData || !agreed
                      ? 'cursor-not-allowed bg-gray-500'
                      : 'bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-gray-300',
                  )}
                  disabled={createLoading || !previewData || !agreed}
                >
                  {createLoading ? 'Processing...' : 'Create'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-700">
                <CheckIcon className="h-6 w-6 text-green-600 dark:text-white" />
              </div>
              <span className="mt-4 text-xl font-semibold dark:text-white">
                Success! 🎉
              </span>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Your payout request has been successfully submitted.
              </p>
              <button
                onClick={handleClose}
                className="mt-6 w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          )}
        </CustomDialogBody>
      </div>
    </CustomDialog>
  );
}
