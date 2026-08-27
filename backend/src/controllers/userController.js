import User from '../models/User.js'
import { getAuth } from '../config/firebase.js'

export async function register(req, res) {
  try {
    const { name } = req.body
    const firebaseUid = req.firebaseUid
    const email = req.firebaseEmail

    const existing = await User.findOne({ firebaseUid })
    if (existing) {
      return res.status(200).json({ user: existing, message: 'User already registered' })
    }

    const user = await User.create({
      firebaseUid,
      name: name || email.split('@')[0],
      email,
    })

    res.status(201).json({ user, message: 'User registered successfully' })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Failed to register user' })
  }
}

export async function getProfile(req, res) {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUid })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ user })
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
}

export async function updateProfile(req, res) {
  try {
    const { name, bio, skills, github, linkedin, portfolio, avatar } = req.body

    const user = await User.findOne({ firebaseUid: req.firebaseUid })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (name !== undefined) user.name = name
    if (bio !== undefined) user.bio = bio
    if (skills !== undefined) user.skills = skills
    if (github !== undefined) user.github = github
    if (linkedin !== undefined) user.linkedin = linkedin
    if (portfolio !== undefined) user.portfolio = portfolio
    if (avatar !== undefined) user.avatar = avatar

    await user.save()

    res.json({ user, message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
}

export async function getPublicProfile(req, res) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json({ user })
  } catch (error) {
    console.error('Get public profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
}
