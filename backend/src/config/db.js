import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}
