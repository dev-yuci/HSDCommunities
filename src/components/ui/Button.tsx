"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'primary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
  return (
    <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
          {
            "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800": variant === 'default' || variant === 'primary',
            "bg-red-600 text-white hover:bg-red-700 active:bg-red-800": variant === 'destructive',
            "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === 'outline',
            "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700": variant === 'secondary',
            "hover:bg-accent hover:text-accent-foreground": variant === 'ghost',
            "text-blue-600 underline-offset-4 hover:underline": variant === 'link',
          },
          {
            "h-10 py-2 px-4 text-sm": size === 'default',
            "h-9 px-3 rounded-md text-xs": size === 'sm',
            "h-11 px-8 rounded-md text-base": size === 'lg',
            "h-10 w-10": size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
export default Button 