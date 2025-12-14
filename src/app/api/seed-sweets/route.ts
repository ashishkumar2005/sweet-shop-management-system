import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export const indianSweets = [
  { 
    name: "Gulab Jamun", 
    category: "Sweet", 
    price: 40, 
    quantity: 100, 
    description: "Deep-fried milk solids soaked in rose-flavored sugar syrup", 
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&h=500&fit=crop" 
  },
  { 
    name: "Rasgulla", 
    category: "Sweet", 
    price: 35, 
    quantity: 100, 
    description: "Soft spongy cottage cheese balls in light sugar syrup", 
    image: "https://images.unsplash.com/photo-1626132647523-66f0bf380027?w=500&h=500&fit=crop" 
  },
  { 
    name: "Jalebi", 
    category: "Sweet", 
    price: 30, 
    quantity: 150, 
    description: "Crispy spiral-shaped sweet soaked in saffron syrup", 
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop" 
  },
  { 
    name: "Kaju Katli", 
    category: "Sweet", 
    price: 80, 
    quantity: 80, 
    description: "Diamond-shaped cashew fudge with silver foil", 
    image: "https://images.unsplash.com/photo-1626776876729-bab4269f07ab?w=500&h=500&fit=crop" 
  },
  { 
    name: "Ladoo", 
    category: "Sweet", 
    price: 25, 
    quantity: 200, 
    description: "Traditional round sweet made with besan and ghee", 
    image: "https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=500&h=500&fit=crop" 
  },
  { 
    name: "Barfi", 
    category: "Sweet", 
    price: 50, 
    quantity: 120, 
    description: "Dense milk-based fudge with cardamom flavor", 
    image: "https://images.unsplash.com/photo-1626776877900-b3cecf3b2fc7?w=500&h=500&fit=crop" 
  },
  { 
    name: "Peda", 
    category: "Sweet", 
    price: 45, 
    quantity: 90, 
    description: "Soft milk-based sweet with saffron and cardamom", 
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&h=500&fit=crop" 
  },
  { 
    name: "Rasmalai", 
    category: "Dessert", 
    price: 60, 
    quantity: 70, 
    description: "Flattened paneer dumplings in creamy saffron milk", 
    image: "https://images.unsplash.com/photo-1601000938259-9e92002320b2?w=500&h=500&fit=crop" 
  },
  { 
    name: "Sandesh", 
    category: "Sweet", 
    price: 55, 
    quantity: 85, 
    description: "Bengali sweet made from fresh paneer and sugar", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Mysore Pak", 
    category: "Sweet", 
    price: 65, 
    quantity: 75, 
    description: "Rich gram flour sweet with ghee and sugar", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Imarti", 
    category: "Sweet", 
    price: 35, 
    quantity: 110, 
    description: "Flower-shaped deep-fried sweet in sugar syrup", 
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop" 
  },
  { 
    name: "Kheer", 
    category: "Dessert", 
    price: 50, 
    quantity: 60, 
    description: "Creamy rice pudding with cardamom and nuts", 
    image: "https://images.unsplash.com/photo-1589363904582-0ab1d7acf114?w=500&h=500&fit=crop" 
  },
  { 
    name: "Gajar Ka Halwa", 
    category: "Dessert", 
    price: 55, 
    quantity: 65, 
    description: "Warm carrot pudding with khoya and nuts", 
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop" 
  },
  { 
    name: "Moong Dal Halwa", 
    category: "Dessert", 
    price: 70, 
    quantity: 50, 
    description: "Rich lentil-based halwa with ghee", 
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop" 
  },
  { 
    name: "Sohan Papdi", 
    category: "Sweet", 
    price: 40, 
    quantity: 130, 
    description: "Flaky layered sweet with cardamom", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Kalakand", 
    category: "Sweet", 
    price: 60, 
    quantity: 80, 
    description: "Grainy milk cake with cardamom", 
    image: "https://images.unsplash.com/photo-1626776877900-b3cecf3b2fc7?w=500&h=500&fit=crop" 
  },
  { 
    name: "Cham Cham", 
    category: "Sweet", 
    price: 45, 
    quantity: 90, 
    description: "Oval-shaped Bengali sweet in light syrup", 
    image: "https://images.unsplash.com/photo-1626132647523-66f0bf380027?w=500&h=500&fit=crop" 
  },
  { 
    name: "Khaja", 
    category: "Sweet", 
    price: 30, 
    quantity: 100, 
    description: "Crispy layered pastry dipped in sugar syrup", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Balushahi", 
    category: "Sweet", 
    price: 35, 
    quantity: 95, 
    description: "Flaky fried pastry soaked in sugar syrup", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Malpua", 
    category: "Dessert", 
    price: 40, 
    quantity: 85, 
    description: "Sweet pancake dipped in sugar syrup", 
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&h=500&fit=crop" 
  },

  { 
    name: "Samosa", 
    category: "Snack", 
    price: 20, 
    quantity: 200, 
    description: "Crispy triangular pastry with spiced potato filling", 
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&h=500&fit=crop" 
  },
  { 
    name: "Kachori", 
    category: "Snack", 
    price: 25, 
    quantity: 150, 
    description: "Deep-fried flaky pastry with dal filling", 
    image: "https://images.unsplash.com/photo-1626132647523-66f0bf380027?w=500&h=500&fit=crop" 
  },
  { 
    name: "Pakora", 
    category: "Snack", 
    price: 30, 
    quantity: 180, 
    description: "Crispy vegetable fritters in gram flour batter", 
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop" 
  },
  { 
    name: "Aloo Tikki", 
    category: "Snack", 
    price: 25, 
    quantity: 160, 
    description: "Spiced potato patties fried until golden", 
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop" 
  },
  { 
    name: "Pani Puri", 
    category: "Snack", 
    price: 30, 
    quantity: 140, 
    description: "Crispy hollow puris with spiced water", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Bhel Puri", 
    category: "Snack", 
    price: 35, 
    quantity: 130, 
    description: "Tangy puffed rice mixture with chutneys", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Sev Puri", 
    category: "Snack", 
    price: 35, 
    quantity: 120, 
    description: "Crispy puris topped with sev and chutneys", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Dahi Puri", 
    category: "Snack", 
    price: 40, 
    quantity: 110, 
    description: "Puris filled with yogurt and chutneys", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Papdi Chaat", 
    category: "Snack", 
    price: 40, 
    quantity: 115, 
    description: "Crispy wafers with potatoes and chutneys", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Ragda Pattice", 
    category: "Snack", 
    price: 45, 
    quantity: 100, 
    description: "Potato patties with spiced white peas curry", 
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop" 
  },

  { 
    name: "Sev Tamatar", 
    category: "Namkeen", 
    price: 50, 
    quantity: 80, 
    description: "Sev in spicy tomato gravy", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Bhujia", 
    category: "Namkeen", 
    price: 45, 
    quantity: 150, 
    description: "Crispy besan noodles with spices", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Chakli", 
    category: "Namkeen", 
    price: 40, 
    quantity: 140, 
    description: "Spiral-shaped crispy rice flour snack", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Namak Pare", 
    category: "Namkeen", 
    price: 35, 
    quantity: 160, 
    description: "Diamond-shaped salty crackers", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Shakkar Para", 
    category: "Sweet", 
    price: 35, 
    quantity: 150, 
    description: "Sweet diamond-shaped fried crackers", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Mathri", 
    category: "Namkeen", 
    price: 30, 
    quantity: 170, 
    description: "Flaky crispy savory crackers", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Murukku", 
    category: "Namkeen", 
    price: 45, 
    quantity: 130, 
    description: "Spiral-shaped crunchy South Indian snack", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Mixture", 
    category: "Namkeen", 
    price: 50, 
    quantity: 140, 
    description: "Assorted crispy snack mix", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Aloo Bhujia", 
    category: "Namkeen", 
    price: 40, 
    quantity: 145, 
    description: "Potato-based crispy noodles", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Masala Peanuts", 
    category: "Namkeen", 
    price: 35, 
    quantity: 160, 
    description: "Spiced coated peanuts", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Khakhra", 
    category: "Namkeen", 
    price: 40, 
    quantity: 120, 
    description: "Thin crispy wheat crackers", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Fafda", 
    category: "Namkeen", 
    price: 35, 
    quantity: 130, 
    description: "Crispy gram flour strips", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Gathiya", 
    category: "Namkeen", 
    price: 35, 
    quantity: 135, 
    description: "Thick crispy gram flour snack", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Chivda", 
    category: "Namkeen", 
    price: 45, 
    quantity: 125, 
    description: "Flattened rice snack mix", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Banana Chips", 
    category: "Namkeen", 
    price: 40, 
    quantity: 150, 
    description: "Crispy fried banana slices", 
    image: "https://images.unsplash.com/photo-1612822182443-1b8c4b01f9e6?w=500&h=500&fit=crop" 
  },
  { 
    name: "Shrikhand", 
    category: "Dessert", 
    price: 55, 
    quantity: 70, 
    description: "Sweet strained yogurt with saffron", 
    image: "https://images.unsplash.com/photo-1589363904582-0ab1d7acf114?w=500&h=500&fit=crop" 
  },
  { 
    name: "Rabri", 
    category: "Dessert", 
    price: 60, 
    quantity: 65, 
    description: "Sweetened condensed milk dessert", 
    image: "https://images.unsplash.com/photo-1589363904582-0ab1d7acf114?w=500&h=500&fit=crop" 
  },
  { 
    name: "Phirni", 
    category: "Dessert", 
    price: 50, 
    quantity: 75, 
    description: "Creamy ground rice pudding", 
    image: "https://images.unsplash.com/photo-1589363904582-0ab1d7acf114?w=500&h=500&fit=crop" 
  },
  { 
    name: "Kulfi", 
    category: "Dessert", 
    price: 45, 
    quantity: 90, 
    description: "Traditional Indian ice cream", 
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&h=500&fit=crop" 
  },
  { 
    name: "Falooda", 
    category: "Dessert", 
    price: 70, 
    quantity: 60, 
    description: "Cold dessert with vermicelli and ice cream", 
    image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&h=500&fit=crop" 
  },
  { 
    name: "Besan Ladoo", 
    category: "Sweet", 
    price: 30, 
    quantity: 180, 
    description: "Sweet gram flour balls with ghee", 
    image: "https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=500&h=500&fit=crop" 
  },
  { 
    name: "Motichoor Ladoo", 
    category: "Sweet", 
    price: 35, 
    quantity: 170, 
    description: "Tiny boondi pearls shaped into balls", 
    image: "https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=500&h=500&fit=crop" 
  },
  { 
    name: "Coconut Ladoo", 
    category: "Sweet", 
    price: 30, 
    quantity: 160, 
    description: "Sweet coconut and condensed milk balls", 
    image: "https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=500&h=500&fit=crop" 
  },
  { 
    name: "Rava Ladoo", 
    category: "Sweet", 
    price: 35, 
    quantity: 150, 
    description: "Semolina balls with ghee and nuts", 
    image: "https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=500&h=500&fit=crop" 
  },
  { 
    name: "Dry Fruit Roll", 
    category: "Sweet", 
    price: 90, 
    quantity: 60, 
    description: "Premium roll with mixed dry fruits", 
    image: "https://images.unsplash.com/photo-1626776877900-b3cecf3b2fc7?w=500&h=500&fit=crop" 
  },
  { 
    name: "Anjeer Barfi", 
    category: "Sweet", 
    price: 85, 
    quantity: 55, 
    description: "Fig-based fudge with nuts", 
    image: "https://images.unsplash.com/photo-1626776877900-b3cecf3b2fc7?w=500&h=500&fit=crop" 
  },
  { 
    name: "Badam Barfi", 
    category: "Sweet", 
    price: 95, 
    quantity: 50, 
    description: "Almond fudge with silver foil", 
    image: "https://images.unsplash.com/photo-1626776877900-b3cecf3b2fc7?w=500&h=500&fit=crop" 
  },
  { 
    name: "Pista Barfi", 
    category: "Sweet", 
    price: 100, 
    quantity: 45, 
    description: "Pistachio fudge with cardamom", 
    image: "https://images.unsplash.com/photo-1626776877900-b3cecf3b2fc7?w=500&h=500&fit=crop" 
  },
  { 
    name: "Coconut Barfi", 
    category: "Sweet", 
    price: 45, 
    quantity: 100, 
    description: "Sweet coconut fudge squares", 
    image: "https://images.unsplash.com/photo-1626776877900-b3cecf3b2fc7?w=500&h=500&fit=crop" 
  },
  { 
    name: "Milk Cake", 
    category: "Sweet", 
    price: 55, 
    quantity: 85, 
    description: "Caramelized milk sweet", 
    image: "https://images.unsplash.com/photo-1626776877900-b3cecf3b2fc7?w=500&h=500&fit=crop" 
  },
  { 
    name: "Patisa", 
    category: "Sweet", 
    price: 40, 
    quantity: 110, 
    description: "Flaky layered sweet similar to Sohan Papdi", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Chum Chum", 
    category: "Sweet", 
    price: 45, 
    quantity: 95, 
    description: "Cylindrical Bengali sweet", 
    image: "https://images.unsplash.com/photo-1626132647523-66f0bf380027?w=500&h=500&fit=crop" 
  },
  { 
    name: "Malai Sandwich", 
    category: "Sweet", 
    price: 50, 
    quantity: 80, 
    description: "Cream-filled sweet sandwich", 
    image: "https://images.unsplash.com/photo-1626132647523-66f0bf380027?w=500&h=500&fit=crop" 
  },
  { 
    name: "Gujiya", 
    category: "Sweet", 
    price: 35, 
    quantity: 120, 
    description: "Sweet dumpling with khoya filling", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Ghevar", 
    category: "Sweet", 
    price: 60, 
    quantity: 70, 
    description: "Disc-shaped Rajasthani sweet", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Pinni", 
    category: "Sweet", 
    price: 40, 
    quantity: 90, 
    description: "Punjabi wheat flour sweet balls", 
    image: "https://images.unsplash.com/photo-1595777216528-071e0127ccf4?w=500&h=500&fit=crop" 
  },
  { 
    name: "Petha", 
    category: "Sweet", 
    price: 45, 
    quantity: 100, 
    description: "Translucent ash gourd sweet from Agra", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Raj Kachori", 
    category: "Snack", 
    price: 50, 
    quantity: 80, 
    description: "Large stuffed crispy puri with fillings", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Dahi Vada", 
    category: "Snack", 
    price: 40, 
    quantity: 90, 
    description: "Lentil dumplings in spiced yogurt", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Dhokla", 
    category: "Snack", 
    price: 35, 
    quantity: 100, 
    description: "Steamed savory gram flour cake", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Khandvi", 
    category: "Snack", 
    price: 40, 
    quantity: 85, 
    description: "Rolled gram flour savory snack", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Thepla", 
    category: "Snack", 
    price: 30, 
    quantity: 110, 
    description: "Spiced flatbread with fenugreek", 
    image: "https://images.unsplash.com/photo-1606312619070-d48b4a7af4ce?w=500&h=500&fit=crop" 
  },
  { 
    name: "Methi Gota", 
    category: "Snack", 
    price: 35, 
    quantity: 95, 
    description: "Fenugreek fritters", 
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop" 
  },
  { 
    name: "Onion Bhaji", 
    category: "Snack", 
    price: 30, 
    quantity: 120, 
    description: "Crispy onion fritters", 
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop" 
  },
  { 
    name: "Mirchi Vada", 
    category: "Snack", 
    price: 25, 
    quantity: 130, 
    description: "Stuffed chili fritters", 
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop" 
  },
  { 
    name: "Bread Pakora", 
    category: "Snack", 
    price: 30, 
    quantity: 115, 
    description: "Stuffed bread fritters", 
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop" 
  },
  { 
    name: "Moong Dal Pakora", 
    category: "Snack", 
    price: 35, 
    quantity: 105, 
    description: "Lentil fritters", 
    image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=500&h=500&fit=crop" 
  }
];

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