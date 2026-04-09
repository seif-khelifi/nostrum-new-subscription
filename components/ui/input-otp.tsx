"use client"

import * as React from "react"
import { OTPInput, OTPInputContext } from "input-otp"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { MinusIcon } from "lucide-react"

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "cn-input-otp flex items-center has-disabled:opacity-50",
        containerClassName
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn(
        "flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

const inputOtpSlotVariants = cva(
  [
    "relative flex items-center justify-center border-y border-r outline-none transition-all",
    "first:rounded-l-lg first:border-l last:rounded-r-lg",
    "aria-invalid:border-destructive",
    "data-[active=true]:z-10",
    "data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20",
    "dark:data-[active=true]:aria-invalid:ring-destructive/40",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "size-8 border-input text-sm",
          "dark:bg-input/30",
          "data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50",
        ].join(" "),
        otp: [
          "size-8 sm:size-10 text-base sm:text-lg font-semibold transition-colors duration-200",
          "data-[filled=false]:border-[#E9E3DD] data-[filled=false]:bg-[#F3E5FA] data-[filled=false]:text-[#490076]",
          "data-[filled=true]:border-[#490076] data-[filled=true]:bg-[#490076] data-[filled=true]:text-white",
          "data-[active=true]:border-[#C86FFE] data-[active=true]:ring-2 data-[active=true]:ring-[#C86FFE]/40",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function InputOTPSlot({
  index,
  variant,
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof inputOtpSlotVariants> & {
    index: number
  }) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      data-filled={!!char}
      className={cn(inputOtpSlotVariants({ variant }), className)}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-separator"
      className="flex items-center [&_svg:not([class*='size-'])]:size-4"
      role="separator"
      {...props}
    >
      <MinusIcon
      />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
