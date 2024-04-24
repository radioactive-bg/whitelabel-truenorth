'use client';
import React, { useState } from 'react';
import Logo from '@/app/ui/logo';
import LoginForm from '@/app/ui/login/login-form';
import OTPForm from '@/app/ui/login/OTP-form';

import { userStore } from '@/store/user';
import { access } from 'fs';

export default function LoginPage() {
  const user = userStore((state: any) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      console.log('email:', email);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/oauth/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cache-Control': 'no-cache',
          },
          body: new URLSearchParams({
            grant_type: 'password',
            username: email,
            password: password,
          }),
        },
      );
      const data = await response.json();

      if (data.success) {
        //const user = await getUserProfile();
        user.setAccesToken(data.access_token);

        console.log('User:', user);
        setShowOtpForm(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Failed to login');
    }
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.success) {
        user.setUser(data.user);
        setShowOtpForm(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('OTP Error:', error);
      alert('Failed to verify OTP');
    }
  };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-center rounded-lg bg-gray-50 p-3 md:h-36">
          <div className="w-32  md:w-36">
            <Logo />
          </div>
        </div>
        {showOtpForm ? (
          <OTPForm
            otp={otp}
            setOtp={setOtp}
            handleVerifyOtp={handleVerifyOtp}
          />
        ) : (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
        )}
      </div>
    </main>
  );
}
