"use client"

import Image from "next/image"
import { Sweet } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function SweetCard({ sweet }: { sweet: Sweet }) {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart()
  const cartItem = items.find(item => item.id === sweet.id)
  const isOutOfStock = sweet.quantity === 0

  const handleAddToCart = () => {
    if (isOutOfStock) return
    addToCart(sweet)
    toast.success(`${sweet.name} added to cart`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-card/50 backdrop-blur">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={sweet.image_url || '/placeholder.jpg'}
            alt={sweet.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Badge className="absolute top-3 left-3 bg-primary/90">{sweet.category}</Badge>
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm px-4 py-1">Out of Stock</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <h3 className="font-display font-semibold text-lg line-clamp-1">{sweet.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{sweet.description}</p>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-xl font-bold text-primary">₹{sweet.price}</span>
              <span className="text-xs text-muted-foreground ml-2">({sweet.quantity} in stock)</span>
            </div>
            {cartItem ? (
              <div className="flex items-center gap-2">
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-8 w-8"
                  onClick={() => cartItem.cartQuantity === 1 ? removeFromCart(sweet.id) : updateQuantity(sweet.id, cartItem.cartQuantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center font-medium">{cartItem.cartQuantity}</span>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-8 w-8"
                  onClick={() => updateQuantity(sweet.id, cartItem.cartQuantity + 1)}
                  disabled={cartItem.cartQuantity >= sweet.quantity}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button 
                size="sm" 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="gap-1 text-xs"
              >
                {isOutOfStock ? "Item Unavailable" : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}