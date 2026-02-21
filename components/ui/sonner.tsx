'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      richColors
      closeButton
      visibleToasts={4}
      gap={8}
      position="bottom-right"
      duration={5000}
      toastOptions={{
        classNames: {
          toast: [
            'group-[.toaster]:!bg-popover group-[.toaster]:!text-popover-foreground',
            'group-[.toaster]:!border group-[.toaster]:!border-border',
            'group-[.toaster]:!shadow-lg group-[.toaster]:!shadow-black/10',
            'group-[.toaster]:backdrop-blur-none',
            'group-[.toaster]:rounded-lg',
          ].join(' '),
          title: 'group-[.toaster]:!text-foreground group-[.toaster]:!font-semibold',
          description: 'group-[.toaster]:!text-muted-foreground',
          actionButton: 'group-[.toaster]:!bg-primary group-[.toaster]:!text-primary-foreground group-[.toaster]:!rounded-md group-[.toaster]:!font-medium',
          cancelButton: 'group-[.toaster]:!bg-muted group-[.toaster]:!text-muted-foreground group-[.toaster]:!rounded-md',
          closeButton: [
            'group-[.toaster]:!bg-popover group-[.toaster]:!text-muted-foreground',
            'group-[.toaster]:!border group-[.toaster]:!border-border',
            'group-[.toaster]:hover:!text-foreground group-[.toaster]:hover:!bg-muted',
            'group-[.toaster]:!opacity-100',
          ].join(' '),
          success: 'group-[.toaster]:!border-green-500/30 group-[.toaster]:!bg-green-500/10 group-[.toaster]:![&>svg]:text-green-500',
          error: 'group-[.toaster]:!border-destructive/30 group-[.toaster]:!bg-destructive/10 group-[.toaster]:![&>svg]:text-destructive',
          warning: 'group-[.toaster]:!border-yellow-500/30 group-[.toaster]:!bg-yellow-500/10 group-[.toaster]:![&>svg]:text-yellow-500',
          info: 'group-[.toaster]:!border-primary/30 group-[.toaster]:!bg-primary/10 group-[.toaster]:![&>svg]:text-primary',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
