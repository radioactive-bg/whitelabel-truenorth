import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  DialogProps,
  DialogTitleProps,
  DescriptionProps,
} from '@headlessui/react';
import clsx from 'clsx';
import type React from 'react';
import { Text } from './text';

const sizes = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
};

// A utility function to validate and pick only the allowed props
const pickDialogProps = (props: any) => {
  const allowedKeys: (keyof DialogProps)[] = [
    'open',
    'onClose',
    'initialFocus',
    'static',
  ];
  return Object.keys(props)
    .filter((key) => allowedKeys.includes(key as keyof DialogProps))
    .reduce((acc, key) => {
      acc[key as keyof DialogProps] = props[key as keyof DialogProps];
      return acc;
    }, {} as DialogProps);
};

export function CustomDialog({
  size = 'md',
  className,
  children,
  ...props
}: {
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
} & Omit<DialogProps, 'as' | 'className'>) {
  const validDialogProps = pickDialogProps(props);

  return (
    <Dialog {...validDialogProps}>
      <DialogBackdrop
        transition
        className="bg-zinc-950/15 fixed inset-0 flex w-screen justify-center overflow-y-auto px-2 py-2 transition duration-100 focus:outline-0 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in dark:bg-zinc-950/50 sm:px-6 sm:py-8 lg:px-8 lg:py-16"
      />

      <div className="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
        <div className="grid min-h-full grid-rows-[1fr_auto_1fr] justify-items-center p-8 sm:grid-rows-[1fr_auto_3fr] sm:p-4">
          <DialogPanel
            transition={false}
            className={clsx(
              className,
              sizes[size],
              'forced-colors:outline row-start-2 w-full rounded-2xl bg-white p-8 shadow-lg ring-1 ring-zinc-950/10 dark:bg-zinc-900 dark:ring-white/10 sm:rounded-2xl sm:p-6',
              'transition duration-100 will-change-transform data-[closed]:data-[enter]:scale-95 data-[closed]:opacity-0 data-[enter]:ease-out data-[leave]:ease-in',
            )}
          >
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export function CustomDialogTitle({
  className,
  ...props
}: { className?: string } & Omit<DialogTitleProps, 'as' | 'className'>) {
  return (
    <DialogTitle
      {...props}
      className={clsx(
        className,
        'text-balance sm:text-wrap text-center text-base/6 font-semibold text-zinc-950 dark:text-white sm:text-left sm:text-sm/6',
      )}
    />
  );
}

export function CustomDialogDescription({
  className,
  ...props
}: { className?: string } & Omit<
  DescriptionProps<typeof Text>,
  'as' | 'className'
>) {
  return (
    <Description
      as={Text}
      {...props}
      className={clsx(className, 'text-pretty mt-2 text-center sm:text-left')}
    />
  );
}

export function CustomDialogBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return <div {...props} className={clsx(className, 'mt-4')} />;
}

export function CustomDialogActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        '*:w-full sm:*:w-auto mt-6 flex flex-col-reverse items-center justify-end gap-3 sm:mt-4 sm:flex-row',
      )}
    />
  );
}
