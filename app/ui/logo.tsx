'use client';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Logo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Image
        src="/HKS-Logo.svg"
        width={130}
        height={40}
        alt="Screenshots of the dashboard project showing desktop version"
        priority
      />
    </div>
  );
}
