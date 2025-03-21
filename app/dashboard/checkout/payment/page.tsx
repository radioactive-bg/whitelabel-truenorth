'use client';
import { useState, CSSProperties, useEffect, Suspense } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCartStore } from '@/state/shoppingCart';
import { useWalletStore, Wallet } from '@/state/wallets';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
  borderColor: '#3f51b5',
};

const Payment = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  let [loading, setLoading] = useState(true);

  const { clearCart } = useCartStore();

  const { fetchWallets } = useWalletStore();

  useEffect(() => {
    setTimeout(() => {
      //setLoading(false);
      router.push(`/dashboard/checkout/downloadCodes?orderId=${orderId}`);
      clearCart();
      // fetchWallets();
    }, 3000);
  }, [orderId]);

  return (
    <div className="sweet-loading mt-32">
      <ClipLoader
        color={'black'}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

const PaymentPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Payment />
  </Suspense>
);

export default PaymentPage;
