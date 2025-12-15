"use client"

import { useState, useEffect, useMemo } from "react"
import { Sweet } from "@/lib/types"
import { Navbar } from "@/components/navbar"
import { SweetCard } from "@/components/sweet-card"
import { FloatingCart } from "@/components/floating-cart"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Search, Filter, X, Loader2, ChevronDown, ChevronUp } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function HomePage() {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100])
  const [showFilters, setShowFilters] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const INITIAL_DISPLAY_COUNT = 12

  useEffect(() => {
    fetchSweets()
  }, [])

  const fetchSweets = async () => {
    try {
      const res = await fetch('/api/sweets')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setSweets(data.sweets || [])
    } catch (error) {
      console.error('Failed to fetch sweets:', error)
      setSweets([])
    } finally {
      setIsLoading(false)
    }
  }

  const categories = useMemo(() => {
    const cats = [...new Set(sweets.map(s => s.category))]
    return cats.sort()
  }, [sweets])

  const maxPrice = useMemo(() => {
    return Math.max(...sweets.map(s => s.price), 100)
  }, [sweets])

  const filteredSweets = useMemo(() => {
    return sweets.filter(sweet => {
      const matchesSearch = sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sweet.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !selectedCategory || sweet.category === selectedCategory
      const matchesPrice = sweet.price >= priceRange[0] && sweet.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [sweets, searchQuery, selectedCategory, priceRange])

  const displayedSweets = useMemo(() => {
    return showAll ? filteredSweets : filteredSweets.slice(0, INITIAL_DISPLAY_COUNT)
  }, [filteredSweets, showAll])

  const hasMore = filteredSweets.length > INITIAL_DISPLAY_COUNT

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setPriceRange([0, maxPrice])
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/10 to-background">
      <Navbar />
      
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="mb-4 flex justify-center">
              <Image src="/mithai-icon.png" alt="Mithai Mahal" width={64} height={64} className="rounded-full" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent">
              Mithai Mahal
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover the finest collection of authentic Indian sweets and snacks, 
              crafted with love and tradition
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#sweets">
                <Button size="lg" className="gap-2">
                  Explore Sweets
                </Button>
              </a>
              <a href="/register">
                <Button size="lg" variant="outline">
                  Join Us
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="sweets" className="py-12 container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card/50"
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 lg:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card/50 rounded-lg p-4 space-y-4 backdrop-blur border">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-3">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </h4>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  min={0}
                  max={maxPrice}
                  step={5}
                  className="mt-2"
                />
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {displayedSweets.length} of {filteredSweets.length} sweets
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredSweets.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No sweets found matching your criteria</p>
                <Button variant="link" onClick={clearFilters}>Clear filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedSweets.map((sweet, index) => (
                    <motion.div
                      key={sweet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <SweetCard sweet={sweet} />
                    </motion.div>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={() => setShowAll(!showAll)}
                      variant="outline"
                      size="lg"
                      className="gap-2"
                    >
                      {showAll ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Show More ({filteredSweets.length - INITIAL_DISPLAY_COUNT} more)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </section>

      <FloatingCart />

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Mithai Mahal. All rights reserved.</p>
          <p className="mt-2">Made with love for Indian sweets lovers</p>
        </div>
      </footer>
    </div>
  )
}