"use client"

import React from 'react'
import { Cloud, CloudOff, Save, Loader2, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SaveBadgeProps {
  isLoading: boolean
  isSaving: boolean
  hasUnsavedChanges: boolean
  lastSaved: Date | null
  user: any
  onManualSave: () => void
  className?: string
}

export function SaveBadge({
  isLoading,
  isSaving,
  hasUnsavedChanges,
  lastSaved,
  user,
  onManualSave,
  className
}: SaveBadgeProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getBadgeContent = () => {
    if (isLoading) {
      return {
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        text: 'Loading...',
        variant: 'secondary' as const,
        clickable: false
      }
    }

    if (isSaving) {
      return {
        icon: <Loader2 className="h-4 w-4 animate-spin" />,
        text: 'Saving...',
        variant: 'secondary' as const,
        clickable: false
      }
    }

    if (!user) {
      return {
        icon: <CloudOff className="h-4 w-4" />,
        text: 'Please log in to save',
        variant: 'destructive' as const,
        clickable: false
      }
    }

    if (hasUnsavedChanges) {
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Unsaved changes',
        variant: 'destructive' as const,
        clickable: true
      }
    }

    if (lastSaved) {
      return {
        icon: <Check className="h-4 w-4" />,
        text: `Saved ${formatTime(lastSaved)}`,
        variant: 'default' as const,
        clickable: true
      }
    }

    return {
      icon: <Save className="h-4 w-4" />,
      text: 'Click to save',
      variant: 'outline' as const,
      clickable: true
    }
  }

  const { icon, text, variant, clickable } = getBadgeContent()

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 transition-all duration-300",
      className
    )}>
      <Button
        onClick={clickable ? onManualSave : undefined}
        variant={variant}
        size="sm"
        disabled={!clickable || isSaving}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full shadow-lg backdrop-blur-sm border-2",
          "transition-all duration-300 hover:scale-105 hover:cursor-pointer",
          variant === 'destructive' && "bg-red-500/10 border-red-500/30 text-red-600 hover:bg-red-500/20",
          variant === 'default' && "bg-green-500/10 border-green-500/30 text-green-600 hover:bg-green-500/20",
          variant === 'outline' && "bg-background/80 border-border hover:bg-accent",
          variant === 'secondary' && "bg-muted/80 border-muted-foreground/20",
          !clickable && "cursor-not-allowed"
        )}
      >
        {icon}
        <span className="text-xs font-medium">{text}</span>
      </Button>
    </div>
  )
}
