'use client';
import '@/app/ui/global.css';
import { publicSans } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body
        className={`${publicSans.className} min-h-[100vh] bg-gray-50 antialiased dark:bg-gray-900 `}
      >
        {children}
      </body>
    </html>
  );
}
