import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

const indianSweets = [
  { name: "Gulab Jamun", category: "Syrupy Sweet", price: 120, quantity: 50, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/07/gulab-jamun-1.jpg", description: "Soft milk-solid balls soaked in rose-cardamom syrup" },
  { name: "Rasgulla", category: "Syrupy Sweet", price: 100, quantity: 45, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/03/rasgulla-recipe-1.jpg", description: "Spongy cheese balls in sugar syrup" },
  { name: "Jalebi", category: "Fried Sweet", price: 80, quantity: 60, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/08/jalebi-recipe-1.jpg", description: "Crispy spiral sweet soaked in saffron syrup" },
  { name: "Kaju Katli", category: "Barfi", price: 450, quantity: 30, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/09/kaju-katli-recipe-1.jpg", description: "Diamond-shaped cashew fudge with silver leaf" },
  { name: "Rasamalai", category: "Milk Sweet", price: 140, quantity: 35, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2016/03/rasmalai-recipe-1.jpg", description: "Soft paneer discs in creamy saffron milk" },
  { name: "Ladoo", category: "Ball Sweet", price: 90, quantity: 55, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/07/besan-ladoo-recipe-1.jpg", description: "Round gram flour sweet with cardamom" },
  { name: "Barfi", category: "Barfi", price: 180, quantity: 40, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/08/milk-barfi-recipe-1.jpg", description: "Creamy milk fudge with pistachios" },
  { name: "Kheer", category: "Milk Sweet", price: 70, quantity: 50, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/11/rice-kheer-recipe-1.jpg", description: "Traditional rice pudding with cardamom" },
  { name: "Peda", category: "Milk Sweet", price: 110, quantity: 48, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/08/milk-peda-recipe-1.jpg", description: "Soft milk sweet with saffron flavor" },
  { name: "Mysore Pak", category: "Fudge", price: 200, quantity: 32, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/03/mysore-pak-recipe-1.jpg", description: "Ghee-rich gram flour sweet from Karnataka" },
  { name: "Soan Papdi", category: "Flaky Sweet", price: 150, quantity: 38, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/10/soan-papdi-recipe-1.jpg", description: "Crispy flaky sweet with cardamom" },
  { name: "Gajar Halwa", category: "Halwa", price: 130, quantity: 42, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2013/12/gajar-halwa-recipe-1.jpg", description: "Carrot pudding with milk and dry fruits" },
  { name: "Kalakand", category: "Milk Sweet", price: 160, quantity: 36, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/10/kalakand-recipe-1.jpg", description: "Grainy milk sweet with cardamom" },
  { name: "Sandesh", category: "Bengali Sweet", price: 95, quantity: 44, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/06/sandesh-recipe-1.jpg", description: "Soft Bengali sweet made from paneer" },
  { name: "Motichoor Ladoo", category: "Ball Sweet", price: 120, quantity: 50, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/07/motichoor-ladoo-recipe-1.jpg", description: "Orange pearl-sized sweet balls" },
  { name: "Balushahi", category: "Fried Sweet", price: 85, quantity: 46, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2013/04/balushahi-recipe-1.jpg", description: "Flaky fried sweet dipped in sugar glaze" },
  { name: "Rava Kesari", category: "Halwa", price: 75, quantity: 52, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2019/02/kesari-bath-recipe-1.jpg", description: "Semolina sweet with saffron and ghee" },
  { name: "Coconut Barfi", category: "Barfi", price: 140, quantity: 40, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/08/coconut-barfi-recipe-1.jpg", description: "Sweet coconut fudge with cardamom" },
  { name: "Malai Peda", category: "Milk Sweet", price: 125, quantity: 43, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/11/malai-peda-recipe-1.jpg", description: "Creamy milk sweet with rich texture" },
  { name: "Dharwad Peda", category: "Regional Sweet", price: 135, quantity: 38, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2023/01/dharwad-peda-recipe-1.jpg", description: "Special peda from Karnataka" },
  { name: "Phirni", category: "Milk Sweet", price: 80, quantity: 48, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/02/phirni-recipe-1.jpg", description: "Ground rice pudding with rose water" },
  { name: "Chum Chum", category: "Bengali Sweet", price: 105, quantity: 41, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2019/09/cham-cham-recipe-1.jpg", description: "Oval-shaped spongy sweet with coconut" },
  { name: "Pista Barfi", category: "Barfi", price: 380, quantity: 28, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/10/pista-barfi-recipe-1.jpg", description: "Premium pistachio fudge" },
  { name: "Til Ladoo", category: "Ball Sweet", price: 65, quantity: 55, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/01/til-ladoo-recipe-1.jpg", description: "Sesame and jaggery sweet balls" },
  { name: "Anjeer Barfi", category: "Barfi", price: 320, quantity: 25, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2017/12/anjeer-barfi-recipe-1.jpg", description: "Fig and nut fudge" },
  { name: "Samosa", category: "Savory Snack", price: 30, quantity: 100, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/12/samosa-recipe-1.jpg", description: "Crispy fried pastry with spiced potato filling" },
  { name: "Kachori", category: "Savory Snack", price: 25, quantity: 90, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2013/12/dal-kachori-recipe-1.jpg", description: "Spicy lentil-stuffed fried bread" },
  { name: "Dhokla", category: "Steamed Snack", price: 40, quantity: 75, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2013/12/khaman-dhokla-recipe-1.jpg", description: "Spongy fermented gram flour cake" },
  { name: "Bhujia", category: "Crispy Snack", price: 55, quantity: 80, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2020/12/aloo-bhujia-recipe-1.jpg", description: "Crunchy spiced gram flour noodles" },
  { name: "Murukku", category: "Crispy Snack", price: 60, quantity: 70, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2017/11/murukku-recipe-1.jpg", description: "Spiral-shaped rice flour snack" },
  { name: "Chakli", category: "Crispy Snack", price: 65, quantity: 68, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2017/11/chakli-recipe-1.jpg", description: "Savory spiral-shaped rice snack" },
  { name: "Namak Para", category: "Savory Snack", price: 45, quantity: 85, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2013/10/namak-pare-recipe-1.jpg", description: "Crispy salty diamond-shaped crackers" },
  { name: "Mathri", category: "Savory Snack", price: 50, quantity: 78, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2013/11/mathri-recipe-1.jpg", description: "Flaky crispy layered crackers" },
  { name: "Chivda", category: "Mix Snack", price: 70, quantity: 65, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/01/poha-chivda-recipe-1.jpg", description: "Spiced flattened rice mix with nuts" },
  { name: "Sev", category: "Crispy Snack", price: 48, quantity: 82, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2018/10/besan-sev-recipe-1.jpg", description: "Thin crispy gram flour noodles" },
  { name: "Pakora", category: "Fried Snack", price: 35, quantity: 95, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/01/bread-pakora-recipe-1.jpg", description: "Vegetable fritters in gram flour batter" },
  { name: "Khakhra", category: "Crispy Snack", price: 42, quantity: 88, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/10/khakhra-recipe-1.jpg", description: "Thin crispy whole wheat crackers" },
  { name: "Namkeen Mixture", category: "Mix Snack", price: 68, quantity: 72, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/01/mixture-recipe-1.jpg", description: "Spicy blend of various crunchy snacks" },
  { name: "Boondi", category: "Crispy Snack", price: 52, quantity: 76, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/05/boondi-recipe-1.jpg", description: "Tiny crispy gram flour pearls" },
  { name: "Aloo Tikki", category: "Savory Snack", price: 38, quantity: 92, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/12/aloo-tikki-recipe-1.jpg", description: "Crispy potato patties with spices" },
  { name: "Gujiya", category: "Festival Sweet", price: 95, quantity: 44, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/03/gujiya-recipe-1.jpg", description: "Crescent-shaped fried sweet with khoya filling" },
  { name: "Puran Poli", category: "Sweet Bread", price: 55, quantity: 58, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/03/puran-poli-recipe-1.jpg", description: "Sweet flatbread stuffed with lentil filling" },
  { name: "Modak", category: "Festival Sweet", price: 85, quantity: 47, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/08/modak-recipe-1.jpg", description: "Dumpling-shaped sweet with coconut filling" },
  { name: "Ghevar", category: "Rajasthani Sweet", price: 175, quantity: 33, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2016/08/ghevar-recipe-1.jpg", description: "Disc-shaped honeycomb sweet with sugar syrup" },
  { name: "Shrikhand", category: "Yogurt Sweet", price: 90, quantity: 51, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/03/shrikhand-recipe-1.jpg", description: "Sweetened strained yogurt with saffron" },
  { name: "Basundi", category: "Milk Sweet", price: 100, quantity: 46, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/03/basundi-recipe-1.jpg", description: "Thickened sweetened milk with cardamom" },
  { name: "Seviyan", category: "Milk Sweet", price: 75, quantity: 54, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/07/seviyan-kheer-recipe-1.jpg", description: "Vermicelli pudding with milk and nuts" },
  { name: "Rabri", category: "Milk Sweet", price: 110, quantity: 43, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2015/03/rabri-recipe-1.jpg", description: "Thick sweet milk dessert with dry fruits" },
  { name: "Imarti", category: "Fried Sweet", price: 88, quantity: 49, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2019/10/imarti-recipe-1.jpg", description: "Lacy circular sweet soaked in sugar syrup" },
  { name: "Kulfi", category: "Frozen Sweet", price: 60, quantity: 62, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/06/malai-kulfi-recipe-1.jpg", description: "Traditional Indian ice cream with cardamom" },
  { name: "Falooda", category: "Dessert Drink", price: 95, quantity: 45, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/05/falooda-recipe-1.jpg", description: "Sweet milk drink with noodles and ice cream" },
  { name: "Chikki", category: "Brittle Sweet", price: 58, quantity: 67, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/01/peanut-chikki-recipe-1.jpg", description: "Peanut brittle with jaggery" },
  { name: "Pathishapta", category: "Bengali Sweet", price: 78, quantity: 52, image_url: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/01/patishapta-recipe-1.jpg", description: "Rice crepes filled with coconut and jaggery" }
]

export async function POST() {
  try {
    const db = await getDb()
    
    await db.collection('sweets').deleteMany({})
    
    const sweetsWithId = indianSweets.map(sweet => ({
      ...sweet,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date(),
      updated_at: new Date()
    }))
    
    await db.collection('sweets').insertMany(sweetsWithId)
    
    return NextResponse.json({ 
      success: true, 
      message: `${sweetsWithId.length} Indian sweets and snacks added!`,
      count: sweetsWithId.length
    })
  } catch (error) {
    console.error('Failed to seed sweets:', error)
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    )
  }
}