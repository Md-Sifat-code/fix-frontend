"use client"

import * as React from "react"
import { Plus, Minus, DollarSign, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { ScopeItem } from "@/types/proposal"
import { calculateTotals } from "@/types/proposal"

interface ScopeOfServicesProps {
  items: ScopeItem[]
  onItemsChange: (items: ScopeItem[]) => void
}

export function ScopeOfServices({ items, onItemsChange }: ScopeOfServicesProps) {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(
    new Set(items.filter((item) => item.isRequired).map((item) => item.id)),
  )
  const [customItems, setCustomItems] = React.useState<ScopeItem[]>([])

  const handleItemToggle = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleAddCustomItem = () => {
    const newItem: ScopeItem = {
      id: `custom-${customItems.length + 1}`,
      taskNumber: 4,
      description: "",
      defaultHours: 0,
      ratePerHour: 130,
      isRequired: false,
      category: "custom",
    }
    setCustomItems([...customItems, newItem])
    setSelectedItems(new Set([...selectedItems, newItem.id]))
  }

  const handleRemoveCustomItem = (itemId: string) => {
    setCustomItems(customItems.filter((item) => item.id !== itemId))
    const newSelected = new Set(selectedItems)
    newSelected.delete(itemId)
    setSelectedItems(newSelected)
  }

  const handleCustomItemChange = (itemId: string, field: keyof ScopeItem, value: any) => {
    setCustomItems(customItems.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)))
  }

  const allItems = [...items, ...customItems]
  const selectedItemsList = allItems.filter((item) => selectedItems.has(item.id))
  const totals = calculateTotals(selectedItemsList)

  const renderTaskGroup = (taskNumber: number, title: string) => {
    const taskItems = allItems.filter((item) => item.taskNumber === taskNumber)
    if (taskItems.length === 0) return null

    return (
      <>
        <TableRow className="bg-muted/50">
          <TableCell colSpan={5} className="font-medium">
            Task {taskNumber}: {title}
          </TableCell>
        </TableRow>
        {taskItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="w-12">
              <Checkbox
                checked={selectedItems.has(item.id)}
                onCheckedChange={() => handleItemToggle(item.id)}
                disabled={item.isRequired}
              />
            </TableCell>
            <TableCell className="max-w-md">
              {item.category === "custom" ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={item.description}
                    onChange={(e) => handleCustomItemChange(item.id, "description", e.target.value)}
                    placeholder="Enter task description"
                    className="w-full"
                  />
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveCustomItem(item.id)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                item.description
              )}
            </TableCell>
            <TableCell className="w-32">
              {item.category === "custom" ? (
                <Input
                  type="number"
                  value={item.defaultHours}
                  onChange={(e) => handleCustomItemChange(item.id, "defaultHours", Number(e.target.value))}
                  className="w-20"
                />
              ) : (
                item.defaultHours
              )}
            </TableCell>
            <TableCell className="w-32">
              {item.category === "custom" ? (
                <Input
                  type="number"
                  value={item.ratePerHour}
                  onChange={(e) => handleCustomItemChange(item.id, "ratePerHour", Number(e.target.value))}
                  className="w-20"
                />
              ) : (
                `$${item.ratePerHour}`
              )}
            </TableCell>
            <TableCell className="w-32 text-right">${(item.defaultHours * item.ratePerHour).toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Rate/Hour</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderTaskGroup(1, "Assemble Information")}
            {renderTaskGroup(2, "100% Schematic Design (SDs)")}
            {renderTaskGroup(3, "100% Construction Documents (CDs)")}
            {renderTaskGroup(4, "Additional Services")}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center">
        <Button onClick={handleAddCustomItem} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Custom Item
        </Button>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Total Hours: {totals.totalHours}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Total Cost: ${totals.totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
