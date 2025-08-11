"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex w-full items-center justify-center rounded-lg bg-white dark:bg-black p-1 text-gray-600 shadow-sm border border-gray-100",
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-md data-[state=active]:border-b-2 data-[state=active]:border-green-500",
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> & { googleDriveLink?: string }
>(({ className, googleDriveLink, ...props }, ref) => (
  <div className="flex flex-col h-auto">
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 max-h-full overflow-visible",
        className,
      )}
      {...props}
    />
    {googleDriveLink && (
      <div className="mt-2 p-2 bg-gray-50 border rounded-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l21.75-37.5-22.15-38.15c-1.35.8-2.5 1.9-3.3 3.3l-10.1 17.5c-1.35 2.35-1.35 5.25 0 7.65z"
                fill="#0066da"
              />
              <path
                d="m45.15 78-14.2-24.5-21.75 37.5c1.35.8 2.9 1.3 4.5 1.3h54.85c1.6 0 3.15-.45 4.5-1.3l-14.9-25.75z"
                fill="#00ac47"
              />
              <path
                d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l10.1-17.5c1.35-2.35 1.35-5.25 0-7.65l-10.1-17.5c-.8-1.4-1.95-2.5-3.3-3.3l-22.15 38.15z"
                fill="#ea4335"
              />
              <path
                d="m43.65 39.6 14.9-25.75c-1.35-.85-2.9-1.3-4.5-1.3h-54.85c-1.6 0-3.15.45-4.5 1.3l22.15 38.15z"
                fill="#00832d"
              />
              <path d="m73.55 11.2-14.9 25.75 14.9 25.75 14.9-25.75z" fill="#2684fc" />
              <path d="m58.65 36.95-14.9-25.75-14.2 24.5 14.2 24.5z" fill="#ffba00" />
            </svg>
            <span className="text-sm font-medium">Project Documents</span>
          </div>
          <a
            href={googleDriveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center"
          >
            Open in Google Drive
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    )}
  </div>
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
