import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      required: true,
      enum: ['Web Development', 'AI / ML', 'Mobile Apps', 'IoT', 'Blockchain', 'Cloud', 'Data Science', 'Game Development'],
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    status: {
      type: String,
      enum: ['Completed', 'In Progress', 'Open for Collaboration'],
      default: 'In Progress',
    },
    technologies: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    liveDemo: {
      type: String,
      default: '',
    },
    screenshots: {
      type: [String],
      default: [],
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    likedBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    comments: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          text: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
          },
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

projectSchema.index({ title: 'text', description: 'text' })
projectSchema.index({ category: 1, status: 1, difficulty: 1 })

const Project = mongoose.model('Project', projectSchema)

export default Project
