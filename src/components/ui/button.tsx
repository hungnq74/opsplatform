"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2563eb]/25 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#1e3a5f] text-white shadow-sm hover:bg-[#162d4a]",
        outline:
          "border-[#e2e8f0] bg-white text-[#334155] shadow-sm hover:bg-[#f8fafc] hover:text-[#1e293b]",
        secondary:
          "bg-[#f1f5f9] text-[#334155] hover:bg-[#e2e8f0]",
        ghost:
          "hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#334155]",
        destructive:
          "bg-[#ef4444] text-white shadow-sm hover:bg-[#dc2626]",
        link: "text-[#1e3a5f] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-2 px-4 py-2",
        xs: "h-6 gap-1 px-2 text-xs rounded-md",
        sm: "h-8 gap-1.5 px-3 text-[13px] rounded-md",
        lg: "h-11 gap-2 px-6 text-[15px]",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3 rounded-md",
        "icon-sm": "size-8 rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
