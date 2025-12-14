"use client"

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  onComplete: (otp: string) => void
  disabled?: boolean
  value?: string
}

export function OTPInput({ length = 6, onComplete, disabled = false, value = "" }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (value) {
      const otpArray = value.split("").slice(0, length)
      setOtp([...otpArray, ...new Array(length - otpArray.length).fill("")])
    }
  }, [value, length])

  const handleChange = (index: number, newValue: string) => {
    if (disabled) return
    
    const sanitizedValue = newValue.replace(/[^0-9]/g, "")
    if (sanitizedValue.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = sanitizedValue
    setOtp(newOtp)

    if (sanitizedValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""))
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
      const newOtp = [...otp]
      newOtp[index] = ""
      setOtp(newOtp)
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    const pastedData = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, "")
    const pastedArray = pastedData.split("").slice(0, length)
    const newOtp = [...pastedArray, ...new Array(length - pastedArray.length).fill("")]
    setOtp(newOtp)

    const nextEmptyIndex = pastedArray.length < length ? pastedArray.length : length - 1
    inputRefs.current[nextEmptyIndex]?.focus()

    if (pastedArray.length === length) {
      onComplete(pastedArray.join(""))
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {otp.map((digit, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <input
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-12 h-14 text-center text-2xl font-bold rounded-lg",
              "border-2 transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              "bg-background/50 backdrop-blur",
              digit ? "border-primary bg-primary/5" : "border-muted-foreground/30",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            autoComplete="off"
          />
        </motion.div>
      ))}
    </div>
  )
}
