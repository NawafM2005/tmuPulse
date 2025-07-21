import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Option = {
  value: string
  label: string
}

type SimpleSelectProps = {
  options: Option[]
  placeholder?: string
  className?: string
  value?: string
  onChange?: (option: Option | undefined) => void
}

export function SimpleSelectScrollable({
  options,
  value,
  onChange,
  placeholder = "Select a department",
  className = "w-[280px]",
}: SimpleSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={v => {
        const found = options.find(opt => opt.value === v)
        onChange?.(found)
      }}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent side="bottom" className="bg-black text-secondary font-semibold max-h-60 overflow-y-auto">
        {options.map((opt) => (
          <SelectItem value={opt.value} key={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
