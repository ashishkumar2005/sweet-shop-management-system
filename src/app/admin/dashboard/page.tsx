"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      Download,
      MoreHorizontal,
      CreditCard,
      Wallet,
      TrendingUp,
      Users,
      Package,
      BarChart3,
      IndianRupee,
      Sun,
      Moon
    } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts'

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const pieData = [
    { name: 'Profit', value: parseInt(data.profitExpense.profit) },
    { name: 'Expense', value: parseInt(data.profitExpense.expense) },
  ]
  const COLORS = ['#8b5cf6', '#ec4899']

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mithai Mahal</span>
          </div>

          <div className="space-y-1">
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">MAIN MENU</div>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start gap-3 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent" onClick={() => router.push('/admin/sales-analysis')}>
                  <TrendingUp className="h-4 w-4" />
                  Sales Analysis
                </Button>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent" onClick={() => router.push('/admin')}>
                    <ShoppingCart className="h-4 w-4" />
                    Products
                  </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Package className="h-4 w-4" />
                  Orders
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent">
                  <Users className="h-4 w-4" />
                  Customers
                </Button>
              </div>

            <div className="text-xs font-semibold text-primary uppercase tracking-wider mt-6 mb-3">APPS</div>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent">
                <MessageSquare className="h-4 w-4" />
                Messages
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent">
                <Calendar className="h-4 w-4" />
                Calendar
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent">
                <MailIcon className="h-4 w-4" />
                Email
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent">
                <Ticket className="h-4 w-4" />
                Support
              </Button>
            </div>
          </div>
        </div>

        {/* User Profile at Bottom */}
        <div className="mt-auto border-t border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                {user.name?.charAt(0).toUpperCase() || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name || 'Admin'}</div>
              <div className="text-xs text-muted-foreground">Administrator</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1 gap-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent" onClick={() => router.push('/admin')}>
              <Settings className="h-3 w-3" />
              Settings
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 gap-1 text-xs text-muted-foreground hover:text-foreground hover:bg-accent" onClick={handleLogout}>
              <LogOut className="h-3 w-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-card/50 backdrop-blur-xl border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, orders, customers..."
                  className="pl-10 bg-background border-input focus:border-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent relative">
                <Mail className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-accent">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-6 bg-background/50">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">Dashboard Overview</h1>
            <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl shadow-purple-500/20">
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total Sales</p>
                      <h3 className="text-3xl font-bold mt-2">₹{data.totalSales}</h3>
                      <p className="text-purple-200 text-xs mt-1">+12.5% from last month</p>
                    </div>
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <IndianRupee className="h-6 w-6" />
                    </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500 to-pink-600 border-0 shadow-xl shadow-pink-500/20">
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm font-medium">Total Orders</p>
                    <h3 className="text-3xl font-bold mt-2">{data.totalOrders}</h3>
                    <p className="text-pink-200 text-xs mt-1">+8.2% from last month</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl shadow-blue-500/20">
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Active Users</p>
                    <h3 className="text-3xl font-bold mt-2">{data.activeUsers.total.toLocaleString()}</h3>
                    <p className="text-blue-200 text-xs mt-1">+{data.activeUsers.growth}% growth</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-xl shadow-orange-500/20">
              <CardContent className="p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Revenue</p>
                    <h3 className="text-3xl font-bold mt-2">₹{data.profitExpense.total}</h3>
                    <p className="text-orange-200 text-xs mt-1">Net profit this month</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sales Distribution */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Sales Distribution by Channel</h2>
              <p className="text-sm text-muted-foreground">Platform-wide sales breakdown</p>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-muted border-border">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{data.salesByChannel.website.amount}</div>
                  <div className="text-xs text-muted-foreground mt-1">({data.salesByChannel.website.percentage}% of total)</div>
                  <div className="text-sm text-foreground mt-2 font-medium">Website Sales</div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-3">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: `${data.salesByChannel.website.percentage}%`}}></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted border-border">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">₹{data.salesByChannel.mobile.amount}</div>
                  <div className="text-xs text-muted-foreground mt-1">({data.salesByChannel.mobile.percentage}% of total)</div>
                  <div className="text-sm text-foreground mt-2 font-medium">Mobile Sales</div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-3">
                    <div className="bg-pink-500 h-2 rounded-full" style={{width: `${data.salesByChannel.mobile.percentage}%`}}></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted border-border">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{data.salesByChannel.market.amount}</div>
                  <div className="text-xs text-muted-foreground mt-1">({data.salesByChannel.market.percentage}% of total)</div>
                  <div className="text-sm text-foreground mt-2 font-medium">Market Sales</div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-3">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: `${data.salesByChannel.market.percentage}%`}}></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-muted border-border">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹{data.salesByChannel.agent.amount}</div>
                  <div className="text-xs text-muted-foreground mt-1">({data.salesByChannel.agent.percentage}% of total)</div>
                  <div className="text-sm text-foreground mt-2 font-medium">Agent Sales</div>
                  <div className="w-full bg-secondary rounded-full h-2 mt-3">
                    <div className="bg-orange-500 h-2 rounded-full" style={{width: `${data.salesByChannel.agent.percentage}%`}}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Sales Overview with Pie Chart */}
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Profit vs Expense</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </Button>
              </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="text-2xl font-bold">₹{data.profitExpense.total}</div>
                    <div className="flex gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-muted-foreground">₹{data.profitExpense.profit} Profit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span className="text-muted-foreground">₹{data.profitExpense.expense} Expense</span>
                      </div>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                        labelStyle={{ color: 'var(--foreground)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue Updates */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold">Revenue (Last 7 Days)</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                          itemStyle={{ color: 'var(--foreground)' }}
                          labelStyle={{ color: 'var(--foreground)' }}
                        />
                        <Bar dataKey="revenue" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Yearly Sales */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-semibold">Yearly Comparison</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-sm text-muted-foreground">₹{data.yearlySales.total2024} 2024</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                      <span className="text-sm text-muted-foreground">₹{data.yearlySales.total2023} 2023</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={data.yearlySales.data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                        labelStyle={{ color: 'var(--foreground)' }}
                      />
                      <Line type="monotone" dataKey="sales2024" stroke="#8b5cf6" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="sales2023" stroke="#ec4899" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-6 pb-6">
              {/* Active Users with Map */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base font-semibold">Global User Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-1 h-8 text-xs text-muted-foreground hover:text-foreground">
                    <Download className="h-3 w-3" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data.activeUsers.growth}%</span>
                      <span className="text-sm text-muted-foreground">growth vs. previous month</span>
                    </div>
                  </div>
                  <div className="relative h-48 bg-muted rounded-xl overflow-hidden border border-border">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 800 400" className="w-full h-full opacity-30 dark:opacity-20">
                        <defs>
                          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                        <path d="M100,200 Q200,100 300,200 T500,200 T700,200" stroke="url(#mapGradient)" fill="none" strokeWidth="2"/>
                        <circle cx="150" cy="180" r="5" fill="#8b5cf6">
                          <animate attributeName="r" from="3" to="8" dur="2s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="300" cy="200" r="5" fill="#ec4899">
                          <animate attributeName="r" from="3" to="8" dur="2s" begin="0.5s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="450" cy="180" r="5" fill="#8b5cf6">
                          <animate attributeName="r" from="3" to="8" dur="2s" begin="1s" repeatCount="indefinite"/>
                        </circle>
                        <circle cx="600" cy="220" r="5" fill="#ec4899">
                          <animate attributeName="r" from="3" to="8" dur="2s" begin="1.5s" repeatCount="indefinite"/>
                        </circle>
                      </svg>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-card/80 backdrop-blur-lg p-4 rounded-xl border border-border shadow-lg">
                        <div className="text-3xl font-bold">{data.activeUsers.total.toLocaleString()}</div>
                        <div className="text-sm text-primary">Active Users Worldwide</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.paymentGateways.map((gateway, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-all">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                          gateway.icon === 'paypal' ? 'bg-gradient-to-br from-pink-500 to-pink-600' : 
                          gateway.icon === 'wallet' ? 'bg-gradient-to-br from-orange-500 to-orange-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'
                        }`}>
                          {gateway.icon === 'paypal' && <IndianRupee className="h-6 w-6 text-white" />}
                          {gateway.icon === 'wallet' && <Wallet className="h-6 w-6 text-white" />}
                          {gateway.icon === 'creditcard' && <CreditCard className="h-6 w-6 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{gateway.name}</div>
                          <div className="text-xs text-muted-foreground">{gateway.category}</div>
                        </div>
                        <div className={`font-semibold ${gateway.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                          {gateway.amount > 0 ? '+' : ''}{gateway.amount < 0 ? '-' : ''}₹{Math.abs(gateway.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="link" className="w-full mt-4 text-primary hover:text-primary/80">
                    View all transactions →
                  </Button>
                </CardContent>
              </Card>
            </div>
        </main>
      </div>
    </div>
  )
}
