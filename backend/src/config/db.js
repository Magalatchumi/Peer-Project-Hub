import mongoose from 'mongoose'
import dns from 'node:dns'

dns.setServers(['8.8.8.8', '8.8.4.4'])

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      family: 4,
    })

    console.log(`MongoDB connected: ${mongoose.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
    process.exit(1)
  }
}