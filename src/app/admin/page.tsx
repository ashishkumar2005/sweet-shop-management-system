"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Sweet } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Plus, Edit, Trash2, Package, Search, Loader2 } from "lucide-react"

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
  const { user, token, isLoading: authLoading } = useAuth()
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
      router.push('/')
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

  const filteredSweets = sweets.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalItems = sweets.reduce((sum, s) => sum + s.quantity, 0)
  const lowStockItems = sweets.filter(s => s.quantity < 20).length
  const outOfStockItems = sweets.filter(s => s.quantity === 0).length

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your sweet shop inventory</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setFormData(initialForm)
              setEditingId(null)
            }
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Sweet
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display">
                  {editingId ? 'Edit Sweet' : 'Add New Sweet'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price (₹) *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {editingId ? 'Update Sweet' : 'Add Sweet'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Products</div>
              <div className="text-2xl font-bold">{sweets.length}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Stock</div>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Low Stock</div>
              <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm bg-card/50">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Out of Stock</div>
              <div className="text-2xl font-bold text-destructive">{outOfStockItems}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All ({sweets.length})</TabsTrigger>
              <TabsTrigger value="low">Low Stock ({lowStockItems})</TabsTrigger>
              <TabsTrigger value="out">Out of Stock ({outOfStockItems})</TabsTrigger>
            </TabsList>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sweets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {['all', 'low', 'out'].map(tab => (
            <TabsContent key={tab} value={tab}>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sweet</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
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
                            <TableRow key={sweet.id}>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{sweet.name}</div>
                                  <div className="text-xs text-muted-foreground">{sweet.id.slice(0, 8)}...</div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{sweet.category}</Badge>
                              </TableCell>
                              <TableCell>₹{sweet.price}</TableCell>
                              <TableCell>
                                {restockId === sweet.id ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      type="number"
                                      value={restockQuantity}
                                      onChange={(e) => setRestockQuantity(e.target.value)}
                                      className="w-20 h-8"
                                      placeholder="Qty"
                                    />
                                    <Button size="sm" onClick={() => handleRestock(sweet.id)}>Add</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setRestockId(null)}>Cancel</Button>
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
                                      className="h-6 px-2"
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
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="text-destructive"
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