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
}

export function SimpleSelectScrollable({
  options,
  placeholder = "Select a department",
  className = "w-[280px]",
}: SimpleSelectProps) {
  return (
    <Select>
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
