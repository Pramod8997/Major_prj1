const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Dish = require('./models/Dish');

const seedDB = async () => {
  console.log('Seeding database...');
  await Restaurant.deleteMany({});
  await Dish.deleteMany({});

  const dishesData1 = [
    { name: 'Truffle Burger', description: 'Wagyu beef patty with truffle mayo and caramelized onions.', price: 18.99, category: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600' },
    { name: 'Classic Fries', description: 'Crispy golden fries with sea salt.', price: 4.99, category: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600' },
    { name: 'Spicy Chicken Sandwich', description: 'Crispy fried chicken with spicy slaw on a brioche bun.', price: 15.50, category: 'Sandwiches', image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&q=80&w=600' }
  ];

  const dishesData2 = [
    { name: 'Margherita Pizza', description: 'San Marzano tomato sauce, fresh mozzarella, and basil.', price: 16.00, category: 'Pizza', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a30536?auto=format&fit=crop&q=80&w=600' },
    { name: 'Pepperoni Pizza', description: 'Classic pepperoni with a blend of cheeses.', price: 19.00, category: 'Pizza', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=600' },
    { name: 'Garlic Knots', description: 'Oven-baked dough knots coated in garlic butter and parmesan.', price: 6.50, category: 'Sides', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=600' }
  ];

  const dishesData3 = [
    { name: 'Spicy Tuna Roll', description: 'Fresh tuna with spicy mayo and cucumber.', price: 12.00, category: 'Sushi', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=600' },
    { name: 'Dragon Roll', description: 'Eel, cucumber, topped with avocado and sweet sauce.', price: 16.50, category: 'Sushi', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=600' },
    { name: 'Miso Soup', description: 'Traditional Japanese soup with tofu and seaweed.', price: 4.00, category: 'Soups', image: 'https://images.unsplash.com/photo-1548943487-a2e4b43b4850?auto=format&fit=crop&q=80&w=600' }
  ];

  const insertedDishes1 = await Dish.insertMany(dishesData1);
  const insertedDishes2 = await Dish.insertMany(dishesData2);
  const insertedDishes3 = await Dish.insertMany(dishesData3);

  const restaurantsData = [
    {
      name: 'Burger Artisan',
      description: 'Gourmet burgers crafted with premium ingredients and passion.',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
      rating: 4.8,
      deliveryTime: '25-40 min',
      dishes: insertedDishes1.map(d => d._id)
    },
    {
      name: 'Pizzeria Napoli',
      description: 'Authentic wood-fired Neapolitan pizzas.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
      rating: 4.7,
      deliveryTime: '30-45 min',
      dishes: insertedDishes2.map(d => d._id)
    },
    {
      name: 'Sakura Sushi House',
      description: 'Fresh, elegant sushi and traditional Japanese cuisine.',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
      rating: 4.9,
      deliveryTime: '40-55 min',
      dishes: insertedDishes3.map(d => d._id)
    }
  ];

  await Restaurant.insertMany(restaurantsData);
  console.log('Database seeded successfully');
};

module.exports = seedDB;
