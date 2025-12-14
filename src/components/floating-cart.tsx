"use client"

import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function FloatingCart() {
  const { itemCount, total } = useCart()
  const router = useRouter()

  if (itemCount === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <Button
          onClick={() => router.push('/cart')}
          size="lg"
          className="h-14 px-6 rounded-full shadow-2xl bg-gradient-to-r from-primary via-orange-500 to-primary hover:from-primary/90 hover:via-orange-500/90 hover:to-primary/90 border-2 border-white/20"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-white text-primary text-xs font-bold flex items-center justify-center">
                {itemCount}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs opacity-90">View Cart</span>
              <span className="font-bold">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}
