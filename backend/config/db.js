const mongoose = require('mongoose');

const connectDB = async () => {
  const dbUri = process.env.MONGO_URI || 'mongodb://bharathkumar:eyecontact123@ac-dhszfot-shard-00-00.l9hvroe.mongodb.net:27017,ac-dhszfot-shard-00-01.l9hvroe.mongodb.net:27017,ac-dhszfot-shard-00-02.l9hvroe.mongodb.net:27017/petstore?ssl=true&authSource=admin&retryWrites=true&w=majority';
  
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
