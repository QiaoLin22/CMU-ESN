const mongoose = require('mongoose');

const resourcePostCommentSchema = mongoose.Schema({
  sender: {
    type: String,
    required: [true, 'Sender is required'],
  },
  timestamp: {
    type: String,
    required: [true, 'Timestamp is required'],
    default: () => new Date(Date.now()).toISOString(),
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
  },
});

const resourcePostSchema = mongoose.Schema({
  sender: {
    type: String,
    required: [true, 'Sender is required'],
  },
  zip: {
    type: String,
    required: [true, 'Zip code is required'],
  },
  timestamp: {
    type: String,
    required: [true, 'Timestamp is required'],
    default: () => new Date(Date.now()).toISOString(),
  },
  postType: {
    type: String,
    enum: ['request', 'share'],
    required: [true, 'Post type is required'],
  },
  resourceType: {
    type: String,
    required: [true, 'Resource type is required'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  comments: [resourcePostCommentSchema],
});

class ResourcePostClass {
  static createResourcePost(post) {
    return this.create(post);
  }

  static getAllResourcePosts(query) {
    return this.find(query, { comments: 0 });
  }

  static getResourcePostById(postId) {
    return this.findById(postId);
  }

  static async createResourcePostComment(postId, comment) {
    await this.update({ _id: postId }, { $push: { comments: comment } });
    return { ...comment, timestamp: new Date(Date.now()).toISOString() };
  }
}

resourcePostSchema.loadClass(ResourcePostClass);

const ResourcePost = mongoose.model('ResourcePost', resourcePostSchema);

module.exports = ResourcePost;
