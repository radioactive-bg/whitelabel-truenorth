'use client';
import React, { useState, useEffect } from 'react';
import Logo from '@/app/ui/logo';
import LoginForm from '@/app/ui/login/login-form';
import OTPForm from '@/app/ui/login/OTP-form';

import { userStore, getUserProfile } from '@/state/user';
import { User } from '@/app/lib/types/user';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, setUser } = userStore() as {
    user: User;
    setUser: (user: User) => void;
  };
  const { auth, setAuth } = authStore() as {
    auth: Auth;
    setAuth: (auth: Auth) => void;
  };

  const router = useRouter();

  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleLogin = async (e: any, email: string, password: string) => {
    e.preventDefault();

    try {
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

      if (data.access_token) {
        let authInfo: Auth = {
          access_token: data.access_token,
          access_token_expires: data.expires_in,
          refresh_token: data.refresh_token,
          isLoggedIn: true,
        };
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem(
          'access_token_expires',
          data.expires_in.toString(),
        );

        setAuth(authInfo);
        setShowOtpForm(true);
        await getUserProfile(data.access_token);
        //console.log('getUserProfile: '+JSON.stringify(user))
      } else {
        console.log('else Login Error:', data);
        alert(data.message);
      }
    } catch (error) {
      console.error('catch Login Error:', error);
      alert('Failed to login');
    }
  };

  const handleVerifyOtp = async (e: any, otp: string) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/distributor-crm/v1/check-2fa`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.access_token}`,
          },
          body: JSON.stringify({ code: otp }),
        },
      );
      const data = await response.json();

      if (data.status === 'success') {
        setTimeout(() => {
          setShowOtpForm(false);
        }, 2000);

        router.push('/dashboard'); // Redirects to the dashboard page
      } else {
        // alert(data.message);
      }
    } catch (error) {
      console.error('OTP Error:', error);
      //alert('Failed to verify OTP');
    }
  };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        {showOtpForm ? (
          <OTPForm
            handleVerifyOtp={handleVerifyOtp}
            showOtpForm={showOtpForm}
          />
        ) : (
          <LoginForm handleLogin={handleLogin} />
        )}
      </div>
    </main>
  );
}
