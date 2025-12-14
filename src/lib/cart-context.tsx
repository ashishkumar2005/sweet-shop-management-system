"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Sweet } from './supabase'

type CartItem = Sweet & { cartQuantity: number }

type CartContextType = {
  items: CartItem[]
  addToCart: (sweet: Sweet) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) setItems(JSON.parse(stored))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addToCart = (sweet: Sweet) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === sweet.id)
      if (existing) {
        return prev.map(item =>
          item.id === sweet.id
            ? { ...item, cartQuantity: Math.min(item.cartQuantity + 1, item.quantity) }
            : item
        )
      }
      return [...prev, { ...sweet, cartQuantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cartQuantity: Math.min(quantity, item.quantity) } : item
      )
    )
  }

  const clearCart = () => setItems([])

  const total = items.reduce((sum, item) => sum + item.price * item.cartQuantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.cartQuantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
