import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  try {
    const db = await getDb()
    const ordersCollection = db.collection('orders')
    const usersCollection = db.collection('users')

    // Get all orders
    const orders = await ordersCollection.find({}).toArray()
    
    // Calculate total sales
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0)
    
    // Sales by channel (mock data for website, mobile, market, agent)
    const websiteSales = totalSales * 0.52
    const mobileSales = totalSales * 0.24
    const marketSales = totalSales * 0.14
    const agentSales = totalSales * 0.10

    // Revenue updates (last 7 days)
    const today = new Date()
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(date.getDate() - (6 - i))
      return date
    })

    const revenueData = last7Days.map((date) => {
      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate)
        return orderDate.toDateString() === date.toDateString()
      })
      return {
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        revenue: dayOrders.reduce((sum, order) => sum + order.totalPrice, 0)
      }
    })

    // Yearly sales comparison (mock data)
    const currentYear = new Date().getFullYear()
    const monthlySales2023 = [3200, 3800, 3500, 4200, 4500, 4800, 4600, 5100, 5400, 5200, 5600, 5800]
    const monthlySales2024 = [4100, 4400, 4200, 4900, 5200, 5500, 5300, 5800, 6100, 5900, 6300, 6500]

    const yearlySalesData = monthlySales2024.map((sales, index) => ({
      month: new Date(2024, index).toLocaleDateString('en-US', { month: 'short' }),
      sales2023: monthlySales2023[index],
      sales2024: sales
    }))

    const totalSales2023 = monthlySales2023.reduce((a, b) => a + b, 0)
    const totalSales2024 = monthlySales2024.reduce((a, b) => a + b, 0)

    // Active users
    const totalUsers = await usersCollection.countDocuments()
    const activeUsers = await usersCollection.countDocuments({ 
      role: { $ne: 'admin' }
    })

    // Payment gateways (mock data)
    const paymentGateways = [
      { name: 'Paypal', category: 'Big Brands', amount: 6235, icon: 'paypal' },
      { name: 'Wallet', category: 'Bill payment', amount: -235, icon: 'wallet' },
      { name: 'Credit card', category: 'Bill Payment', amount: 2235, icon: 'creditcard' }
    ]

    // Profit and expense
    const totalRevenue = totalSales
    const totalProfit = totalRevenue * 0.46
    const totalExpense = totalRevenue * 0.54

    return NextResponse.json({
      totalSales: totalSales.toFixed(2),
      salesByChannel: {
        website: { amount: websiteSales.toFixed(0), percentage: 40 },
        mobile: { amount: mobileSales.toFixed(0), percentage: 25 },
        market: { amount: marketSales.toFixed(0), percentage: 20 },
        agent: { amount: agentSales.toFixed(0), percentage: 15 }
      },
      revenueData,
      yearlySales: {
        data: yearlySalesData,
        total2023: totalSales2023,
        total2024: totalSales2024
      },
      profitExpense: {
        profit: totalProfit.toFixed(2),
        expense: totalExpense.toFixed(2),
        total: (totalProfit + totalExpense).toFixed(2)
      },
      activeUsers: {
        total: activeUsers,
        growth: 8.06
      },
      paymentGateways,
      totalOrders: orders.length
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
