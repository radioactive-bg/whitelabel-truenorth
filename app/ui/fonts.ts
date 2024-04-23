import { Public_Sans, Roboto, Lusitana } from 'next/font/google';

export const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700'],
});

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '400', '700'],
});

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});
