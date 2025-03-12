import mongoose from 'mongoose';

const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      break;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      await new Promise((resolve) => setTimeout(resolve, 5000)); 
    }
  }
  if (!retries) {
    console.error('Failed to connect to MongoDB after multiple retries');
    process.exit(1);
  }
};

export default connectDB;