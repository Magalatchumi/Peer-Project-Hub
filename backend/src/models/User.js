import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 300,
    },
    skills: {
      type: [String],
      default: [],
    },
    github: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    portfolio: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

userSchema.virtual('projectCount', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'owner',
  count: true,
})

userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })

const User = mongoose.model('User', userSchema)

export default User
