import { ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ElementType
  iconPosition?: "left" | "right"
}

export function InteractiveHoverButton({
  children,
  icon: Icon = ArrowRight,
  iconPosition = "right",
  className,
  ...props
}: InteractiveHoverButtonProps) {
  return (
    <button
      className={cn(
        "group bg-background relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold",
        className
      )}
      {...props}
    >
      {/* Normal */}
      <div className="flex items-center justify-center gap-2">
        <div className="bg-primary h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[30]" />

        <span
          className="
            inline-block 
            transition-all 
            duration-300 
            group-hover:translate-x-12 
            group-hover:opacity-0
          "
        >
          {children}
        </span>
      </div>


      {/* Hover */}
      <div
        className="
          text-white 
          absolute 
          top-0 
          z-10 
          flex 
          h-full 
          w-full 
          translate-x-12 
          items-center 
          justify-center 
          gap-2 
          opacity-0 
          transition-all 
          duration-300 
          group-hover:-translate-x-5 
          group-hover:opacity-100
        "
      >
        {iconPosition === "left" && (
          <Icon size={18} />
        )}

        <span>{children}</span>

        {iconPosition === "right" && (
          <Icon size={18} />
        )}
      </div>
    </button>
  )
}