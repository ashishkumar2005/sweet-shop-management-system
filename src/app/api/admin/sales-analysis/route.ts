import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const regionFilter = searchParams.get('region')
    const categoryFilter = searchParams.get('category')
    const productFilter = searchParams.get('product')

    const db = await getDb()
    const ordersCollection = db.collection('orders')
    const sweetsCollection = db.collection('sweets')

    // Fetch all sweets to map categories
    const sweets = await sweetsCollection.find({}).toArray()
    const sweetMap = new Map(sweets.map(s => [s._id.toString(), s]))

    // Build query
    const query: any = {}
    if (startDate && endDate) {
      query.orderDate = { $gte: startDate, $lte: endDate }
    }
    if (regionFilter) {
      query.region = regionFilter
    }
    if (productFilter) {
      query.sweetName = productFilter
    }

    let orders = await ordersCollection.find(query).toArray()

    // Enrich orders with category and calculated profit
    // Since we don't have cost, we assume a profit margin of 30%
    const enrichedOrders = orders.map(order => {
      const sweet = sweetMap.get(order.sweetId)
      const category = sweet ? sweet.category : 'Unknown'
      const totalPrice = Number(order.totalPrice || 0)
      const profit = totalPrice * 0.3 // Assume 30% profit margin
      
      return {
        ...order,
        totalPrice,
        category,
        profit,
        orderDate: order.orderDate,
        region: order.region,
        sweetName: order.sweetName,
        quantity: order.quantity
      }
    }).filter(order => !categoryFilter || order.category === categoryFilter)

    // Calculate KPIs
    const totalSales = enrichedOrders.reduce((sum, o) => sum + o.totalPrice, 0)
    const totalProfit = enrichedOrders.reduce((sum, o) => sum + o.profit, 0)
    const totalOrders = enrichedOrders.length
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0
    const profitMargin = totalSales > 0 ? (totalProfit / totalSales) * 100 : 0

    // 1. Sales trend over time (Monthly)
    const monthlyData: Record<string, { name: string; sales: number; profit: number }> = {}
    enrichedOrders.forEach(o => {
      const date = new Date(o.orderDate)
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' })
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { name: monthYear, sales: 0, profit: 0 }
      }
      monthlyData[monthYear].sales += o.totalPrice
      monthlyData[monthYear].profit += o.profit
    })
    const salesTrend = Object.values(monthlyData).sort((a, b) => {
      return new Date(a.name).getTime() - new Date(b.name).getTime()
    })

    // 2. Sales by category
    const categoryData: Record<string, { name: string; value: number }> = {}
    enrichedOrders.forEach(o => {
      if (!categoryData[o.category]) {
        categoryData[o.category] = { name: o.category, value: 0 }
      }
      categoryData[o.category].value += o.totalPrice
    })
    const salesByCategory = Object.values(categoryData)

    // 3. Sales by region
    const regionData: Record<string, { name: string; value: number }> = {}
    enrichedOrders.forEach(o => {
      const region = o.region || 'Unknown'
      if (!regionData[region]) {
        regionData[region] = { name: region, value: 0 }
      }
      regionData[region].value += o.totalPrice
    })
    const salesByRegion = Object.values(regionData)

    // 4. Top 5 and bottom 5 products
    const productSales: Record<string, { name: string; sales: number; profit: number; quantity: number }> = {}
    enrichedOrders.forEach(o => {
      const name = o.sweetName || 'Unknown'
      if (!productSales[name]) {
        productSales[name] = { name, sales: 0, profit: 0, quantity: 0 }
      }
      productSales[name].sales += o.totalPrice
      productSales[name].profit += o.profit
      productSales[name].quantity += Number(o.quantity || 0)
    })
    const sortedProducts = Object.values(productSales).sort((a, b) => b.sales - a.sales)
    const topProducts = sortedProducts.slice(0, 5)
    const bottomProducts = sortedProducts.length > 5 ? sortedProducts.slice(-5) : []

    // Insights & Recommendations
    const topCategoryObj = salesByCategory.sort((a, b) => b.value - a.value)[0]
    const topCategory = topCategoryObj ? topCategoryObj.name : 'N/A'
    
    const topRegionObj = salesByRegion.sort((a, b) => b.value - a.value)[0]
    const topRegion = topRegionObj ? topRegionObj.name : 'N/A'
    
    const insights = [
      `Overall sales performance is driven by the ${topCategory} category.`,
      `${topRegion} region shows the highest sales volume across all territories.`,
      `Average Order Value (AOV) stands at ₹${averageOrderValue.toFixed(2)}.`,
      `The most profitable product is ${topProducts[0]?.name || 'N/A'}.`
    ]

    const recommendations = [
      `Focus marketing efforts on the ${topCategory} category to capitalize on current trends.`,
      `Investigate low sales in ${bottomProducts[0]?.name || 'N/A'} and consider promotional offers or menu adjustments.`,
      `Expand distribution channels in ${topRegion} to further increase market share.`,
      `Implement loyalty programs to increase the Average Order Value (AOV).`
    ]

    return NextResponse.json({
      kpis: {
        totalSales,
        totalProfit,
        totalOrders,
        averageOrderValue,
        profitMargin
      },
      visualizations: {
        salesTrend,
        salesByCategory,
        salesByRegion,
        topProducts,
        bottomProducts,
        profitVsSales: sortedProducts.map((p) => ({
          name: p.name,
          sales: p.sales,
          profit: p.profit
        }))
      },
      insights,
      recommendations,
      filters: {
        categories: [...new Set(sweets.map(s => s.category))],
        regions: ['North', 'South', 'East', 'West', 'Central'],
        products: [...new Set(sweets.map(s => s.name))]
      }
    })
  } catch (error) {
    console.error('Error in sales analysis API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales analysis data' },
      { status: 500 }
    )
  }
}
