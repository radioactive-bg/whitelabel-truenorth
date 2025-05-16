'use client';
import React, { useState, useEffect } from 'react';
import LogoWhite from '@/app/ui/logo-white';
import LoginForm from '@/app/ui/login/login-form';
// import OTPForm from '@/app/ui/login/OTP-form';
// import FirstTimeLoginQRCode from '@/app/ui/login/FirstTimeLoginQRCode';

import { userStore, getUserProfile } from '@/state/user';
import { User } from '@/app/lib/types/user';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';
import OTPForm from './ui/login/OTP-form';
import FirstTimeLoginQRCode from './ui/login/FirstTimeLoginQRCode';

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
  const [accessToken, setAccessToken] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');
  const [accessTokenExpires, setAccessTokenExpires] = useState<number>(0);
  // const handleLogin = async (e: any, email: string, password: string) => {
  //   e.preventDefault();

  //   try {
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/oauth/token`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/x-www-form-urlencoded',
  //           'Cache-Control': 'no-cache',
  //         },
  //         body: new URLSearchParams({
  //           grant_type: 'password',
  //           username: email,
  //           password: password,
  //         }),
  //       },
  //     );
  //     const data = await response.json();

  //     if (data.access_token) {
  //       const userProfile = await getUserProfile(data.access_token);
  //       setAuth({
  //         access_token: data.access_token,
  //         access_token_expires: data.expires_in,
  //         refresh_token: data.refresh_token,
  //         isLoggedIn: false,
  //       });
  //       if (userProfile.is2FAEnable) {
  //         setUser(userProfile);
  //         setShowQRCode(true);
  //         setShowOtpForm(true);
  //       } else {
  //         setUser(userProfile);
  //         setShowQRCode(true);
  //       }
  //     } else {
  //       console.log('Login Error:', data);
  //       alert(data.message);
  //     }
  //   } catch (error) {
  //     console.error('Login Error:', error);
  //     alert('Failed to login');
  //   }
  // };
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
        // Store token temporarily in state but don't set isLoggedIn to true yet
        // Also don't save to localStorage or Zustand at this stage
        setAccessToken(data.access_token);
        setRefreshToken(data.refresh_token);
        setAccessTokenExpires(data.expires_in);

        // Get user profile with the token
        const userProfile = await getUserProfile(data.access_token);
        setUser(userProfile);

        // Show appropriate next step based on 2FA status
        if (userProfile.is2FAEnable) {
          setShowOtpForm(true);
        } else {
          setShowQRCode(true);
        }
      } else {
        console.log('Login Error:', data);
        alert(data.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Failed to login');
    }
  };

  const handleQRCodeScanned = () => {
    setShowQRCode(false);
    setShowOtpForm(true);
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
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ code: otp }),
        },
      );
      const data = await response.json();
      if (data.status === 'success') {
        // Now set tokens in localStorage and mark as logged in
        setAuth({
          access_token: accessToken,
          access_token_expires: accessTokenExpires,
          refresh_token: refreshToken,
          isLoggedIn: true,
        });
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem(
          'access_token_expires',
          accessTokenExpires.toString(),
        );
        setTimeout(() => {
          setShowOtpForm(false);
          setShowQRCode(false);
          router.push('/dashboard');
        }, 2000);
      } else {
        setOtpError('The OTP code is incorrect. Please try again.');
      }
    } catch (error) {
      console.error('OTP Error:', error);
      setOtpError('Failed to verify OTP. Please try again later.');
    }
  };

  return (
    <main className="flex h-screen w-screen flex-col flex-wrap md:flex-row">
      {/* Right Section with Dynamic Login Content */}
      <div
        className="flex w-full  flex-col justify-between bg-gradient-to-t from-white to-blue-700 px-8 py-8 md:order-last md:h-full md:w-1/2 lg:px-16 lg:py-16"
        style={{
          background:
            'linear-gradient(135deg, white 0%,#0d9551 50%, #0b2a62 100%)',
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
