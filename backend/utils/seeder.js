const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const PetCategory = require('../models/PetCategory');
const Pet = require('../models/Pet');
const Product = require('../models/Product');
const Service = require('../models/Service');

const connectDB = require('../config/db');
connectDB();

const seed = async () => {
  try {
    await Promise.all([User.deleteMany(), PetCategory.deleteMany(), Pet.deleteMany(), Product.deleteMany(), Service.deleteMany()]);

    const admin = await User.create({ name: 'Admin User', email: 'admin@petstore.com', password: 'admin123', role: 'admin', phone: '555-0001' });
    const staff = await User.create({ name: 'Staff Member', email: 'staff@petstore.com', password: 'staff123', role: 'staff', phone: '555-0002' });
    const customer = await User.create({ name: 'John Doe', email: 'customer@petstore.com', password: 'customer123', role: 'customer', phone: '555-0003' });

    const categories = await PetCategory.insertMany([
      { name: 'Dogs', description: 'Loyal companions', image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400' },
      { name: 'Cats', description: 'Independent and elegant', image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400' },
      { name: 'Birds', description: 'Colorful and melodious', image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400' },
      { name: 'Fish', description: 'Aquatic wonders', image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400' },
      { name: 'Rabbits', description: 'Fluffy and playful', image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400' }
    ]);

    const [dogs, cats, birds, fish, rabbits] = categories;

    await Pet.insertMany([
      // Dogs
      { name: 'Max', category: dogs._id, breed: 'Golden Retriever', age: '2 years', gender: 'male', color: 'Golden', weight: '30 kg', price: 25000, description: 'Friendly and playful Golden Retriever, fully vaccinated and trained.', images: ['https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z29sZGVuJTIwcmV0cmlldmVyfGVufDB8fDB8fHww'], status: 'available', isVaccinated: true, isMicrochipped: true, healthCertificate: true, addedBy: staff._id, rating: 4.8, numReviews: 12 },
      { name: 'Charlie', category: dogs._id, breed: 'Labrador', age: '3 months', gender: 'male', color: 'Black', weight: '8 kg', price: 18000, description: 'Adorable Labrador puppy, playful and energetic.', images: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600'], status: 'available', isVaccinated: true, addedBy: staff._id, rating: 4.9, numReviews: 8 },
      { name: 'Rocky', category: dogs._id, breed: 'German Shepherd', age: '1 year', gender: 'male', color: 'Brown/Black', weight: '25 kg', price: 30000, description: 'Intelligent German Shepherd, alert and loyal companion.', images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600'], status: 'adoption', isAdoption: true, isVaccinated: true, addedBy: staff._id, rating: 4.7, numReviews: 5 },
      { name: 'Daisy', category: dogs._id, breed: 'Beagle', age: '4 months', gender: 'female', color: 'Tricolor', weight: '6 kg', price: 22000, description: 'Curious and friendly Beagle puppy, great with kids and other pets.', images: ['https://images.unsplash.com/photo-1537151625747-7ae87041895a?w=600'], status: 'available', isVaccinated: true, addedBy: staff._id, rating: 4.5, numReviews: 3 },
      { name: 'Storm', category: dogs._id, breed: 'Siberian Husky', age: '1.5 years', gender: 'male', color: 'Grey/White', weight: '22 kg', price: 35000, description: 'Stunning blue-eyed Siberian Husky, high energy and very social.', images: ['https://images.unsplash.com/photo-1531804055935-76f44d7c3621?w=600'], status: 'available', isVaccinated: true, isMicrochipped: true, healthCertificate: true, addedBy: staff._id, rating: 4.9, numReviews: 9 },

      // Cats
      { name: 'Bella', category: cats._id, breed: 'Persian', age: '1 year', gender: 'female', color: 'White', weight: '4 kg', price: 15000, description: 'Beautiful Persian cat with silky fur, calm temperament.', images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600'], status: 'available', isVaccinated: true, addedBy: staff._id, rating: 4.6, numReviews: 10 },
      { name: 'Luna', category: cats._id, breed: 'Siamese', age: '6 months', gender: 'female', color: 'Cream', weight: '3 kg', price: 12000, description: 'Elegant Siamese kitten, very vocal and playful.', images: ['https://images.unsplash.com/photo-1513360309081-36f5e878fc9e?w=600'], status: 'available', isVaccinated: true, addedBy: staff._id, rating: 4.8, numReviews: 7 },
      { name: 'Oliver', category: cats._id, breed: 'British Shorthair', age: '10 months', gender: 'male', color: 'Blue-Grey', weight: '5 kg', price: 20000, description: 'Cute, chunky British Shorthair kitten, very calm and independent.', images: ['https://images.unsplash.com/photo-1574158622643-69d34d72650a?w=600'], status: 'available', isVaccinated: true, isMicrochipped: true, addedBy: staff._id, rating: 4.9, numReviews: 11 },
      { name: 'Simba', category: cats._id, breed: 'Bengal', age: '8 months', gender: 'male', color: 'Spotted Golden', weight: '4.5 kg', price: 25000, description: 'Active Bengal cat with exotic leopard spots, loves water and heights.', images: ['https://images.unsplash.com/photo-1577023311546-cdc07a8454d9?w=600'], status: 'available', isVaccinated: true, addedBy: staff._id, rating: 4.7, numReviews: 6 },

      // Birds
      { name: 'Tweety', category: birds._id, breed: 'Canary', age: '1 year', gender: 'male', color: 'Yellow', weight: '20g', price: 1500, description: 'Active and beautiful singing canary.', images: ['https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=600'], status: 'available', addedBy: staff._id, rating: 4.4, numReviews: 4 },
      { name: 'Kiwi', category: birds._id, breed: 'Parakeet', age: '5 months', gender: 'female', color: 'Green', weight: '35g', price: 1800, description: 'Bright green parakeet, loves mimicking chirps and playing with swings.', images: ['https://images.unsplash.com/photo-1522856283749-6e3d763bb8ee?w=600'], status: 'available', addedBy: staff._id, rating: 4.6, numReviews: 3 },

      // Fish
      { name: 'Nemo', category: fish._id, breed: 'Clownfish', age: '6 months', gender: 'male', color: 'Orange/White', weight: '50g', price: 500, description: 'Vibrant orange clownfish, perfect for marine aquariums.', images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600'], status: 'available', addedBy: staff._id, rating: 4.5, numReviews: 15 },
      { name: 'Goldie', category: fish._id, breed: 'Goldfish', age: '4 months', gender: 'female', color: 'Orange', weight: '70g', price: 350, description: 'Beautiful Oranda Goldfish with a signature head cap.', images: ['https://images.unsplash.com/photo-1524704654690-b56c05c78a02?w=600'], status: 'available', addedBy: staff._id, rating: 4.3, numReviews: 12 },

      // Rabbits
      { name: 'Fluffy', category: rabbits._id, breed: 'Holland Lop', age: '4 months', gender: 'female', color: 'Gray', weight: '1.5 kg', price: 2000, description: 'Sweet Holland Lop rabbit with droopy ears, loves fresh greens.', images: ['https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600'], status: 'available', addedBy: staff._id, rating: 4.8, numReviews: 9 },
      { name: 'Snowball', category: rabbits._id, breed: 'Angora', age: '3 months', gender: 'male', color: 'White', weight: '1.2 kg', price: 2500, description: 'Extremely fluffy white Angora bunny, calm and gentle handler.', images: ['https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600'], status: 'available', addedBy: staff._id, rating: 4.7, numReviews: 4 }
    ]);

    await Product.insertMany([
      // Food (8 Items)
      { name: 'Premium Dog Kibble', category: 'food', petType: ['dogs'], brand: 'PetNutrition', price: 3999, stock: 100, description: 'High protein dry dog food, 10kg bag. Supports joint health, no artificial colors.', images: ['https://images.unsplash.com/photo-1589924506194-3ee415083d68?w=600'], addedBy: staff._id, rating: 4.8, numReviews: 24, weight: '10 kg' },
      { name: 'Grain-Free Cat Kibble', category: 'food', petType: ['cats'], brand: 'WhiskerPro', price: 3299, stock: 80, description: 'Grain-free dry cat food with taurine and real salmon for healthy coat, heart and eyes.', images: ['https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?w=600'], addedBy: staff._id, rating: 4.9, numReviews: 18, weight: '7 kg' },
      { name: 'Balanced Rabbit Pellets', category: 'food', petType: ['rabbits'], brand: 'HopperDiet', price: 2199, stock: 60, description: 'Timothy hay based pellets enriched with vitamins for digestion and dental health.', images: ['https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600'], addedBy: staff._id, rating: 4.7, numReviews: 12, weight: '3 kg' },
      { name: 'NutriBird Seed Mix', category: 'food', petType: ['birds'], brand: 'FeatherFuel', price: 999, stock: 120, description: 'Aromatic bird seed mix containing dried berries, seeds and calcium grit.', images: ['https://images.unsplash.com/photo-1606567595334-d39972c85dbe?w=600'], addedBy: staff._id, rating: 4.5, numReviews: 10, weight: '1 kg' },
      { name: 'Color Boost Fish Flakes', category: 'food', petType: ['fish'], brand: 'AquaBoost', price: 1299, stock: 90, description: 'High-quality fish flakes that enhance natural color, boost immunity and prevent cloudy water.', images: ['https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600'], addedBy: staff._id, rating: 4.6, numReviews: 14, weight: '200g' },
      { name: 'Organic Puppy Treats', category: 'food', petType: ['dogs'], brand: 'BarkBites', price: 699, stock: 150, description: 'Gently baked treats with chicken and sweet potato. Rich in calcium.', images: ['https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600'], addedBy: staff._id, rating: 4.7, numReviews: 22, weight: '400g' },
      { name: 'Gourmet Cat Wet Food', category: 'food', petType: ['cats'], brand: 'FelineFeast', price: 189, salePrice: 159, stock: 300, description: 'Premium tuna flakes and chicken shreds in savory broth, 85g can.', images: ['https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600'], addedBy: staff._id, rating: 4.9, numReviews: 35, weight: '85g' },
      { name: 'Premium Timothy Hay', category: 'food', petType: ['rabbits'], brand: 'HopperDiet', price: 1499, stock: 75, description: 'Sweet, sun-cured Timothy Hay, crucial for rabbit digestive health.', images: ['https://images.unsplash.com/photo-1545259741-2c8d5e6b6f3d?w=600'], addedBy: staff._id, rating: 4.8, numReviews: 19, weight: '2.5 kg' },

      // Accessories (5 Items)
      { name: 'Cat Litter Box Deluxe', category: 'accessories', petType: ['cats'], brand: 'CleanPet', price: 1499, stock: 50, description: 'Enclosed design cat litter box with low entrance and active carbon odor filter.', images: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600'], addedBy: staff._id, rating: 4.4, numReviews: 16 },
      { name: 'Bird Cage Deluxe', category: 'accessories', petType: ['birds'], brand: 'BirdHome', price: 2499, salePrice: 1999, stock: 20, description: 'Spacious tall bird cage with sliding feeding cups, perches and pull-out clean tray.', images: ['https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=600'], addedBy: staff._id, rating: 4.7, numReviews: 11 },
      { name: 'Fish Tank 30L Starter', category: 'accessories', petType: ['fish'], brand: 'AquaWorld', price: 4999, stock: 15, description: 'Curved glass 30L fish tank complete with integrated LED hood filter pump.', images: ['https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?w=600'], addedBy: staff._id, rating: 4.5, numReviews: 7 },
      { name: 'Pet Carrier Backpack', category: 'accessories', petType: ['dogs', 'cats'], brand: 'CarryCo', price: 2799, stock: 35, description: 'Breathable travel backpack carrier with mesh ventilations and travel zippers.', images: ['https://images.unsplash.com/photo-1522435038443-d47cf9509e69?w=600'], addedBy: staff._id, rating: 4.8, numReviews: 25 },
      { name: 'Orthopedic Pet Bed', category: 'accessories', petType: ['dogs', 'cats'], brand: 'SnuggleSoft', price: 3499, stock: 40, description: 'Medical-grade egg crate memory foam dog bed with soft plush bolster and washable cover.', images: ['https://images.unsplash.com/photo-1541599540903-216a46ca1ad0?w=600'], addedBy: staff._id, rating: 4.9, numReviews: 30 },

      // Toys (4 Items)
      { name: 'Dog Chew Toys Set', category: 'toys', petType: ['dogs'], brand: 'PlayPet', price: 599, stock: 75, description: 'Set of 5 heavy-duty natural rubber chew toys for chewing and tooth cleaning.', images: ['https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600'], addedBy: staff._id, rating: 4.6, numReviews: 40 },
      { name: 'Interactive Teaser Wand', category: 'toys', petType: ['cats'], brand: 'WhiskerPlay', price: 499, stock: 110, description: 'Interactive teaser wand with colorful feathers and small bell to stimulate natural hunting.', images: ['https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600'], addedBy: staff._id, rating: 4.8, numReviews: 53 },
      { name: 'Bunny Chew Rope', category: 'toys', petType: ['rabbits'], brand: 'HopperPlay', price: 299, stock: 90, description: 'Eco-friendly, chewable willow and sisal rope toy for small animals.', images: ['https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600'], addedBy: staff._id, rating: 4.5, numReviews: 12 },
      { name: 'Bird Swing Ladder', category: 'toys', petType: ['birds'], brand: 'FeatherFun', price: 799, stock: 55, description: 'Natural wood bird ladder swing toy with bright colorful wooden beads.', images: ['https://images.unsplash.com/photo-1520412486465-5f8b9f8d8f2a?w=600'], addedBy: staff._id, rating: 4.6, numReviews: 9 },

      // Grooming & Medicine (3 Items)
      { name: 'Hypoallergenic Shampoo', category: 'grooming', petType: ['dogs', 'cats'], brand: 'FreshPet', price: 399, stock: 120, description: 'Gentle tear-free shampoo made of organic oatmeal and aloe vera, neutralizes bad odors.', images: ['https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=600'], addedBy: staff._id, rating: 4.7, numReviews: 29 },
      { name: 'De-shedding Undercoat Brush', category: 'grooming', petType: ['dogs', 'cats'], brand: 'GroomGo', price: 899, stock: 65, description: 'Professional steel de-shedding rake, reduces shedding up to 90% in minutes.', images: ['https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600'], addedBy: staff._id, rating: 4.9, numReviews: 44 },
      { name: 'Multi-Vitamin Chews', category: 'medicine', petType: ['dogs', 'cats'], brand: 'VetaHealth', price: 1299, salePrice: 1199, stock: 85, description: 'Daily essential multi-vitamin soft chews containing glucosamine, probiotics and omega-3.', images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600'], addedBy: staff._id, rating: 4.8, numReviews: 18 }
    ]);

    await Service.insertMany([
      { name: 'Basic Grooming', type: 'grooming', description: 'Bath, dry, brush, and nail trim.', price: 999, duration: 60, petTypes: ['dogs', 'cats'], features: ['Bath & Dry', 'Brush Out', 'Nail Trim', 'Ear Cleaning'] },
      { name: 'Full Grooming Package', type: 'grooming', description: 'Complete grooming with haircut and styling.', price: 1999, duration: 120, petTypes: ['dogs', 'cats'], features: ['Full Bath', 'Haircut & Styling', 'Teeth Brushing', 'Cologne'] },
      { name: 'General Checkup', type: 'veterinary', description: 'Comprehensive health examination.', price: 799, duration: 30, petTypes: ['dogs', 'cats', 'birds', 'rabbits'], features: ['Physical Exam', 'Weight Check', 'Health Report', 'Parasite Check'] },
      { name: 'Vaccination', type: 'veterinary', description: 'Core and non-core vaccines available.', price: 599, duration: 20, petTypes: ['dogs', 'cats'], features: ['Core Vaccines', 'Health Certificate', 'Medical Records'] },
      { name: 'Pet Training', type: 'training', description: 'Basic obedience training sessions.', price: 4999, duration: 60, petTypes: ['dogs'], features: ['Obedience Training', 'Behavior Correction', 'Socialization'] },
      { name: 'Pet Boarding', type: 'boarding', description: 'Safe and comfortable overnight stay.', price: 999, duration: 1440, petTypes: ['dogs', 'cats'], features: ['Cozy Accommodation', '3 Meals/Day', 'Playtime', 'Daily Updates'] }
    ]);

    console.log('✅ Seed data inserted successfully');
    console.log('Admin: admin@petstore.com / admin123');
    console.log('Staff: staff@petstore.com / staff123');
    console.log('Customer: customer@petstore.com / customer123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
