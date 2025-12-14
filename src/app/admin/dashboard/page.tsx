"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Loader2, 
  Search, 
  Mail, 
  Bell, 
  Settings, 
  LogOut,
  ShoppingCart,
  MessageSquare,
  Calendar,
  Mail as MailIcon,
  Ticket,
  TreePine,
  DollarSign,
  TrendingUp,
  Download,
  MoreHorizontal,
  CreditCard,
  Wallet
} from "lucide-react"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

type DashboardData = {
  totalSales: string
  salesByChannel: {
    website: { amount: string; percentage: number }
    mobile: { amount: string; percentage: number }
    market: { amount: string; percentage: number }
    agent: { amount: string; percentage: number }
  }
  revenueData: Array<{ day: string; revenue: number }>
  yearlySales: {
    data: Array<{ month: string; sales2023: number; sales2024: number }>
    total2023: number
    total2024: number
  }
  profitExpense: {
    profit: string
    expense: string
    total: string
  }
  activeUsers: {
    total: number
    growth: number
  }
  paymentGateways: Array<{
    name: string
    category: string
    amount: number
    icon: string
  }>
  totalOrders: number
}

export default function AdminDashboardPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard')
      const dashboardData = await res.json()
      setData(dashboardData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  if (authLoading || !user || user.role !== 'admin' || isLoading || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">C</span>
            </div>
            <span className="font-bold text-lg">Catalog</span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">HOME</div>
            <div className="space-y-0.5">
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:bg-gray-100">
                <ShoppingCart className="h-4 w-4" />
                eCommerce
              </Button>
            </div>

            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">App</div>
            <div className="space-y-0.5">
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-600 hover:bg-gray-100">
                <MessageSquare className="h-4 w-4" />
                Contacts
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-600 hover:bg-gray-100">
                <MessageSquare className="h-4 w-4" />
                Chats
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-600 hover:bg-gray-100">
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-600 hover:bg-gray-100">
                <MailIcon className="h-4 w-4" />
                Email
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-600 hover:bg-gray-100">
                <Ticket className="h-4 w-4" />
                Tickets
              </Button>
            </div>

            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">Page</div>
            <div className="space-y-0.5">
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-600 hover:bg-gray-100">
                <TreePine className="h-4 w-4" />
                Tree view
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-gray-600 hover:bg-gray-100">
                <DollarSign className="h-4 w-4" />
                Pricing
              </Button>
            </div>
          </div>
        </div>

        {/* User Profile at Bottom */}
        <div className="mt-auto border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-blue-600 text-white">
                {user.name?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{user.name || 'Admin'}</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button variant="ghost" size="sm" className="flex-1 gap-1 text-xs" onClick={() => router.push('/admin')}>
              <Settings className="h-3 w-3" />
              Setting
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-1 text-xs" onClick={handleLogout}>
              <LogOut className="h-3 w-3" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search"
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Mail className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>

          {/* Sales Distribution */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Sales Distribution</h2>
              <p className="text-sm text-gray-600">This is all over Platform Sales Generated</p>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <Card className="bg-white/80 backdrop-blur border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gray-900">${data.totalSales}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Sales</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">${data.salesByChannel.website.amount}</div>
                  <div className="text-xs text-gray-500 mt-1">({data.salesByChannel.website.percentage}%)</div>
                  <div className="text-sm text-gray-600 mt-1">By Website</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">${data.salesByChannel.mobile.amount}</div>
                  <div className="text-xs text-gray-500 mt-1">({data.salesByChannel.mobile.percentage}%)</div>
                  <div className="text-sm text-gray-600 mt-1">By Mobile</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">${data.salesByChannel.market.amount}</div>
                  <div className="text-xs text-gray-500 mt-1">({data.salesByChannel.market.percentage}%)</div>
                  <div className="text-sm text-gray-600 mt-1">By Market</div>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">${data.salesByChannel.agent.amount}</div>
                  <div className="text-xs text-gray-500 mt-1">({data.salesByChannel.agent.percentage}%)</div>
                  <div className="text-sm text-gray-600 mt-1">By Agent</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Sales Overview */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Sales Overview</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-2xl font-bold">${data.profitExpense.total}</div>
                  <div className="flex gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      <span className="text-gray-600">${data.profitExpense.profit} Profit</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                      <span className="text-gray-600">${data.profitExpense.expense} Expense</span>
                    </div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={[
                    { value: 400 },
                    { value: 600 },
                    { value: 500 },
                    { value: 700 },
                    { value: 600 },
                    { value: 800 }
                  ]}>
                    <defs>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fill="url(#colorProfit)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Updates */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Revenue Updates</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={data.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#818cf8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Yearly Sales */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Yearly Sales</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-sm text-gray-600">${data.yearlySales.total2024} 2023</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-cyan-300"></div>
                    <span className="text-sm text-gray-600">${data.yearlySales.total2023} 2022</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data.yearlySales.data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="sales2024" stroke="#3b82f6" strokeWidth={3} dot={false} />
                    <Line type="monotone" dataKey="sales2023" stroke="#67e8f9" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Active Users */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold">Active User</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1 h-8 text-xs">
                  <Download className="h-3 w-3" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-blue-600">{data.activeUsers.growth}%</span>
                    <span className="text-sm text-gray-600">Vs. pervious month</span>
                  </div>
                </div>
                <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                  {/* World Map Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 800 400" className="w-full h-full opacity-20">
                      <path d="M100,200 Q200,100 300,200 T500,200 T700,200" stroke="#3b82f6" fill="none" strokeWidth="1"/>
                      <circle cx="150" cy="180" r="3" fill="#3b82f6"/>
                      <circle cx="300" cy="200" r="3" fill="#3b82f6"/>
                      <circle cx="450" cy="180" r="3" fill="#3b82f6"/>
                      <circle cx="600" cy="220" r="3" fill="#3b82f6"/>
                    </svg>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur p-4 rounded-lg">
                      <div className="text-3xl font-bold text-gray-900">{data.activeUsers.total.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Total Active User</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Gateways */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-semibold">Payment Gateways</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.paymentGateways.map((gateway, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        gateway.icon === 'paypal' ? 'bg-pink-100' : 
                        gateway.icon === 'wallet' ? 'bg-orange-100' : 'bg-blue-100'
                      }`}>
                        {gateway.icon === 'paypal' && <DollarSign className="h-5 w-5 text-pink-600" />}
                        {gateway.icon === 'wallet' && <Wallet className="h-5 w-5 text-orange-600" />}
                        {gateway.icon === 'creditcard' && <CreditCard className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{gateway.name}</div>
                        <div className="text-xs text-gray-500">{gateway.category}</div>
                      </div>
                      <div className={`font-semibold ${gateway.amount > 0 ? 'text-gray-900' : 'text-red-600'}`}>
                        {gateway.amount > 0 ? '+' : ''}{gateway.amount < 0 ? '-' : ''}${Math.abs(gateway.amount)}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="w-full mt-4 text-blue-600">
                  View all transactions
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
