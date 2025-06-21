"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface MediaProjectFormProps {
  projectType: "portfolio" | "plan" | "global"
  onSubmit: (data: any) => void
  initialData?: any
}

export function MediaProjectForm({ projectType, onSubmit, initialData }: MediaProjectFormProps) {
  const { register, handleSubmit, control } = useForm({ defaultValues: initialData })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Project Name</Label>
        <Input id="name" {...register("name", { required: true })} />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description", { required: true })} />
      </div>

      {projectType === "portfolio" && (
        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input id="clientName" {...register("clientName")} />
        </div>
      )}

      {projectType === "plan" && (
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" {...register("price", { required: true, min: 0 })} />
        </div>
      )}

      {projectType === "global" && (
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" {...register("location", { required: true })} />
        </div>
      )}

      <div>
        <Label htmlFor="status">Status</Label>
        <Select
          onValueChange={(value) => control.setValue("status", value)}
          defaultValue={initialData?.status || "draft"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="images">Images (comma-separated URLs)</Label>
        <Input id="images" {...register("images")} />
      </div>

      <Button type="submit">Save Project</Button>
    </form>
  )
}
