import '@/app/ui/global.css';
import { publicSans } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={`${publicSans.className} h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
