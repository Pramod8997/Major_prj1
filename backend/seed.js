const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Dish = require('./models/Dish');

const seedDB = async () => {
  console.log('Seeding database with 25 restaurants and 100+ dishes...');
  await Restaurant.deleteMany({});
  await Dish.deleteMany({});

  const categories = ['Burgers', 'Pizza', 'Sushi', 'Indian', 'Chinese', 'Desserts', 'Beverages', 'Healthy', 'Mexican', 'Italian', 'Thai', 'Lebanese', 'Breakfast', 'Bakery', 'Street Food'];
  const dishPrefixes = ['Spicy', 'Sweet', 'Tangy', 'Crispy', 'Sizzling', 'Classic', 'Special', 'Ultimate', 'Premium', 'Signature', 'Roasted', 'Fried', 'Grilled', 'Steamed', 'Baked'];
  const baseItems = ['Burger', 'Pizza', 'Roll', 'Curry', 'Noodles', 'Cake', 'Smoothie', 'Salad', 'Tacos', 'Pasta', 'Soup', 'Wrap', 'Bowl', 'Sandwich', 'Platter'];
  
  const allDishes = [];
  
  // Generate 105 dishes (7 per category on avg)
  for (let i = 0; i < 105; i++) {
    const category = categories[i % categories.length];
    const prefix = dishPrefixes[Math.floor(Math.random() * dishPrefixes.length)];
    const baseItem = baseItems[Math.floor(Math.random() * baseItems.length)];
    
    // Some real sounding dishes
    let dishName = `${prefix} ${category} ${baseItem}`;
    if (category === 'Burgers' || category === 'Pizza' || category === 'Sushi') {
        dishName = `${prefix} ${category}`;
    } else {
        dishName = `${prefix} ${baseItem} (${category})`;
    }

    allDishes.push({
      name: dishName,
      description: `A delicious ${category.toLowerCase()} item crafted with the finest ingredients.`,
      price: Number((Math.random() * 20 + 5).toFixed(2)),
      category: category,
      image: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600` // generic food image
    });
  }
  
  const insertedDishes = await Dish.insertMany(allDishes);

  const restaurantNames = [
    'The Golden Spoon', 'Spice Symphony', 'Ocean Bites', 'Urban Plates', 'Rustic Roots',
    'Sizzle & Smoke', 'Green Leaf', 'Bella Italia', 'Tokyo Drift', 'Bombay Blues',
    'Taco Fiesta', 'Burger Bar', 'Pizza Paradise', 'Sweet Cravings', 'Noodle Ninja',
    'Vegan Delight', 'Steakhouse Supreme', 'Seafood Bay', 'Wrap World', 'Dim Sum Dynasty',
    'Curry House', 'Bake & Flake', 'Grill Master', 'Healthy Habits', 'Midnight Munchies'
  ];

  const restaurantsData = [];
  
  for (let i = 0; i < 25; i++) {
    // Assign 8-15 random dishes to each restaurant
    const numDishes = Math.floor(Math.random() * 8) + 8;
    const assignedDishes = [];
    for (let j = 0; j < numDishes; j++) {
      const randomDish = insertedDishes[Math.floor(Math.random() * insertedDishes.length)];
      if (!assignedDishes.includes(randomDish._id)) {
        assignedDishes.push(randomDish._id);
      }
    }
    
    restaurantsData.push({
      name: restaurantNames[i],
      description: `Experience the finest dining at ${restaurantNames[i]} with our exquisite collection of dishes.`,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800',
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
      deliveryTime: `${Math.floor(Math.random() * 20) + 20}-${Math.floor(Math.random() * 20) + 40} min`,
      dishes: assignedDishes
    });
  }

  await Restaurant.insertMany(restaurantsData);
  console.log('Database seeded successfully with 25 restaurants and 105 dishes');
};

module.exports = seedDB;
