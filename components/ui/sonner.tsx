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
          toast: 'group-[.toaster]:shadow-lg',
          closeButton: 'group-[.toaster]:opacity-60 group-[.toaster]:hover:opacity-100',
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
