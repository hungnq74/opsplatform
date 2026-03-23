import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#1e3a5f] text-white",
        secondary:
          "bg-[#f1f5f9] text-[#475569]",
        destructive:
          "bg-[#fef2f2] text-[#dc2626]",
        outline:
          "border-[#e2e8f0] text-[#475569] bg-white",
        success:
          "bg-[#ecfdf5] text-[#059669]",
        warning:
          "bg-[#fffbeb] text-[#d97706]",
        danger:
          "bg-[#fef2f2] text-[#dc2626]",
        info:
          "bg-[#eff6ff] text-[#2563eb]",
        ghost:
          "bg-[#f1f5f9] text-[#64748b]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
