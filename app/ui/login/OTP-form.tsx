'use client';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';

import React, { useState, useEffect, useRef } from 'react';

export default function OTPForm({
  handleVerifyOtp,
  showOtpForm,
}: {
  handleVerifyOtp: (
    e: any,
    otp: string,
    setOtpError: (msg: string) => void,
  ) => void;
  showOtpForm: boolean;
}) {
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showOtpForm && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [showOtpForm]);

  return (
    <div className="space-y-3">
      <form className="flex-1 rounded-lg px-6 pb-4 pt-8">
        <h1 className="mb-5 mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Please enter OTP to continue.
        </h1>
        {otpError && (
          <div className="mb-4 text-center text-sm text-red-500">
            {otpError}
          </div>
        )}
        <div className="flex items-center justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value: any) => {
              setOtp(value);
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} ref={firstInputRef} />
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
        <OTPButton
          onClick={handleVerifyOtp}
          otp={otp}
          setOtpError={setOtpError}
        />
        <div className="flex h-8 items-end space-x-1">
          {/* Add form errors here */}
        </div>
      </form>
    </div>
  );
}

// Correctly defining the function to accept props
function OTPButton({
  onClick,
  otp,
  setOtpError,
}: {
  onClick: (e: any, otp: string, setOtpError: (msg: string) => void) => void;
  otp: string;
  setOtpError: (msg: string) => void;
}) {
  return (
    <button
      type="submit"
      className="mt-10 flex w-full justify-center rounded-md bg-[#1b3b67] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#1b3b67]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      onClick={(e) => onClick(e, otp, setOtpError)}
    >
      Submit
    </button>
  );
}
