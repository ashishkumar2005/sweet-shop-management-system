"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Loader2, 
  Search, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Users, 
  Package, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  Map as MapIcon,
  Calendar,
  LogOut,
  Settings,
  Bell,
  Mail,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  Lightbulb,
  CheckCircle2,
  IndianRupee
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts'
import { motion, AnimatePresence } from "framer-motion"

type AnalysisData = {
  kpis: {
    totalSales: number
    totalProfit: number
    totalOrders: number
    averageOrderValue: number
    profitMargin: number
  }
  visualizations: {
    salesTrend: Array<{ name: string; sales: number; profit: number }>
    salesByCategory: Array<{ name: string; value: number }>
    salesByRegion: Array<{ name: string; value: number }>
    topProducts: Array<{ name: string; sales: number; profit: number; quantity: number }>
    bottomProducts: Array<{ name: string; sales: number; profit: number; quantity: number }>
    profitVsSales: Array<{ name: string; sales: number; profit: number }>
  }
  insights: string[]
  recommendations: string[]
  filters: {
    categories: string[]
    regions: string[]
    products: string[]
  }
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#6366f1']

export default function SalesAnalysisPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<AnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [region, setRegion] = useState("all")
  const [category, setCategory] = useState("all")
  const [timeRange, setTimeRange] = useState("365")

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAnalysisData()
    }
  }, [user, region, category, timeRange])

  const fetchAnalysisData = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (region !== "all") params.append('region', region)
      if (category !== "all") params.append('category', category)
      
      const res = await fetch(`/api/admin/sales-analysis?${params.toString()}`)
      const analysisData = await res.json()
      setData(analysisData)
    } catch (error) {
      console.error('Failed to fetch analysis data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar - Reusing styles from main dashboard */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mithai Mahal</span>
          </div>

          <nav className="space-y-1">
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-3">Main Menu</div>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent" onClick={() => router.push('/admin/dashboard')}>
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary/90 border border-primary/20">
              <TrendingUp className="h-4 w-4" />
              Sales Analysis
            </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent" onClick={() => router.push('/admin')}>
                <Package className="h-4 w-4" />
                Inventory
              </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent">
              <Users className="h-4 w-4" />
              Customers
            </Button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-8 w-8 ring-2 ring-primary">
              <AvatarFallback className="bg-muted text-xs text-primary">AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground truncate">Administrator</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sales Analysis Dashboard</h1>
              <p className="text-sm text-muted-foreground">Deep dive into your business performance and metrics.</p>
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Button variant="outline" size="sm" className="bg-background border-border text-muted-foreground hover:text-foreground gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Calendar className="h-4 w-4" />
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-background/50">
          <div className="p-8 space-y-8">
            {/* Filter Bar */}
            <div className="bg-card/50 border border-border rounded-2xl p-4 flex flex-wrap items-center gap-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium border-r border-border pr-4">
                <Filter className="h-4 w-4" />
                <span>Filters:</span>
              </div>
              
              <div className="w-40">
                <select 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Regions</option>
                  {data?.filters.regions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="w-44">
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Categories</option>
                  {data?.filters.categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="w-40">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">Last 12 Months</option>
                </select>
              </div>

              {(region !== "all" || category !== "all" || timeRange !== "365") && (
                <Button variant="ghost" size="sm" onClick={() => { setRegion("all"); setCategory("all"); setTimeRange("365"); }} className="text-muted-foreground hover:text-foreground">
                  Clear All
                </Button>
              )}
            </div>

            {isLoading || !data ? (
              <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground animate-pulse">Analyzing sales data...</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* KPIs Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    { label: "Total Sales", value: `₹${data.kpis.totalSales.toLocaleString()}`, icon: IndianRupee, color: "from-blue-500/20 to-blue-600/20", text: "text-blue-500 dark:text-blue-400", trend: "+12.5%" },
                    { label: "Total Profit", value: `₹${data.kpis.totalProfit.toLocaleString()}`, icon: TrendingUp, color: "from-purple-500/20 to-purple-600/20", text: "text-purple-500 dark:text-purple-400", trend: "+14.2%" },
                    { label: "Total Orders", value: data.kpis.totalOrders, icon: ShoppingCart, color: "from-pink-500/20 to-pink-600/20", text: "text-pink-500 dark:text-pink-400", trend: "+8.3%" },
                    { label: "Avg. Order Value", value: `₹${data.kpis.averageOrderValue.toFixed(2)}`, icon: Package, color: "from-orange-500/20 to-orange-600/20", text: "text-orange-500 dark:text-orange-400", trend: "+2.1%" },
                    { label: "Profit Margin", value: `${data.kpis.profitMargin.toFixed(1)}%`, icon: PieChartIcon, color: "from-emerald-500/20 to-emerald-600/20", text: "text-emerald-500 dark:text-emerald-400", trend: "+0.5%" },
                  ].map((kpi, i) => (
                    <Card key={i} className="bg-card border-border overflow-hidden relative group shadow-sm">
                      <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-2 rounded-lg bg-muted ${kpi.text}`}>
                            <kpi.icon className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className={`${kpi.text} bg-background border-border text-[10px]`}>
                            {kpi.trend}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                          <h3 className="text-2xl font-bold">{kpi.value}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts Row 1: Sales Trend */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 bg-card border-border shadow-md overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-6">
                      <div>
                        <CardTitle className="text-lg font-semibold">Sales & Profit Trend</CardTitle>
                        <CardDescription className="text-muted-foreground text-xs">Monthly performance analysis</CardDescription>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase">Sales</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase">Profit</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={data.visualizations.salesTrend}>
                            <defs>
                              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} 
                              dy={10}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} 
                            />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                              itemStyle={{ color: 'var(--foreground)', fontSize: '12px' }}
                              labelStyle={{ color: 'var(--foreground)' }}
                            />
                            <Area type="monotone" dataKey="sales" fill="url(#salesGradient)" stroke="#8b5cf6" strokeWidth={3} />
                            <Line type="monotone" dataKey="profit" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 4 }} activeDot={{ r: 6 }} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border shadow-md overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
                      <CardDescription className="text-muted-foreground text-xs">Product category distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data.visualizations.salesByCategory}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={85}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {data.visualizations.salesByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                              itemStyle={{ color: 'var(--foreground)' }}
                              labelStyle={{ color: 'var(--foreground)' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 w-full px-4">
                        {data.visualizations.salesByCategory.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                            <span className="text-[11px] text-muted-foreground font-medium truncate">{item.name}</span>
                            <span className="text-[11px] font-bold ml-auto">{((item.value / data.kpis.totalSales) * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row 2: Regions and Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-card border-border shadow-md overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Regional Performance</CardTitle>
                      <CardDescription className="text-muted-foreground text-xs">Sales breakdown across different regions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.visualizations.salesByRegion} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 500 }}
                              width={80}
                            />
                            <Tooltip 
                              cursor={{ fill: 'var(--muted)' }}
                              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                              itemStyle={{ color: 'var(--foreground)' }}
                              labelStyle={{ color: 'var(--foreground)' }}
                            />
                            <Bar 
                              dataKey="value" 
                              fill="#3b82f6" 
                              radius={[0, 4, 4, 0]} 
                              barSize={24}
                            >
                              {data.visualizations.salesByRegion.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border shadow-md overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Top 5 Products</CardTitle>
                      <CardDescription className="text-muted-foreground text-xs">Best performing products by revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {data.visualizations.topProducts.map((product, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground border border-border">
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-semibold truncate">{product.name}</h4>
                                <span className="text-sm font-bold">₹{product.sales.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
                                    style={{ width: `${(product.sales / data.visualizations.topProducts[0].sales) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium">{product.quantity} units</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Profit vs Sales Comparison */}
                <Card className="bg-card border-border shadow-md overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Profit vs Sales Analysis</CardTitle>
                    <CardDescription className="text-muted-foreground text-xs">Comparative view of product efficiency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.visualizations.profitVsSales.slice(0, 15)}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                            itemStyle={{ color: 'var(--foreground)' }}
                            labelStyle={{ color: 'var(--foreground)' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Bar dataKey="sales" fill="#8b5cf6" name="Sales Revenue" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="profit" fill="#10b981" name="Gross Profit" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Insights and Recommendations Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                  <Card className="bg-gradient-to-br from-indigo-500/5 to-card border-indigo-500/30 shadow-xl border-2">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        <Lightbulb className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">Business Insights</CardTitle>
                        <CardDescription className="text-indigo-600/60 dark:text-indigo-300/60 text-xs uppercase tracking-wider font-semibold">Data-driven observations</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {data.insights.map((insight, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-background/50 border border-border hover:bg-muted/50 transition-colors shadow-sm">
                          <div className="mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">{insight}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-500/5 to-card border-emerald-500/30 shadow-xl border-2">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">Actionable Recommendations</CardTitle>
                        <CardDescription className="text-emerald-600/60 dark:text-emerald-300/60 text-xs uppercase tracking-wider font-semibold">Steps to grow your business</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {data.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-background/50 border border-border hover:bg-muted/50 transition-colors shadow-sm">
                          <div className="mt-1">
                            <ChevronRight className="h-4 w-4 text-emerald-500" />
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">{rec}</p>
                        </div>
                      ))}
                      <div className="pt-4 px-4">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-tight">
                          Implement All Suggestions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
    </div>
  )
}
"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
    Loader2, 
    Search, 
    ShoppingCart, 
    TrendingUp, 
    DollarSign, 
    BarChart3, 
    Users, 
    Package, 
    Filter, 
    Download, 
    ArrowUpRight, 
    ArrowDownRight,
    PieChart as PieChartIcon,
    Map as MapIcon,
    Calendar,
    LogOut,
    Settings,
    Bell,
    Mail,
    MoreHorizontal,
    ChevronRight,
    ChevronLeft,
    Lightbulb,
    CheckCircle2,
    IndianRupee,
    Sun,
    Moon
  } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { 

  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts'
import { motion, AnimatePresence } from "framer-motion"

type AnalysisData = {
  kpis: {
    totalSales: number
    totalProfit: number
    totalOrders: number
    averageOrderValue: number
    profitMargin: number
  }
  visualizations: {
    salesTrend: Array<{ name: string; sales: number; profit: number }>
    salesByCategory: Array<{ name: string; value: number }>
    salesByRegion: Array<{ name: string; value: number }>
    topProducts: Array<{ name: string; sales: number; profit: number; quantity: number }>
    bottomProducts: Array<{ name: string; sales: number; profit: number; quantity: number }>
    profitVsSales: Array<{ name: string; sales: number; profit: number }>
  }
  insights: string[]
  recommendations: string[]
  filters: {
    categories: string[]
    regions: string[]
    products: string[]
  }
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#6366f1']

export default function SalesAnalysisPage() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [data, setData] = useState<AnalysisData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Filters
  const [region, setRegion] = useState("all")
  const [category, setCategory] = useState("all")
  const [timeRange, setTimeRange] = useState("365")

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAnalysisData()
    }
  }, [user, region, category, timeRange])

  const fetchAnalysisData = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (region !== "all") params.append('region', region)
      if (category !== "all") params.append('category', category)
      
      const res = await fetch(`/api/admin/sales-analysis?${params.toString()}`)
      const analysisData = await res.json()
      setData(analysisData)
    } catch (error) {
      console.error('Failed to fetch analysis data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar - Reusing styles from main dashboard */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden lg:flex sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Mithai Mahal</span>
          </div>

          <nav className="space-y-1">
            <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 px-3">Main Menu</div>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent" onClick={() => router.push('/admin/dashboard')}>
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary/90 border border-primary/20">
              <TrendingUp className="h-4 w-4" />
              Sales Analysis
            </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent" onClick={() => router.push('/admin')}>
                <Package className="h-4 w-4" />
                Inventory
              </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground hover:bg-accent">
              <Users className="h-4 w-4" />
              Customers
            </Button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-8 w-8 ring-2 ring-primary">
              <AvatarFallback className="bg-muted text-xs text-primary">AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground truncate">Administrator</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Sales Analysis Dashboard</h1>
              <p className="text-sm text-muted-foreground">Deep dive into your business performance and metrics.</p>
            </div>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <Button variant="outline" size="sm" className="bg-background border-border text-muted-foreground hover:text-foreground gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Calendar className="h-4 w-4" />
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-background/50">
          <div className="p-8 space-y-8">
            {/* Filter Bar */}
            <div className="bg-card/50 border border-border rounded-2xl p-4 flex flex-wrap items-center gap-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium border-r border-border pr-4">
                <Filter className="h-4 w-4" />
                <span>Filters:</span>
              </div>
              
              <div className="w-40">
                <select 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Regions</option>
                  {data?.filters.regions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="w-44">
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Categories</option>
                  {data?.filters.categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="w-40">
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full bg-background border border-input rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="30">Last 30 Days</option>
                  <option value="90">Last 90 Days</option>
                  <option value="365">Last 12 Months</option>
                </select>
              </div>

              {(region !== "all" || category !== "all" || timeRange !== "365") && (
                <Button variant="ghost" size="sm" onClick={() => { setRegion("all"); setCategory("all"); setTimeRange("365"); }} className="text-muted-foreground hover:text-foreground">
                  Clear All
                </Button>
              )}
            </div>

            {isLoading || !data ? (
              <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-muted-foreground animate-pulse">Analyzing sales data...</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* KPIs Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    { label: "Total Sales", value: `₹${data.kpis.totalSales.toLocaleString()}`, icon: IndianRupee, color: "from-blue-500/20 to-blue-600/20", text: "text-blue-500 dark:text-blue-400", trend: "+12.5%" },
                    { label: "Total Profit", value: `₹${data.kpis.totalProfit.toLocaleString()}`, icon: TrendingUp, color: "from-purple-500/20 to-purple-600/20", text: "text-purple-500 dark:text-purple-400", trend: "+14.2%" },
                    { label: "Total Orders", value: data.kpis.totalOrders, icon: ShoppingCart, color: "from-pink-500/20 to-pink-600/20", text: "text-pink-500 dark:text-pink-400", trend: "+8.3%" },
                    { label: "Avg. Order Value", value: `₹${data.kpis.averageOrderValue.toFixed(2)}`, icon: Package, color: "from-orange-500/20 to-orange-600/20", text: "text-orange-500 dark:text-orange-400", trend: "+2.1%" },
                    { label: "Profit Margin", value: `${data.kpis.profitMargin.toFixed(1)}%`, icon: PieChartIcon, color: "from-emerald-500/20 to-emerald-600/20", text: "text-emerald-500 dark:text-emerald-400", trend: "+0.5%" },
                  ].map((kpi, i) => (
                    <Card key={i} className="bg-card border-border overflow-hidden relative group shadow-sm">
                      <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <CardContent className="p-6 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-2 rounded-lg bg-muted ${kpi.text}`}>
                            <kpi.icon className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className={`${kpi.text} bg-background border-border text-[10px]`}>
                            {kpi.trend}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                          <h3 className="text-2xl font-bold">{kpi.value}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Charts Row 1: Sales Trend */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="lg:col-span-2 bg-card border-border shadow-md overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-6">
                      <div>
                        <CardTitle className="text-lg font-semibold">Sales & Profit Trend</CardTitle>
                        <CardDescription className="text-muted-foreground text-xs">Monthly performance analysis</CardDescription>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase">Sales</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-pink-500"></div>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase">Profit</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={data.visualizations.salesTrend}>
                            <defs>
                              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis 
                              dataKey="name" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} 
                              dy={10}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} 
                            />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                              itemStyle={{ color: 'var(--foreground)', fontSize: '12px' }}
                              labelStyle={{ color: 'var(--foreground)' }}
                            />
                            <Area type="monotone" dataKey="sales" fill="url(#salesGradient)" stroke="#8b5cf6" strokeWidth={3} />
                            <Line type="monotone" dataKey="profit" stroke="#ec4899" strokeWidth={3} dot={{ fill: '#ec4899', r: 4 }} activeDot={{ r: 6 }} />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border shadow-md overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg font-semibold">Sales by Category</CardTitle>
                      <CardDescription className="text-muted-foreground text-xs">Product category distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <div className="h-[240px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data.visualizations.salesByCategory}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={85}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {data.visualizations.salesByCategory.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                              itemStyle={{ color: 'var(--foreground)' }}
                              labelStyle={{ color: 'var(--foreground)' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 w-full px-4">
                        {data.visualizations.salesByCategory.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                            <span className="text-[11px] text-muted-foreground font-medium truncate">{item.name}</span>
                            <span className="text-[11px] font-bold ml-auto">{((item.value / data.kpis.totalSales) * 100).toFixed(0)}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts Row 2: Regions and Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-card border-border shadow-md overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Regional Performance</CardTitle>
                      <CardDescription className="text-muted-foreground text-xs">Sales breakdown across different regions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[280px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.visualizations.salesByRegion} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'var(--foreground)', fontSize: 12, fontWeight: 500 }}
                              width={80}
                            />
                            <Tooltip 
                              cursor={{ fill: 'var(--muted)' }}
                              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                              itemStyle={{ color: 'var(--foreground)' }}
                              labelStyle={{ color: 'var(--foreground)' }}
                            />
                            <Bar 
                              dataKey="value" 
                              fill="#3b82f6" 
                              radius={[0, 4, 4, 0]} 
                              barSize={24}
                            >
                              {data.visualizations.salesByRegion.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border shadow-md overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold">Top 5 Products</CardTitle>
                      <CardDescription className="text-muted-foreground text-xs">Best performing products by revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {data.visualizations.topProducts.map((product, i) => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground border border-border">
                              {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-semibold truncate">{product.name}</h4>
                                <span className="text-sm font-bold">₹{product.sales.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
                                    style={{ width: `${(product.sales / data.visualizations.topProducts[0].sales) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-medium">{product.quantity} units</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Profit vs Sales Comparison */}
                <Card className="bg-card border-border shadow-md overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">Profit vs Sales Analysis</CardTitle>
                    <CardDescription className="text-muted-foreground text-xs">Comparative view of product efficiency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.visualizations.profitVsSales.slice(0, 15)}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                            itemStyle={{ color: 'var(--foreground)' }}
                            labelStyle={{ color: 'var(--foreground)' }}
                          />
                          <Legend wrapperStyle={{ paddingTop: '20px' }} />
                          <Bar dataKey="sales" fill="#8b5cf6" name="Sales Revenue" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="profit" fill="#10b981" name="Gross Profit" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Insights and Recommendations Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                  <Card className="bg-gradient-to-br from-indigo-500/5 to-card border-indigo-500/30 shadow-xl border-2">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        <Lightbulb className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">Business Insights</CardTitle>
                        <CardDescription className="text-indigo-600/60 dark:text-indigo-300/60 text-xs uppercase tracking-wider font-semibold">Data-driven observations</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {data.insights.map((insight, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-background/50 border border-border hover:bg-muted/50 transition-colors shadow-sm">
                          <div className="mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">{insight}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-500/5 to-card border-emerald-500/30 shadow-xl border-2">
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">Actionable Recommendations</CardTitle>
                        <CardDescription className="text-emerald-600/60 dark:text-emerald-300/60 text-xs uppercase tracking-wider font-semibold">Steps to grow your business</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {data.recommendations.map((rec, i) => (
                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-background/50 border border-border hover:bg-muted/50 transition-colors shadow-sm">
                          <div className="mt-1">
                            <ChevronRight className="h-4 w-4 text-emerald-500" />
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">{rec}</p>
                        </div>
                      ))}
                      <div className="pt-4 px-4">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-tight">
                          Implement All Suggestions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
    </div>
  )
}
