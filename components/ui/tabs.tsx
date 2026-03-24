"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-2 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex items-center justify-center text-muted-foreground group-data-horizontal/tabs:h-auto group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        default: "w-fit rounded-lg bg-muted p-[3px]",
        line: "w-fit gap-1 rounded-none bg-transparent p-0",
        essential:
          "w-full flex rounded-full bg-[#FBF4EA] p-1 gap-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const tabsTriggerVariants = cva(
  [
    "relative inline-flex items-center justify-center whitespace-nowrap transition-all outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "h-[calc(100%-1px)] flex-1 gap-1.5 rounded-md border border-transparent px-1.5 py-0.5",
          "text-sm font-medium text-foreground/60 hover:text-foreground",
          "data-active:bg-background data-active:text-foreground",
          "dark:text-muted-foreground dark:hover:text-foreground",
          "dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground",
          "group-data-[variant=default]/tabs-list:data-active:shadow-sm",
        ].join(" "),
        line: [
          "h-auto flex-1 gap-1.5 rounded-none border border-transparent px-1.5 py-2",
          "text-sm font-medium text-foreground/60 hover:text-foreground",
          "bg-transparent data-active:bg-transparent data-active:shadow-none",
          "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity",
          "group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5",
          "group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5",
          "group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        ].join(" "),
        essential: [
          "flex-1 min-h-[36px] gap-1.5 rounded-full border border-transparent px-3 py-1.5",
          "text-xs font-semibold text-[#9000E3]",
          "bg-transparent",
          "hover:bg-white/70",
          "data-active:bg-white data-active:text-[#9000E3]",
          "data-active:shadow-none",
        ].join(" "),
      },
      hasIcon: {
        true: "gap-2",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      hasIcon: false,
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger> &
  VariantProps<typeof tabsTriggerVariants> & {
    icon?: React.ReactNode
  }

function TabsTrigger({
  className,
  variant = "default",
  icon,
  children,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      data-variant={variant}
      className={cn(
        tabsTriggerVariants({
          variant,
          hasIcon: !!icon,
        }),
        className
      )}
      {...props}
    >
      {icon ? <span className="inline-flex items-center">{icon}</span> : null}
      <span>{children}</span>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  )
}

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tabsListVariants,
  tabsTriggerVariants,
}
