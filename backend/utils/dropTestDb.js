const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const run = async () => {
  const dbUri = process.env.MONGO_URI || 'mongodb+srv://bharathkumar:eyecontact123@bharath007.l9hvroe.mongodb.net/petstore?retryWrites=true&w=majority&appName=bharath007';
  
  // We want to connect to the 'test' database to drop it
  // Find where '/petstore' is or connect directly to the test database
  const testDbUri = dbUri.replace('/petstore', '/test');

  try {
    console.log('Connecting to database...');
    const conn = await mongoose.connect(testDbUri);
    console.log(`Connected. Dropping database: ${conn.connection.db.databaseName}`);
    await conn.connection.db.dropDatabase();
    console.log('Database dropped successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to drop database:', err.message);
    process.exit(1);
  }
};

run();
