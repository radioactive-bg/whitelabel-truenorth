'use client';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Logo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/TRUE NORTH.png"
        width={200}
        height={100}
        alt="HKS Logo"
        priority
      />
    </div>
  );
}
