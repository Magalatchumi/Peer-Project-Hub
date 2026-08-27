import Project from '../models/Project.js'

export async function createProject(req, res) {
  try {
    const {
      title, description, category, difficulty, status,
      technologies, imageUrl, github, liveDemo, screenshots,
    } = req.body

    const project = await Project.create({
      owner: req.user._id,
      title,
      description,
      category,
      difficulty,
      status,
      technologies,
      imageUrl,
      github,
      liveDemo,
      screenshots,
    })

    const populated = await project.populate('owner', 'name avatar email')
    res.status(201).json({ project: populated, message: 'Project created successfully' })
  } catch (error) {
    console.error('Create project error:', error)
    res.status(500).json({ error: 'Failed to create project' })
  }
}

export async function getAllProjects(req, res) {
  try {
    const {
      search, category, status, difficulty,
      page = 1, limit = 9,
    } = req.query

    const filter = {}

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    if (category) {
      filter.category = { $in: category.split(',') }
    }

    if (status) {
      filter.status = { $in: status.split(',') }
    }

    if (difficulty) {
      filter.difficulty = { $in: difficulty.split(',') }
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate('owner', 'name avatar email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Project.countDocuments(filter),
    ])

    res.json({
      projects,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    })
  } catch (error) {
    console.error('Get all projects error:', error)
    res.status(500).json({ error: 'Failed to get projects' })
  }
}

export async function getProjectById(req, res) {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('owner', 'name avatar email bio').populate('comments.user', 'name avatar email')

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.json({ project })
  } catch (error) {
    console.error('Get project error:', error)
    res.status(500).json({ error: 'Failed to get project' })
  }
}

export async function updateProject(req, res) {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this project' })
    }

    const allowedFields = [
      'title', 'description', 'category', 'difficulty', 'status',
      'technologies', 'imageUrl', 'github', 'liveDemo', 'screenshots',
    ]

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field]
      }
    })

    await project.save()
    const populated = await project.populate('owner', 'name avatar email')

    res.json({ project: populated, message: 'Project updated successfully' })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ error: 'Failed to update project' })
  }
}

export async function deleteProject(req, res) {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this project' })
    }

    await Project.findByIdAndDelete(req.params.id)
    res.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ error: 'Failed to delete project' })
  }
}

export async function getMyProjects(req, res) {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .populate('owner', 'name avatar email')
      .sort({ createdAt: -1 })

    res.json({ projects })
  } catch (error) {
    console.error('Get my projects error:', error)
    res.status(500).json({ error: 'Failed to get projects' })
  }
}

export async function toggleLike(req, res) {
  try {
    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const userId = req.user._id
    const alreadyLiked = project.likedBy.includes(userId)

    if (alreadyLiked) {
      project.likedBy.pull(userId)
      project.likes = Math.max(0, project.likes - 1)
    } else {
      project.likedBy.push(userId)
      project.likes += 1
    }

    await project.save()

    res.json({ project, liked: !alreadyLiked })
  } catch (error) {
    console.error('Toggle like error:', error)
    res.status(500).json({ error: 'Failed to toggle like' })
  }
}

export async function getUserProjects(req, res) {
  try {
    const projects = await Project.find({ owner: req.params.userId })
      .populate('owner', 'name avatar email')
      .sort({ createdAt: -1 })

    res.json({ projects })
  } catch (error) {
    console.error('Get user projects error:', error)
    res.status(500).json({ error: 'Failed to get user projects' })
  }
}

export async function addComment(req, res) {
  try {
    const { text } = req.body

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Comment text is required' })
    }

    const project = await Project.findById(req.params.id)

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    project.comments.push({ user: req.user._id, text: text.trim() })
    await project.save()

    const populated = await project.populate('comments.user', 'name avatar email')
    const comment = populated.comments[populated.comments.length - 1]

    res.status(201).json({
      comment,
      project: populated,
      message: 'Comment added successfully',
    })
  } catch (error) {
    console.error('Add comment error:', error)
    res.status(500).json({ error: 'Failed to add comment' })
  }
}
