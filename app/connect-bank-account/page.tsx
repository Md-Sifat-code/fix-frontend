"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, CreditCard, Lock, CheckCircle2 } from "lucide-react"

export default function ConnectBankAccountPage() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<
    Array<{
      id: string
      bankName: string
      accountType: string
      accountNumber: string
      routingNumber: string
      connected: Date
    }>
  >([])
  const [selectedBank, setSelectedBank] = useState("")
  const [bankCategory, setBankCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Popular banks for business accounts
  const popularBanks = [
    // Major National Banks
    { id: "chase", name: "Chase", logo: "🏦", category: "national" },
    { id: "bofa", name: "Bank of America", logo: "🏦", category: "national" },
    { id: "wells", name: "Wells Fargo", logo: "🏦", category: "national" },
    { id: "citi", name: "Citibank", logo: "🏦", category: "national" },
    { id: "us-bank", name: "US Bank", logo: "🏦", category: "national" },
    { id: "pnc", name: "PNC Bank", logo: "🏦", category: "national" },
    { id: "capital-one", name: "Capital One", logo: "🏦", category: "national" },
    { id: "td-bank", name: "TD Bank", logo: "🏦", category: "national" },

    // Regional Banks
    { id: "regions", name: "Regions Bank", logo: "🏦", category: "regional" },
    { id: "citizens", name: "Citizens Bank", logo: "🏦", category: "regional" },
    { id: "fifth-third", name: "Fifth Third Bank", logo: "🏦", category: "regional" },
    { id: "huntington", name: "Huntington Bank", logo: "🏦", category: "regional" },

    // Digital Banks
    { id: "ally", name: "Ally Bank", logo: "💻", category: "digital" },
    { id: "chime", name: "Chime", logo: "💻", category: "digital" },
    { id: "discover", name: "Discover Bank", logo: "💻", category: "digital" },
    { id: "sofi", name: "SoFi", logo: "💻", category: "digital" },
  ]

  useEffect(() => {
    // Log that the page has loaded
    console.log("Bank connection page loaded successfully")
  }, [])

  const handleBankSelect = (bankId: string) => {
    setSelectedBank(bankId)
  }

  const getFilteredBanks = () => {
    return popularBanks
      .filter((bank) => bankCategory === "all" || bank.category === bankCategory)
      .filter((bank) => bank.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }

  const handleConnectBank = () => {
    if (!selectedBank) return

    setIsConnecting(true)

    // Simulate bank connection process
    setTimeout(() => {
      const bankInfo = popularBanks.find((bank) => bank.id === selectedBank) || { name: "Unknown Bank" }

      const newAccount = {
        id: `acct_${Math.random().toString(36).substring(2, 15)}`,
        bankName: bankInfo.name,
        accountType: "Business Checking",
        accountNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
        routingNumber: `****${Math.floor(1000 + Math.random() * 9000)}`,
        connected: new Date(),
      }

      setConnectedAccounts((prev) => [...prev, newAccount])
      setIsConnecting(false)

      // Switch to the manage tab
      const manageTab = document.querySelector('[data-value="manage"]') as HTMLElement
      if (manageTab) manageTab.click()

      // Show success message
      alert(`Successfully connected to ${bankInfo.name}!`)
    }, 2000)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Connect Bank Account to Payroll</h1>
          <p className="text-gray-500">
            Connect your business bank account to automate payroll processing and tax payments.
          </p>
        </div>

        <Tabs defaultValue="connect" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connect" data-value="connect">
              Connect Account
            </TabsTrigger>
            <TabsTrigger value="manage" data-value="manage">
              Manage Accounts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Your Bank</CardTitle>
                <CardDescription>Choose your bank from the list below or search for it.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="bank-search">Search for your bank</Label>
                  <Input
                    id="bank-search"
                    placeholder="Search by bank name..."
                    className="mt-1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="my-4 flex space-x-2">
                  <Button
                    variant={bankCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBankCategory("all")}
                  >
                    All
                  </Button>
                  <Button
                    variant={bankCategory === "national" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBankCategory("national")}
                  >
                    National
                  </Button>
                  <Button
                    variant={bankCategory === "regional" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBankCategory("regional")}
                  >
                    Regional
                  </Button>
                  <Button
                    variant={bankCategory === "digital" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBankCategory("digital")}
                  >
                    Digital
                  </Button>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-3">
                    {bankCategory === "all"
                      ? "Popular Banks"
                      : bankCategory === "national"
                        ? "National Banks"
                        : bankCategory === "regional"
                          ? "Regional Banks"
                          : "Digital Banks"}
                  </h3>

                  {getFilteredBanks().length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {getFilteredBanks().map((bank) => (
                        <Card
                          key={bank.id}
                          className={`cursor-pointer hover:border-black transition-colors ${
                            selectedBank === bank.id ? "border-black bg-gray-50" : ""
                          }`}
                          onClick={() => handleBankSelect(bank.id)}
                        >
                          <CardContent className="p-4 flex items-center space-x-3">
                            <div className="text-2xl">{bank.logo}</div>
                            <div className="font-medium">{bank.name}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-md bg-gray-50">
                      <p className="text-gray-500 mb-2">No banks found matching your search</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchTerm("")
                          setBankCategory("all")
                        }}
                      >
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </div>

                <div className="mt-8 bg-gray-50 p-4 rounded-md border">
                  <div className="flex items-start space-x-3">
                    <Lock className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">Secure Connection</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Your credentials are encrypted and never stored on our servers. We use industry-standard
                        security practices to keep your information safe.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Don't see your bank?</h4>
                      <p className="text-sm text-gray-500 mt-1">You can manually connect your bank account</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const manualSetupTab = document.getElementById("manual-setup-section")
                        if (manualSetupTab) manualSetupTab.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      Manual Setup
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button onClick={handleConnectBank} disabled={!selectedBank || isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect Bank Account"}
                </Button>
              </CardFooter>
            </Card>

            <Card id="manual-setup-section">
              <CardHeader>
                <CardTitle>Manual Account Setup</CardTitle>
                <CardDescription>
                  If your bank isn't listed above, you can manually enter your bank account details.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank-name">Bank Name</Label>
                      <Input id="bank-name" placeholder="Enter bank name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-name">Account Name</Label>
                      <Input id="account-name" placeholder="Business Checking" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="routing-number">Routing Number</Label>
                      <Input id="routing-number" placeholder="9 digits" />
                      <p className="text-xs text-gray-500 mt-1">Found at the bottom of your checks, 9 digits</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="account-number">Account Number</Label>
                      <Input id="account-number" placeholder="Enter account number" />
                      <p className="text-xs text-gray-500 mt-1">Your account number, typically 10-12 digits</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-type">Account Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="checking"
                          name="account-type"
                          value="checking"
                          className="h-4 w-4"
                          defaultChecked
                        />
                        <Label htmlFor="checking" className="font-normal">
                          Business Checking
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="radio" id="savings" name="account-type" value="savings" className="h-4 w-4" />
                        <Label htmlFor="savings" className="font-normal">
                          Business Savings
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                    <div className="flex items-start space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-yellow-600 mt-0.5"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Verification Required</h4>
                        <p className="text-xs text-yellow-700 mt-1">
                          We'll need to verify your account ownership. Two small deposits will be made to your account
                          within 1-2 business days. You'll need to confirm these amounts to complete verification.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">Save Account Details</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle>Connected Bank Accounts</CardTitle>
                <CardDescription>Manage your connected bank accounts for payroll processing.</CardDescription>
              </CardHeader>
              <CardContent>
                {connectedAccounts.length > 0 ? (
                  <div className="space-y-4">
                    {connectedAccounts.map((account) => (
                      <div key={account.id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center space-x-4">
                          <Building className="h-8 w-8 text-gray-400" />
                          <div>
                            <h3 className="font-medium">{account.bankName}</h3>
                            <div className="text-sm text-gray-500">
                              {account.accountType} • {account.accountNumber}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Connected on {account.connected.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Verify
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}

                    <div className="bg-green-50 p-4 rounded-md border border-green-100 mt-6">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-medium text-green-800">Ready for Payroll</h4>
                          <p className="text-xs text-green-700 mt-1">
                            Your bank account is connected and ready for payroll processing. Payments will be withdrawn
                            from your default account.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts connected</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                      You haven't connected any bank accounts yet. Connect an account to enable automatic payroll
                      processing.
                    </p>
                    <Button
                      onClick={() => {
                        const connectTab = document.querySelector('[data-value="connect"]') as HTMLElement
                        if (connectTab) connectTab.click()
                      }}
                    >
                      Connect an Account
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
