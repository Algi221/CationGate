"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({ asChild, ...props }: CollapsiblePrimitive.Trigger.Props & { asChild?: boolean }) {
  if (asChild) {
    const { children, ...rest } = props
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" render={children as any} {...rest} />
  }
  return (
    <CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...props} />
  )
}

function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
