"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type PillInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  className?: string;
  inputClassName?: string;
  onAccessoryClick?: () => void;
  hasError?: boolean;
  minTextWidth?: number;
};

function ThreeDotsVertical({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex flex-col items-center justify-center gap-[2px]",
        className,
      )}
    >
      <span className="size-[2.5px] rounded-full bg-current" />
      <span className="size-[2.5px] rounded-full bg-current" />
      <span className="size-[2.5px] rounded-full bg-current" />
    </span>
  );
}

const INPUT_LEFT_PADDING = 14; // px
const INPUT_RIGHT_PADDING = 10; // px
const CARET_BUFFER = 10; // px

const PillInput = React.forwardRef<HTMLInputElement, PillInputProps>(
  (
    {
      className,
      inputClassName,
      onAccessoryClick,
      value,
      defaultValue,
      placeholder,
      hasError,
      onChange,
      minTextWidth = 120,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = React.useState(
      String(value ?? defaultValue ?? ""),
    );

    React.useEffect(() => {
      if (isControlled) {
        setInternalValue(String(value ?? ""));
      }
    }, [isControlled, value]);

    const currentValue = isControlled ? String(value ?? "") : internalValue;
    const filled = currentValue.length > 0;

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) setInternalValue(e.target.value);
        onChange?.(e);
      },
      [isControlled, onChange],
    );

    const sizerRef = React.useRef<HTMLSpanElement>(null);
    const [inputWidth, setInputWidth] = React.useState(minTextWidth);

    const displayText = currentValue || placeholder || "\u00A0";

    React.useLayoutEffect(() => {
      if (!sizerRef.current) return;

      const textWidth = sizerRef.current.scrollWidth;
      const nextWidth = Math.max(
        minTextWidth,
        textWidth + INPUT_LEFT_PADDING + INPUT_RIGHT_PADDING + CARET_BUFFER,
      );

      setInputWidth(nextWidth);
    }, [displayText, minTextWidth]);

    return (
      <div
        className={cn(
          "group relative inline-flex h-9 w-fit items-center overflow-hidden rounded-xl",
          "transition-[background-color,box-shadow] duration-200 ease-out",
          "hover:ring-2 hover:ring-primary/10",
          "focus-within:ring-2 focus-within:ring-primary/20",
          filled ? "bg-[#490076] text-white" : "bg-[#F3E5FA] text-[#490076]",
          "[&:has(input:-webkit-autofill)]:bg-[#490076] [&:has(input:-webkit-autofill)]:text-white",
          hasError &&
            "ring-2 ring-red-500/60 hover:ring-red-500/80 focus-within:ring-red-500/80",
          className,
        )}
      >
        <span
          ref={sizerRef}
          aria-hidden
          className={cn(
            "pointer-events-none invisible absolute left-0 top-0 h-0 overflow-hidden whitespace-pre",
            "text-[15px] font-medium leading-none",
            inputClassName,
          )}
        >
          {displayText}
        </span>

        <input
          ref={ref}
          data-slot="pill-input"
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          style={{ width: inputWidth }}
          className={cn(
            "box-border h-full shrink-0 bg-transparent text-[15px] font-medium outline-none",
            "pl-[14px] pr-[10px]",
            "min-w-0",
            filled
              ? "text-white placeholder:text-white/60"
              : "text-[#490076] placeholder:text-[#490076]/60",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            "selection:bg-white/30 selection:text-inherit",

            "[&:-webkit-autofill]:[-webkit-text-fill-color:white]",
            "[&:-webkit-autofill]:[caret-color:white]",
            "[&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#490076_inset]",
            "[&:-webkit-autofill:hover]:[box-shadow:0_0_0_1000px_#490076_inset]",
            "[&:-webkit-autofill:focus]:[box-shadow:0_0_0_1000px_#490076_inset]",
            "[&:-webkit-autofill]:[transition:background-color_9999s_ease-out_0s]",

            inputClassName,
          )}
          {...props}
        />

        <button
          type="button"
          tabIndex={-1}
          aria-label="Options"
          onClick={onAccessoryClick}
          className={cn(
            "mr-1 inline-flex h-6 w-5 shrink-0 items-center justify-center rounded-md",
            "transition-[transform,opacity,background-color,color] duration-200 ease-out",
            filled ? "bg-white/20 text-white" : "bg-[#490076] text-white",
            "hover:opacity-90 active:scale-95",
          )}
        >
          <ThreeDotsVertical />
        </button>
      </div>
    );
  },
);

PillInput.displayName = "PillInput";

export { PillInput };
