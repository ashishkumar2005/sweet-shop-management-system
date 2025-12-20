"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Sweet } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Plus, Edit, Trash2, Package, Search, Loader2, LogOut, TrendingUp, TrendingDown, Box, AlertTriangle } from "lucide-react"

type SweetForm = {
  name: string
  category: string
  price: string
  quantity: string
  image_url: string
  description: string
}

const initialForm: SweetForm = {
  name: "",
  category: "",
  price: "",
  quantity: "",
  image_url: "",
  description: ""
}

export default function AdminPage() {
  const { user, token, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [formData, setFormData] = useState<SweetForm>(initialForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [restockId, setRestockId] = useState<string | null>(null)
  const [restockQuantity, setRestockQuantity] = useState("")

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.role === 'admin') fetchSweets()
  }, [user])

  const fetchSweets = async () => {
    try {
      const res = await fetch('/api/sweets')
      const data = await res.json()
      setSweets(data.sweets || [])
    } catch {
      toast.error('Failed to fetch sweets')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingId ? `/api/sweets/${editingId}` : '/api/sweets'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity)
        })
      })

      if (!res.ok) throw new Error('Failed to save')

      toast.success(editingId ? 'Sweet updated!' : 'Sweet added!')
      setFormData(initialForm)
      setEditingId(null)
      setIsDialogOpen(false)
      fetchSweets()
    } catch {
      toast.error('Failed to save sweet')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (sweet: Sweet) => {
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      image_url: sweet.image_url || '',
      description: sweet.description || ''
    })
    setEditingId(sweet.id)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sweet?')) return

    try {
      const res = await fetch(`/api/sweets/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to delete')

      toast.success('Sweet deleted!')
      fetchSweets()
    } catch {
      toast.error('Failed to delete sweet')
    }
  }

  const handleRestock = async (id: string) => {
    if (!restockQuantity || parseInt(restockQuantity) <= 0) {
      toast.error('Enter a valid quantity')
      return
    }

    try {
      const res = await fetch(`/api/sweets/${id}/restock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: parseInt(restockQuantity) })
      })

      if (!res.ok) throw new Error('Failed to restock')

      toast.success('Restocked successfully!')
      setRestockId(null)
      setRestockQuantity("")
      fetchSweets()
    } catch {
      toast.error('Failed to restock')
    }
  }

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    router.push("/admin/login")
  }

  const filteredSweets = sweets.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalItems = sweets.reduce((sum, s) => sum + s.quantity, 0)
  const lowStockItems = sweets.filter(s => s.quantity < 20 && s.quantity > 0).length
  const outOfStockItems = sweets.filter(s => s.quantity === 0).length
  const totalValue = sweets.reduce((sum, s) => sum + (s.price * s.quantity), 0)

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🪷</span>
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-white">Mithai Mahal Admin</h1>
                <p className="text-xs text-slate-400">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => router.push('/admin/dashboard')} className="text-slate-300 hover:text-white hover:bg-slate-800">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push('/admin/sales-analysis')} className="text-slate-300 hover:text-white hover:bg-slate-800">
                <TrendingUp className="h-4 w-4 mr-2" />
                Sales Analysis
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="text-slate-300 hover:text-white hover:bg-slate-800 ml-4">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-1">Inventory Management</h2>
            <p className="text-slate-400">Monitor and manage your product catalog</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setFormData(initialForm)
              setEditingId(null)
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-slate-900 border-slate-800">
              <DialogHeader>
                <DialogTitle className="font-display text-white">
                  {editingId ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-200">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category" className="text-slate-200">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-slate-200">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="quantity" className="text-slate-200">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="image_url" className="text-slate-200">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-slate-200">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {editingId ? 'Update Product' : 'Add Product'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-400">Total Products</div>
                <Box className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-3xl font-bold text-white">{sweets.length}</div>
              <div className="text-xs text-slate-500 mt-1">Active items</div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-400">Total Stock</div>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-white">{totalItems}</div>
              <div className="text-xs text-slate-500 mt-1">Units available</div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-400">Low Stock</div>
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-yellow-400">{lowStockItems}</div>
              <div className="text-xs text-slate-500 mt-1">Needs attention</div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-slate-400">Out of Stock</div>
                <TrendingDown className="h-4 w-4 text-red-400" />
              </div>
              <div className="text-3xl font-bold text-red-400">{outOfStockItems}</div>
              <div className="text-xs text-slate-500 mt-1">Requires restock</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TabsList className="bg-slate-900/50 border border-slate-800">
              <TabsTrigger value="all" className="data-[state=active]:bg-purple-600">All ({sweets.length})</TabsTrigger>
              <TabsTrigger value="low" className="data-[state=active]:bg-purple-600">Low Stock ({lowStockItems})</TabsTrigger>
              <TabsTrigger value="out" className="data-[state=active]:bg-purple-600">Out of Stock ({outOfStockItems})</TabsTrigger>
            </TabsList>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900 border-slate-800 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {['all', 'low', 'out'].map(tab => (
            <TabsContent key={tab} value={tab}>
              <Card className="border-slate-800 bg-slate-900/50 backdrop-blur shadow-xl">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-slate-800 hover:bg-slate-800/50">
                            <TableHead className="text-slate-300">Product</TableHead>
                            <TableHead className="text-slate-300">Category</TableHead>
                            <TableHead className="text-slate-300">Price</TableHead>
                            <TableHead className="text-slate-300">Stock</TableHead>
                            <TableHead className="text-right text-slate-300">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSweets
                            .filter(s => {
                              if (tab === 'low') return s.quantity > 0 && s.quantity < 20
                              if (tab === 'out') return s.quantity === 0
                              return true
                            })
                            .map(sweet => (
                              <TableRow key={sweet.id} className="border-slate-800 hover:bg-slate-800/30">
                                <TableCell>
                                  <div>
                                    <div className="font-medium text-white">{sweet.name}</div>
                                    <div className="text-xs text-slate-500">{sweet.id.slice(0, 8)}...</div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">{sweet.category}</Badge>
                                </TableCell>
                                <TableCell className="text-slate-300">₹{sweet.price}</TableCell>
                                <TableCell>
                                  {restockId === sweet.id ? (
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        value={restockQuantity}
                                        onChange={(e) => setRestockQuantity(e.target.value)}
                                        className="w-20 h-8 bg-slate-800 border-slate-700 text-white"
                                        placeholder="Qty"
                                      />
                                      <Button size="sm" onClick={() => handleRestock(sweet.id)} className="bg-purple-600 hover:bg-purple-700">Add</Button>
                                      <Button size="sm" variant="ghost" onClick={() => setRestockId(null)} className="text-slate-400">Cancel</Button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <Badge variant={sweet.quantity === 0 ? 'destructive' : sweet.quantity < 20 ? 'secondary' : 'default'}>
                                        {sweet.quantity}
                                      </Badge>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setRestockId(sweet.id)}
                                        className="h-6 px-2 text-slate-400 hover:text-white"
                                      >
                                        <Package className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handleEdit(sweet)}
                                      className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-950/30"
                                      onClick={() => handleDelete(sweet.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
