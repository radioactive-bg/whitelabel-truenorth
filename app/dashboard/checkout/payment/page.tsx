'use client';
import { useState, CSSProperties, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useRouter, useSearchParams } from 'next/navigation';

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

  useEffect(() => {
    setTimeout(() => {
      //setLoading(false);
      router.push(`/dashboard/checkout/downloadCodes?orderId=${orderId}`);
    }, 3000);
  }, [orderId, router]);

  return (
    <div className="sweet-loading mt-32">
      <ClipLoader
        color={'purple'}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Payment;
