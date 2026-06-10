const mongoose = require('mongoose');

const connectDB = async () => {
  const dbUri = process.env.MONGO_URI || 'mongodb+srv://bharathkumar:eyecontact123@bharath007.l9hvroe.mongodb.net/petstore?appName=bharath007';
  
  try {
    const conn = await mongoose.connect(dbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    const src = /mongodb\.net/.test(dbUri) ? 'Atlas' : 'Local';
    console.log(`MongoDB connected (${src}): ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection to Atlas failed: ${error.message}`);
    
    const localUri = process.env.MONGO_URI_LOCAL || 'mongodb://127.0.0.1:27017/petstore';
    console.log(`Attempting fallback connection to local MongoDB: ${localUri}`);
    
    try {
      const conn = await mongoose.connect(localUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB connected (Local Fallback): ${conn.connection.host}`);
    } catch (localError) {
      console.error(`MongoDB local connection also failed: ${localError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
