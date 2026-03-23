import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-sm text-[#0f172a] shadow-sm transition-all duration-200 outline-none placeholder:text-[#94a3b8] focus-visible:border-[#2563eb] focus-visible:ring-2 focus-visible:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[#ef4444] aria-invalid:ring-2 aria-invalid:ring-[#ef4444]/20",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
