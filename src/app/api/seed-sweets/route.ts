import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

/**
 * Stable Wikimedia image generator
 * Ensures image name matches item name
 */
const imageFromName = (name: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    name.replace(/ /g, "_")
  )}.jpg`

export const indianSweets = [
  // ===== SWEETS =====
  { name: "Gulab Jamun", category: "Sweet", price: 40, quantity: 100, description: "Deep-fried milk solids soaked in sugar syrup" },
  { name: "Rasgulla", category: "Sweet", price: 35, quantity: 100, description: "Spongy cottage cheese balls in syrup" },
  { name: "Jalebi", category: "Sweet", price: 30, quantity: 150, description: "Crispy spiral sweet soaked in syrup" },
  { name: "Kaju Katli", category: "Sweet", price: 80, quantity: 80, description: "Cashew fudge with silver leaf" },
  { name: "Besan Ladoo", category: "Sweet", price: 30, quantity: 180, description: "Gram flour sweet balls" },
  { name: "Motichoor Ladoo", category: "Sweet", price: 35, quantity: 170, description: "Fine boondi ladoos" },
  { name: "Coconut Ladoo", category: "Sweet", price: 30, quantity: 160, description: "Coconut sweet balls" },
  { name: "Rava Ladoo", category: "Sweet", price: 35, quantity: 150, description: "Semolina sweet balls" },
  { name: "Barfi", category: "Sweet", price: 50, quantity: 120, description: "Milk-based fudge" },
  { name: "Anjeer Barfi", category: "Sweet", price: 85, quantity: 55, description: "Fig-based fudge" },
  { name: "Badam Barfi", category: "Sweet", price: 95, quantity: 50, description: "Almond fudge" },
  { name: "Pista Barfi", category: "Sweet", price: 100, quantity: 45, description: "Pistachio fudge" },
  { name: "Kalakand", category: "Sweet", price: 60, quantity: 80, description: "Milk cake with cardamom" },
  { name: "Milk Cake", category: "Sweet", price: 55, quantity: 85, description: "Caramelized milk sweet" },
  { name: "Sohan Papdi", category: "Sweet", price: 40, quantity: 130, description: "Flaky layered sweet" },
  { name: "Patisa", category: "Sweet", price: 40, quantity: 110, description: "Layered flaky sweet" },
  { name: "Ghevar", category: "Sweet", price: 60, quantity: 70, description: "Rajasthani disc sweet" },
  { name: "Gujiya", category: "Sweet", price: 35, quantity: 120, description: "Stuffed sweet dumpling" },
  { name: "Petha", category: "Sweet", price: 45, quantity: 100, description: "Ash gourd sweet from Agra" },
  { name: "Pinni", category: "Sweet", price: 40, quantity: 90, description: "Punjabi wheat sweet" },

  // ===== DESSERTS =====
  { name: "Rasmalai", category: "Dessert", price: 60, quantity: 70, description: "Paneer dumplings in saffron milk" },
  { name: "Kheer", category: "Dessert", price: 50, quantity: 60, description: "Rice pudding" },
  { name: "Gajar Ka Halwa", category: "Dessert", price: 55, quantity: 65, description: "Carrot pudding" },
  { name: "Moong Dal Halwa", category: "Dessert", price: 70, quantity: 50, description: "Lentil halwa" },
  { name: "Malpua", category: "Dessert", price: 40, quantity: 85, description: "Sweet pancake" },
  { name: "Shrikhand", category: "Dessert", price: 55, quantity: 70, description: "Sweetened yogurt" },
  { name: "Rabri", category: "Dessert", price: 60, quantity: 65, description: "Condensed milk dessert" },
  { name: "Phirni", category: "Dessert", price: 50, quantity: 75, description: "Ground rice pudding" },
  { name: "Kulfi", category: "Dessert", price: 45, quantity: 90, description: "Indian ice cream" },
  { name: "Falooda", category: "Dessert", price: 70, quantity: 60, description: "Milk & ice cream dessert" },

  // ===== SNACKS =====
  { name: "Samosa", category: "Snack", price: 20, quantity: 200, description: "Potato filled pastry" },
  { name: "Kachori", category: "Snack", price: 25, quantity: 150, description: "Stuffed fried snack" },
  { name: "Pakora", category: "Snack", price: 30, quantity: 180, description: "Vegetable fritters" },
  { name: "Aloo Tikki", category: "Snack", price: 25, quantity: 160, description: "Potato patties" },
  { name: "Pani Puri", category: "Snack", price: 30, quantity: 140, description: "Crispy puris with water" },
  { name: "Bhel Puri", category: "Snack", price: 35, quantity: 130, description: "Puffed rice chaat" },
  { name: "Sev Puri", category: "Snack", price: 35, quantity: 120, description: "Sev topped puris" },
  { name: "Dahi Puri", category: "Snack", price: 40, quantity: 110, description: "Yogurt filled puris" },
  { name: "Papdi Chaat", category: "Snack", price: 40, quantity: 115, description: "Crispy wafers chaat" },
  { name: "Raj Kachori", category: "Snack", price: 50, quantity: 80, description: "Stuffed large puri" },
  { name: "Dhokla", category: "Snack", price: 35, quantity: 100, description: "Steamed gram flour cake" },
  { name: "Khandvi", category: "Snack", price: 40, quantity: 85, description: "Rolled savory snack" },
  { name: "Bread Pakora", category: "Snack", price: 30, quantity: 115, description: "Stuffed bread fritter" },

  // ===== NAMKEEN =====
  { name: "Bhujia", category: "Namkeen", price: 45, quantity: 150, description: "Crispy sev snack" },
  { name: "Chakli", category: "Namkeen", price: 40, quantity: 140, description: "Spiral crispy snack" },
  { name: "Namak Pare", category: "Namkeen", price: 35, quantity: 160, description: "Salty crackers" },
  { name: "Mathri", category: "Namkeen", price: 30, quantity: 170, description: "Flaky crackers" },
  { name: "Murukku", category: "Namkeen", price: 45, quantity: 130, description: "South Indian crunchy snack" },
  { name: "Mixture", category: "Namkeen", price: 50, quantity: 140, description: "Mixed crunchy snack" },
  { name: "Aloo Bhujia", category: "Namkeen", price: 40, quantity: 145, description: "Potato sev" },
  { name: "Masala Peanuts", category: "Namkeen", price: 35, quantity: 160, description: "Spiced peanuts" },
  { name: "Khakhra", category: "Namkeen", price: 40, quantity: 120, description: "Thin wheat cracker" },
  { name: "Fafda", category: "Namkeen", price: 35, quantity: 130, description: "Gram flour strips" },
  { name: "Chivda", category: "Namkeen", price: 45, quantity: 125, description: "Flattened rice mix" },
  { name: "Banana Chips", category: "Namkeen", price: 40, quantity: 150, description: "Fried banana slices" }
].map(item => ({
  ...item,
  image: imageFromName(item.name)
}))

export async function POST() {
  try {
    const db = await getDb()

    await db.collection("sweets").deleteMany({})

    const data = indianSweets.map(item => ({
      ...item,
      id: Math.random().toString(36).slice(2, 9),
      created_at: new Date(),
      updated_at: new Date()
    }))

    await db.collection("sweets").insertMany(data)

    return NextResponse.json({
      success: true,
      count: data.length,
      message: "All 77 items seeded successfully"
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Seed failed" }, { status: 500 })
  }
}
