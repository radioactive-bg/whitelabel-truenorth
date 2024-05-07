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
    if (!auth.access_token) {
      router.push('/login');
      return;
    }
  }, []);
  return <p>Catalog Page</p>;
}
