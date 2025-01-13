'use client';

import { useState } from 'react';
//import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import {
  CustomDialog,
  CustomDialogBody,
  CustomDialogTitle,
} from '@/app/ui/catslyst-ui/dialog';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import { useWalletStore, Wallet } from '@/state/wallets';

interface RedeemInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
}

export function RedeemInvoiceDialog({
  open,
  onClose,
}: RedeemInvoiceDialogProps) {
  const { wallets, selectedWallet, fetchWallets } = useWalletStore();

  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState(''); // State to store error message

  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    invoiceCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('wallets?.id: ' + JSON.stringify(wallets));
    console.log('selectedWallet?.id: ' + selectedWallet?.id);
    // Check if the card has been redeemed
    try {
      const checkResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/wallets/${selectedWallet?.id}/credit`,
        {
          type: 'redeem_invoice_code',
          data: {
            invoiceCode: formData.invoiceCode,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );

      if (checkResponse.data.message) {
        // If there's a message in the response, display it and stop further execution
        setErrorMessage(checkResponse.data.message);
        return;
      }
    } catch (error: Error | any) {
      console.error(
        'Error checking the card:',
        error.response?.data || error.message,
      );
      setErrorMessage(error.response?.data?.message || 'An error occurred.');
      return;
    }

    fetchWallets();
    setTimeout(() => {
      setIsSuccess(true);
    }, 1000);
  };

  const handleClose = () => {
    onClose();
    setIsSuccess(false);
    setFormData({ invoiceCode: '' });
    setErrorMessage('');
  };

  return (
    <CustomDialog
      className="flex items-center justify-center"
      open={open}
      onClose={handleClose}
    >
      {/* Dialog content */}
      <div className="relative w-full max-w-md ">
        <CustomDialogTitle className="flex items-center justify-between">
          <span className="text-xl font-semibold">Redeem an Invoice Code</span>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </CustomDialogTitle>

        <CustomDialogBody className="mb-[0px] mt-4">
          {!isSuccess ? (
            <div className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="mb-2 text-sm text-red-500">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="invoiceNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Invoice Code
                  </label>
                  <input
                    id="invoiceNumber"
                    type="text"
                    placeholder="Enter Gift Card Number"
                    value={formData.invoiceCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        invoiceCode: e.target.value,
                      }))
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
                >
                  Redeem
                </button>

                <div className="mt-6 rounded-lg bg-gray-50 p-4">
                  <h3 className="text-sm font-medium text-gray-900">Tips</h3>
                  <ul className="mt-2 space-y-2 text-sm text-gray-500">
                    <li>• Input Invoice number.</li>
                    <li>• If there is any issue contact support.</li>
                    {/* <li>
                      • Ut posuere ipsum quis dui ultricies, vel congue tortor
                      ullamcorper.
                    </li>
                    <li>• Vivamus sed lacus finibus risus rutrum viverra.</li>
                    <li>• Suspendisse eu justo a leo semper hendrerit.</li>
                    <li>
                      • Praesent finibus nunc at nisl pretium, vel lacinia odio
                      tincidunt.
                    </li> */}
                  </ul>
                </div>
              </form>
            </div>
          ) : (
            <div className="mt-6 flex flex-col items-center text-center">
              <div className="rounded-full bg-green-100 p-2">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="mt-4 flex items-center gap-1">
                <span className="text-xl font-semibold">Success!</span>
                <span role="img" aria-label="party popper">
                  🎉
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                Your Invoice Code has been redeemed successfully. Enjoy your
                balance or reward!
              </p>
              <div className="mt-6 flex w-full flex-col gap-3">
                <button
                  onClick={() => handleClose()}
                  className="w-full rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-black/90"
                >
                  View Balance
                </button>
                <button
                  onClick={() => router.push('/dashboard/catalog')}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Shop Now
                </button>
              </div>
            </div>
          )}
        </CustomDialogBody>
      </div>
    </CustomDialog>
  );
}
