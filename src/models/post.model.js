const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({

  content: { 
    type: String, 
    required: true 
  },
  media: { 
    type: String, 
    required: false
   }, // URL de la imagen o video
  AdminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'admin', 
    required: true 
  },
  likes: [{ 
    type: mongoose.Schema.Types.ObjectId,
     ref: 'admin' 
    }], // IDs de usuarios que dieron like
  comments: [{
    AdminId: { type: mongoose.Schema.Types.ObjectId, 
      ref: 'admin' },
    comment: { type: String,
       required: true },
    createdAt: { type: Date,
       default: Date.now
       }
  }],
  createdAt: {
     type: Date,
      default: Date.now }
});

const Post = mongoose.model('Publicacion', postSchema)

module.exports = Post;