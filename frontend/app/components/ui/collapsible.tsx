"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

interface CollapsibleProps {
  children: React.ReactNode
  className?: string
  defaultOpen?: boolean
}

interface CollapsibleTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

interface CollapsibleContentProps {
  children: React.ReactNode
  className?: string
}

const CollapsibleContext = React.createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
} | null>(null)

export function Collapsible({ children, className, defaultOpen = false }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <CollapsibleContext.Provider value={{ isOpen, setIsOpen }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

export function CollapsibleTrigger({ children, asChild = false, className }: CollapsibleTriggerProps) {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error("CollapsibleTrigger must be used within a Collapsible")
  }

  const { isOpen, setIsOpen } = context

  if (asChild) {
    const childElement = children as React.ReactElement;
    const childProps = childElement.props as { className?: string };
    return React.cloneElement(childElement, {
      onClick: () => setIsOpen(!isOpen),
      className: cn(className, childProps.className || ''),
    } as React.ComponentPropsWithoutRef<'button'>)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsOpen(!isOpen)}
      className={cn("flex items-center gap-2", className)}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </Button>
  )
}

export function CollapsibleContent({ children, className }: CollapsibleContentProps) {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error("CollapsibleContent must be used within a Collapsible")
  }

  const { isOpen } = context

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      {children}
    </div>
  )
}
