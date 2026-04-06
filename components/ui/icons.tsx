import { cn } from "@/lib/utils"

/**
 * Vertical three-dot accessory icon used in pill inputs.
 */
export function ThreeDotsVertical({ className }: { className?: string }) {
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
  )
}
