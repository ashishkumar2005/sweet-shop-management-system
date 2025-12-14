"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Package, ShoppingBag, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface Order {
  id: string
  sweetId: string
  sweetName: string
  sweetImage: string
  sweetPrice: number
  quantity: number
  totalPrice: number
  orderDate: string
  status: string
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.email) {
      fetchOrders()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(user!.email)}`)
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center p-8">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Login Required</h2>
            <p className="text-muted-foreground mb-6">
              Please login to view your order history
            </p>
            <Link href="/login">
              <Button size="lg">Login</Button>
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <Navbar />
      
      <section className="py-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-primary" />
              Your Orders
            </h1>
            <p className="text-muted-foreground">
              View all your past orders and purchase history
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <Card className="text-center p-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here
              </p>
              <Link href="/">
                <Button>Browse Sweets</Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={order.sweetImage || '/placeholder.jpg'}
                            alt={order.sweetName}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">{order.sweetName}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(order.orderDate)}
                              </div>
                            </div>
                            <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="text-sm">
                              <span className="text-muted-foreground">Quantity:</span>{" "}
                              <span className="font-medium">{order.quantity}</span>
                              {" × "}
                              <span className="font-medium">₹{order.sweetPrice}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Total</div>
                              <div className="text-xl font-bold text-primary">₹{order.totalPrice}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              
              <div className="mt-8 p-6 bg-card/50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg">Total Orders</h3>
                    <p className="text-muted-foreground text-sm">{orders.length} orders placed</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                    <div className="text-2xl font-bold text-primary">
                      ₹{orders.reduce((sum, order) => sum + order.totalPrice, 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
