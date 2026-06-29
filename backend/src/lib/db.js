import mongoose from "mongoose";

export async function connectDB(){
  try{
    const mongoUri = process.env.MONGO_URL

    if(!mongoUri){
      throw new Error("MONGO_URL is required");
    }
    const connect = await mongoose.connect(mongoUri)

    console.log("Database connected Successfully",connect.connection.host);

  }catch(error){
     console.error("MongoDB connection error:",error.message);
     process.exit(1);
     //1 means failed, 0 means success
  }
}