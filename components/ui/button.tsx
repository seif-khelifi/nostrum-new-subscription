import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap",
    "transition-all duration-200 ease-out outline-none select-none",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "active:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",

        ctaPurple:
          [
            "h-12 rounded-full px-6 border-transparent",
            "bg-[#490076] text-white text-base font-semibold",
            "shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
            "hover:bg-[#5a0a8f]",
            "active:translate-y-[1px]",
            "disabled:bg-[#490076]/40",
          ].join(" "),

        selectOption:
          [
            "h-12 rounded-[20px] px-5 text-base font-medium",
            "border bg-white text-[#490076]",
            "border-input shadow-xs",
            "hover:border-[#C86FFE]/70 hover:bg-[#faf7fc]",
            "active:scale-[0.985]",
          ].join(" "),
      },

      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
        cta: "h-12 gap-2 px-6",
        select: "h-12 gap-2 px-5",
      },

      selected: {
        true: "",
        false: "",
      },
    },

    compoundVariants: [
      {
        variant: "selectOption",
        selected: true,
        className: [
          "border-[#C86FFE] text-[#490076]",
          "shadow-[0_0_0_4px_rgba(200,111,254,0.35)]",
          "hover:border-[#C86FFE] hover:bg-white",
        ].join(" "),
      },
      {
        variant: "selectOption",
        selected: false,
        className: [
          "border-[#E9E3DD]",
          "shadow-none",
        ].join(" "),
      },
    ],

    defaultVariants: {
      variant: "default",
      size: "default",
      selected: false,
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  selected = false,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, selected, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
