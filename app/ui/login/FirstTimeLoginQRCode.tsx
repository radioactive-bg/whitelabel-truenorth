'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function FirstTimeLoginQRCode({
  onQRCodeScanned,
}: {
  onQRCodeScanned: () => void;
}) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/register-2fa`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          },
        );
        console.log('fetchQRCode data: ' + JSON.stringify(response));

        if (response.data.code) {
          setQrCodeUrl(response.data.code); // Set the Base64 image string
        } else {
          setError('Failed to retrieve QR code. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching QR code:', error);
        setError('An error occurred while fetching the QR code.');
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, []);

  if (loading) {
    return <p>Loading QR Code...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="flex flex-col items-center">
      {qrCodeUrl ? (
        <>
          <img src={qrCodeUrl} alt="QR Code" className="mb-4 h-64 w-64" />

          <p>Scan the QR Code to enable 2FA on your device.</p>

          <button
            className="mt-10 flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onQRCodeScanned}
          >
            Proceed to OTP Verification
          </button>
        </>
      ) : (
        <p>Error loading QR Code. Please try again later.</p>
      )}
    </div>
  );
}
