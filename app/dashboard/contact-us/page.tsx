'use client';

import { useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { userStore, getUserProfile } from '@/state/user';
import { User } from '@/app/lib/types/user';

export default function ContactPage() {
  const { user } = userStore() as {
    user: User;
  };

  useEffect(() => {
    console.log('User:', user);
    let accessToken = localStorage.getItem('access_token');
    if (user.email == 'some.email@gmail.com' && accessToken !== null) {
      getUserProfile(accessToken);
    }
  }, []);

  return (
    <div className="container mx-auto  px-4 py-12 text-black  dark:text-white">
      {/* change lg:grid-cols-1 to lg:grid-cols-2 when you implement the form */}
      <div className="grid gap-8 lg:grid-cols-1 lg:gap-16">
        {/* Left Column - Form */}
        {/* <div className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold dark:text-gray-300">
              Contact Us
            </h1>
            <h2 className="text-3xl font-bold dark:text-gray-200">
              Get in touch with us. Our Financial Department is here to assist
              you.
            </h2>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="company">Company name *</Label>
              <Input
                id="company"
                required
                className="bg-white text-black hover:border-black focus-visible:ring-black dark:bg-gray-800 dark:text-white dark:hover:border-white dark:focus-visible:ring-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                className="bg-white text-black hover:border-black focus-visible:ring-black dark:bg-gray-800 dark:text-white dark:hover:border-white dark:focus-visible:ring-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID *</Label>
              <Input
                id="orderId"
                required
                className="bg-white text-black hover:border-black focus-visible:ring-black dark:bg-gray-800 dark:text-white dark:hover:border-white dark:focus-visible:ring-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestType">Type of request *</Label>
              <Select>
                <SelectTrigger className="bg-white text-black hover:border-black focus-visible:ring-black dark:bg-gray-800 dark:text-white dark:hover:border-white dark:focus-visible:ring-white">
                  <SelectValue placeholder="Select type of request" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
                  <SelectItem value="listbox">Listbox</SelectItem>
                  <SelectItem value="upload">Upload</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional information</Label>
              <Textarea
                id="additionalInfo"
                placeholder="Write a few sentences about yourself."
                className="min-h-[120px] bg-white text-black hover:border-black focus-visible:ring-black dark:bg-gray-800 dark:text-white dark:hover:border-white dark:focus-visible:ring-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-black hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-gray-300"
            >
              Send
            </Button>
          </form>
        </div> */}

        {/* Right Column - Image and Contact Options */}
        <div className="flex flex-col items-center justify-center space-y-8 ">
          <Image
            src="/call-sign-with-message.png"
            alt="Contact illustration"
            width={352.14}
            height={320.91}
            className=""
          />

          <div className="w-full max-w-md rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-gray-200">
              Contact Via
            </h3>
            <div className="flex gap-4">
              <Link
                href="https://wa.me/+971526884701"
                className="flex-1"
                target="_blank"
              >
                <Button className="w-full bg-[#25D366] font-bold text-white hover:bg-[#25D366]/90  dark:hover:bg-[#1b6b47]/90">
                  <Image
                    src="/Whatsapp.svg"
                    alt="Contact illustration"
                    width={40.42}
                    height={40.42}
                    className=""
                  />
                  Whatsapp
                </Button>
              </Link>
              <Link
                href="https://t.me/HKSGLOBAL"
                className="flex-1"
                target="_blank"
              >
                <Button className="w-full bg-[#0088cc] font-bold text-white hover:bg-[#0088cc]/90  dark:hover:bg-[#005b8c]/90">
                  <Image
                    src="/Telegram.svg"
                    alt="Contact illustration"
                    width={40.42}
                    height={40.42}
                    className=""
                  />
                  Telegram
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
