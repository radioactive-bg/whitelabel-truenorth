'use client';
import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchOrderPage } from '@/app/lib/api/orders';
import { authStore, Auth } from '@/state/auth';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { checkCredit } from '@/app/lib/api/wallet';

export default function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const router = useRouter();

  const { auth } = authStore() as {
    auth: Auth;
  };

  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [invoice, setInoice] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const accessToken =
          auth.access_token || localStorage.getItem('access_token');

        if (!accessToken) {
          router.push('/login');
        }

        const TotalPages = await fetchOrderPage(auth.access_token, 1);
        const test = await checkCredit(auth.access_token);
        setLoading(false);
        setTotalPages(TotalPages);
      } catch (err) {
        console.error('Error fetching invoices:', err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="w-full">
      {/* <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div> */}
      {loading === true ? (
        <div>Loading...</div>
      ) : (
        <>
          <div>totalPages: {totalPages}</div>
        </>
      )}
      <button>fetch invoices</button>
    </div>
  );
}
