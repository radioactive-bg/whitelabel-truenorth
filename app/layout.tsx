'use client';
import '@/app/ui/global.css';
import { publicSans } from '@/app/ui/fonts';
import { Inter } from 'next/font/google';
import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer/Footer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const shouldShowFooter = !['/', '/login'].includes(pathname);

  return (
    <html lang="en" className="">
      <body
        className={`${publicSans.className} min-h-[100vh] bg-gray-50 antialiased dark:bg-gray-900 `}
      >
        {children}
        {shouldShowFooter && <Footer />}
      </body>
    </html>
  );
}
