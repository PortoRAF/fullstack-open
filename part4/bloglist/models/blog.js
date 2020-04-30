const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  url: String,
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  likes: Number
})

blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  },
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
