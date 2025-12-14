"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { OTPInput } from "@/components/otp-input"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { Eye, EyeOff, Loader2, Mail, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Step = "details" | "otp"

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("details")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const { register } = useAuth()
  const router = useRouter()

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Please enter your name")
      return false
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email")
      return false
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return false
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return false
    }
    return true
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP")
      }

      const expiryDate = new Date(data.expiresAt)
      setOtpExpiry(expiryDate)
      setTimeRemaining(Math.floor((expiryDate.getTime() - Date.now()) / 1000))

      toast.success("OTP sent to your email!", {
        description: "Please check your inbox and enter the code below.",
        duration: 5000,
      })
      
      setStep("otp")

      const timer = setInterval(() => {
        const remaining = Math.floor((expiryDate.getTime() - Date.now()) / 1000)
        if (remaining <= 0) {
          clearInterval(timer)
          setTimeRemaining(0)
        } else {
          setTimeRemaining(remaining)
        }
      }, 1000)

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (otpValue: string) => {
    setIsLoading(true)
    try {
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue }),
      })
      
      const verifyData = await verifyRes.json()
      
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "Invalid OTP")
      }

      await register(email, password, name)
      toast.success(`Welcome, ${name}! Your account has been created.`, {
        description: "Email verified successfully",
      })
      router.push("/")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Verification failed")
      setOtp("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setOtp("")
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to resend OTP")
      }

      const expiryDate = new Date(data.expiresAt)
      setOtpExpiry(expiryDate)
      setTimeRemaining(Math.floor((expiryDate.getTime() - Date.now()) / 1000))

      toast.success("New OTP sent to your email!", {
        description: "Please check your inbox for the new code.",
        duration: 5000,
      })

      const timer = setInterval(() => {
        const remaining = Math.floor((expiryDate.getTime() - Date.now()) / 1000)
        if (remaining <= 0) {
          clearInterval(timer)
          setTimeRemaining(0)
        } else {
          setTimeRemaining(remaining)
        }
      }, 1000)

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend OTP")
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {step === "details" ? (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-full max-w-md border-0 shadow-xl bg-card/80 backdrop-blur">
                <CardHeader className="text-center space-y-2">
                  <motion.span 
                    className="text-4xl mb-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    🪷
                  </motion.span>
                  <CardTitle className="font-display text-2xl">Create Account</CardTitle>
                  <CardDescription>Join Mithai Mahal for sweet delights</CardDescription>
                </CardHeader>
                <form onSubmit={handleSendOTP}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          className="bg-background/50 pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-background/50"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Continue with Email
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center w-full">
                      Already have an account?{" "}
                      <Link href="/login" className="text-primary font-medium hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="w-full max-w-md border-0 shadow-xl bg-card/80 backdrop-blur">
                <CardHeader className="text-center space-y-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  >
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <ShieldCheck className="h-8 w-8 text-primary" />
                    </div>
                  </motion.div>
                  <CardTitle className="font-display text-2xl">Verify Your Email</CardTitle>
                  <CardDescription>
                    We sent a 6-digit code to<br />
                    <span className="font-medium text-foreground">{email}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <OTPInput
                      length={6}
                      onComplete={handleVerifyOTP}
                      disabled={isLoading}
                      value={otp}
                    />
                    
                    {timeRemaining > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            Code expires in {formatTime(timeRemaining)}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Didn&apos;t receive the code?
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleResendOTP}
                      disabled={isLoading || timeRemaining > 540}
                      className="text-primary hover:text-primary/80"
                    >
                      {timeRemaining > 540 ? `Resend in ${formatTime(600 - timeRemaining)}` : "Resend OTP"}
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("details")}
                    className="w-full"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}