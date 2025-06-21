export interface PaymentDetails {
  paymentMethod: string
  cardNumber?: string
  expiryDate?: string
  cvv?: string
  paypalEmail?: string
  zellePhone?: string
  bitcoinAddress?: string
  amount: number
}

export interface PaymentError {
  field: string
  message: string
}

export const validatePaymentDetails = (details: PaymentDetails): PaymentError[] => {
  const errors: PaymentError[] = []

  if (!details.paymentMethod) {
    errors.push({ field: "paymentMethod", message: "Payment method is required" })
    return errors
  }

  if (details.paymentMethod === "credit" || details.paymentMethod === "debit") {
    if (!details.cardNumber) {
      errors.push({ field: "cardNumber", message: "Card number is required" })
    } else if (!/^\d{16}$/.test(details.cardNumber.replace(/\s/g, ""))) {
      errors.push({ field: "cardNumber", message: "Invalid card number" })
    }

    if (!details.expiryDate) {
      errors.push({ field: "expiryDate", message: "Expiry date is required" })
    } else {
      const [month, year] = details.expiryDate.split("/")
      const now = new Date()
      const currentYear = now.getFullYear() % 100
      const currentMonth = now.getMonth() + 1

      if (
        !/^\d{2}\/\d{2}$/.test(details.expiryDate) ||
        Number.parseInt(month) < 1 ||
        Number.parseInt(month) > 12 ||
        Number.parseInt(year) < currentYear ||
        (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
      ) {
        errors.push({ field: "expiryDate", message: "Invalid expiry date" })
      }
    }

    if (!details.cvv) {
      errors.push({ field: "cvv", message: "CVV is required" })
    } else if (!/^\d{3,4}$/.test(details.cvv)) {
      errors.push({ field: "cvv", message: "Invalid CVV" })
    }
  }

  if (
    details.paymentMethod === "paypal" &&
    (!details.paypalEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.paypalEmail))
  ) {
    errors.push({ field: "paypalEmail", message: "Valid PayPal email is required" })
  }

  if (
    details.paymentMethod === "zelle" &&
    (!details.zellePhone || !/^$$\d{3}$$ \d{3}-\d{4}$/.test(details.zellePhone))
  ) {
    errors.push({ field: "zellePhone", message: "Valid phone number is required" })
  }

  if (details.paymentMethod === "bitcoin" && (!details.bitcoinAddress || details.bitcoinAddress.length < 26)) {
    errors.push({ field: "bitcoinAddress", message: "Valid Bitcoin address is required" })
  }

  return errors
}

export const formatCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "")
  const groups = digits.match(/.{1,4}/g) || []
  return groups.join(" ").substr(0, 19)
}

export const formatExpiryDate = (value: string): string => {
  const digits = value.replace(/\D/g, "")
  if (digits.length >= 2) {
    return `${digits.substr(0, 2)}/${digits.substr(2, 2)}`
  }
  return digits
}

export const formatPhoneNumber = (value: string): string => {
  const digits = value.replace(/\D/g, "")
  if (digits.length <= 3) {
    return `(${digits}`
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  } else {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
  }
}

// Simulated payment processing
export const processPayment = async (details: PaymentDetails): Promise<{ success: boolean; message: string }> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simulate success rate of 90%
  const success = Math.random() < 0.9

  if (success) {
    return {
      success: true,
      message: "Payment processed successfully",
    }
  } else {
    throw new Error("Payment failed. Please try again.")
  }
}
