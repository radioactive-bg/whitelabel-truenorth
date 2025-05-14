'use client';
import React, { useState, useEffect } from 'react';
import LogoWhite from '@/app/ui/logo-white';
import LoginForm from '@/app/ui/login/login-form';
import OTPForm from '@/app/ui/login/OTP-form';
import FirstTimeLoginQRCode from '@/app/ui/login/FirstTimeLoginQRCode';

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
  const [showQRCode, setShowQRCode] = useState(false);

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
        // Check if the current URL matches the target URL
        if (window.location.origin === 'https://dev.b2b.hksglobal.group') {
          console.log('URL matched. Redirecting to dashboard...');
          // setTimeout(() => {
          router.push('/dashboard'); // Redirect to the dashboard
          // }, 1000);
        }
        //  else {
        //   setShowOtpForm(true); // Show OTP form if the condition is not met
        // }
        const userProfile = await getUserProfile(data.access_token);
        if (userProfile.is2FAEnable) {
          setShowOtpForm(true);
        } else {
          setShowQRCode(true);
        }
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

  const handleVerifyOtp = async (
    e: any,
    otp: string,
    setOtpError: (msg: string) => void,
  ) => {
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
        setOtpError('The OTP code is incorrect. Please try again.');
      }
    } catch (error) {
      console.error('OTP Error:', error);
      //alert('Failed to verify OTP');
      setOtpError('Failed to verify OTP. Please try again later.');
    }
  };

  const handleQRCodeScanned = () => {
    setShowQRCode(false);
    setShowOtpForm(true);
  };

  return (
    <main className="flex h-screen w-screen flex-col flex-wrap md:flex-row">
      {/* Right Section with Dynamic Login Content */}
      <div
        className="flex w-full  flex-col justify-between bg-gradient-to-t from-white to-blue-700 px-8 py-8 md:order-last md:h-full md:w-1/2 lg:px-16 lg:py-16"
        style={{
          background:
            'linear-gradient(135deg, #FFD700 0%, #FF4500 50%, #000000 100%)',
        }}
      >
        {/* Logo at the top */}
        <div className="flex justify-start">
          <LogoWhite />
        </div>

        {/* Content at the bottom */}
        <div className="flex flex-col items-start text-left lg:pb-12">
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:mt-6 md:text-5xl">
            Distribution Hub
          </h1>
          <p className="mt-4 text-lg leading-8 text-white md:text-2xl">
            Empower your business with streamlined distribution of digital
            products
          </p>
        </div>
      </div>
      {/* Left Section with Dynamic Login Content */}
      <div className="flex w-full justify-center bg-white md:h-full md:w-1/2 md:items-center">
        <div className="w-full max-w-[400px]">
          {showQRCode ? (
            <FirstTimeLoginQRCode onQRCodeScanned={handleQRCodeScanned} />
          ) : showOtpForm ? (
            <OTPForm
              handleVerifyOtp={handleVerifyOtp}
              showOtpForm={showOtpForm}
            />
          ) : (
            <LoginForm handleLogin={handleLogin} />
          )}
        </div>
      </div>
    </main>
  );
}
