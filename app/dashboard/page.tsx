'use client';
import { useEffect } from 'react';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';

export default function CatalogPage() {
  const router = useRouter();
  const { auth } = authStore() as {
    auth: Auth;
  };

  useEffect(() => {
    const localValue = localStorage.getItem('access_token') || 'no value';
    //console.log('localValue: ', localValue);
    //console.log('auth.access_token: ', auth.access_token);

    if (localValue === 'no value') {
      router.push('/login');
      return;
    }
  }, [auth.access_token]);
  return <p>Home Page</p>;
}
