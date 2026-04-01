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
      ...props
    },
    ref,
  ) => {
    // Track the display value — works with both controlled (value prop)
    // and uncontrolled (react-hook-form register / defaultValue) inputs.
    const innerRef = React.useRef<HTMLInputElement | null>(null);

    const [displayValue, setDisplayValue] = React.useState(
      String(value ?? defaultValue ?? ""),
    );

    // Sync when the controlled `value` prop changes
    React.useEffect(() => {
      if (value !== undefined) {
        setDisplayValue(String(value ?? ""));
      }
    }, [value]);

    // For uncontrolled inputs (e.g. react-hook-form register), read the
    // DOM value after mount so pre-filled defaults are picked up.
    React.useEffect(() => {
      if (value === undefined && innerRef.current) {
        const domVal = innerRef.current.value;
        if (domVal) setDisplayValue(domVal);
      }
    }, [value]);

    const filled = displayValue.length > 0;

    const handleChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayValue(e.target.value);
        onChange?.(e);
      },
      [onChange],
    );

    // Merge the forwarded ref with our internal ref
    const mergedRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            node;
      },
      [ref],
    );

    const valueSizerRef = React.useRef<HTMLSpanElement>(null);
    const placeholderSizerRef = React.useRef<HTMLSpanElement>(null);
    const [inputWidth, setInputWidth] = React.useState<number | undefined>(
      undefined,
    );

    const measure = React.useCallback(() => {
      const padding = INPUT_LEFT_PADDING + INPUT_RIGHT_PADDING + CARET_BUFFER;

      if (filled && valueSizerRef.current) {
        const textWidth = valueSizerRef.current.scrollWidth;
        setInputWidth(textWidth + padding);
      } else if (placeholderSizerRef.current) {
        const placeholderWidth = placeholderSizerRef.current.scrollWidth;
        setInputWidth(placeholderWidth + padding);
      }
    }, [filled]);

    // Measure on value / placeholder changes
    React.useLayoutEffect(() => {
      measure();
    }, [displayValue, placeholder, filled, measure]);

    // Re-measure after fonts finish loading (scrollWidth may change)
    React.useEffect(() => {
      document.fonts?.ready?.then(() => measure());
    }, [measure]);

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
        {/* Hidden sizer for the actual value text */}
        <span
          ref={valueSizerRef}
          aria-hidden
          className={cn(
            "pointer-events-none invisible absolute left-0 top-0 h-0 overflow-hidden whitespace-pre",
            "text-[15px] font-medium leading-none",
            inputClassName,
          )}
        >
          {displayValue || "\u00A0"}
        </span>

        {/* Hidden sizer for the placeholder text */}
        <span
          ref={placeholderSizerRef}
          aria-hidden
          className={cn(
            "pointer-events-none invisible absolute left-0 top-0 h-0 overflow-hidden whitespace-pre",
            "text-[15px] font-medium leading-none",
            inputClassName,
          )}
        >
          {placeholder || "\u00A0"}
        </span>

        <input
          ref={mergedRef}
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
