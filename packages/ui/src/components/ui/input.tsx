import * as React from "react"

import { cn } from "@/lib/utils"
import { inputBaseClasses } from "./input.styles"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputBaseClasses, className)}
      {...props}
    />
  )
}

export { Input }
