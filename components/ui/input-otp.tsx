'use client';
import React, {
  useEffect,
  useRef,
  useContext,
  forwardRef,
  useCallback,
} from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { Dot } from 'lucide-react';

import { cn } from '@/lib/utils';

const InputOTP = forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => {
  // Determine the container class name based on whether ref is passed
  const finalContainerClassName = cn(
    'flex items-center gap-2 has-[:disabled]:opacity-50',
    ref ? 'focus:ring-2 focus:ring-indigo-600 focus:border-transparent' : '',
    containerClassName,
  );

  return (
    <OTPInput
      ref={ref}
      containerClassName={finalContainerClassName}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
});
InputOTP.displayName = 'InputOTP';

const InputOTPGroup = forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center', className)} {...props} />
));
InputOTPGroup.displayName = 'InputOTPGroup';

const InputOTPSlot = forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { index: number }
>(({ index, className, ...props }, forwardedRef) => {
  const inputOTPContext = useContext(OTPInputContext) as any;
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

  const localRef = useRef<HTMLDivElement>(null);

  const combinedRef = useCallback(
    (node: HTMLDivElement) => {
      if (forwardedRef) {
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (
            forwardedRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
        }
      }
      (localRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node;
    },
    [forwardedRef],
  );

  useEffect(() => {
    if (index === 0 && localRef.current) {
      localRef.current.focus();
    }
  }, [index]);

  return (
    <div
      ref={combinedRef}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md',
        isActive && 'z-10 ring-2 ring-ring ring-offset-background',
        className,
      )}
      tabIndex={index === 0 ? 0 : -1} // Make the first slot focusable
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  );
});
InputOTPSlot.displayName = 'InputOTPSlot';

const InputOTPSeparator = forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = 'InputOTPSeparator';

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
