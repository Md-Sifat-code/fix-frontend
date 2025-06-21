"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BankConnectButton } from "@/components/BankConnectButton"

export default function PayrollBankConnectDemo() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Bank Connect Demo</h1>

        <Card>
          <CardHeader>
            <CardTitle>Connect Your Bank Account</CardTitle>
            <CardDescription>Use the button below to connect your bank account to the payroll system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                Connecting your bank account allows for automated payroll processing and tax payments. Your account
                information is securely stored and encrypted.
              </p>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Demo Instructions</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Click the "Connect Bank Account" button below to navigate to the bank connection page.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <BankConnectButton variant="default" />

                  <Button variant="outline" bankConnect onClick={() => console.log("Bank connect button clicked")}>
                    Standard Bank Connect
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">This is a demonstration of the bank connection feature.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
