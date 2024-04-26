'use client';
import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../button';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import React, { useState } from 'react';

export default function OTPForm({
  handleVerifyOtp,
}: {
  handleVerifyOtp: (e: any, otp: string) => void;
}) {
  const [otp, setOtp] = useState('');

  return (
    <div className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please enter OTP to continue.
        </h1>
        <div className="ml-4 w-full">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value: any) => {
              setOtp(value);
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <OTPButton onClick={handleVerifyOtp} otp={otp} />
        <div className="flex h-8 items-end space-x-1">
          {/* Add form errors here */}
        </div>
      </div>
    </div>
  );
}

// Correctly defining the function to accept props
function OTPButton({
  onClick,
  otp,
}: {
  onClick: (e: any, otp: string) => void;
  otp: string;
}) {
  return (
    <button
      className="'flex aria-disabled:opacity-50', mt-4 h-10 w-full items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 active:bg-blue-600 aria-disabled:cursor-not-allowed"
      onClick={(e) => onClick(e, otp)}
    >
      Submit
    </button>
  );
}
