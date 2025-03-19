'use client';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function LogoWhite() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/HKS-Logo-White.svg"
        width={130}
        height={40}
        alt="HKS Logo"
        priority
      />
    </div>
  );
}
