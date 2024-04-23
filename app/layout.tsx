import '@/app/ui/global.css';
import { publicSans } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${publicSans.className} antialiased`}>{children}</body>
    </html>
  );
}
