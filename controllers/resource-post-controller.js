const ResourcePost = require('../models/resource-post');

class ResourcePostController {
  static createResourcePost(req, res) {
    const { sender, postType, resourceType, message, zip } = req.body;
    ResourcePost.createResourcePost({
      sender,
      postType,
      resourceType,
      message,
      zip,
    })
      .then((newPost) => {
        req.app.get('io').emit('new resource post', newPost);
        res.status(201).send({ message: 'success' });
      })
      .catch((e) => {
        res.status(400).send(e.message);
      });
  }

  static getAllResourcePosts(req, res) {
    ResourcePost.getAllResourcePosts(req.query)
      .then((posts) => {
        res.status(200).json(posts);
      })
      .catch((e) => {
        res.status(400).send(e.message);
      });
  }

  static createResourcePostComment(req, res) {
    const { postId } = req.params;
    ResourcePost.createResourcePostComment(postId, req.body)
      .then((newComment) => {
        req.app.get('io').emit('new resource post comment', newComment);
        res.status(201).send({ message: 'success' });
      })
      .catch((e) => {
        res.status(400).send(e.message);
      });
  }

  static getResourcePostById(req, res) {
    const { postId } = req.params;
    ResourcePost.getResourcePostById(postId)
      .then((post) => {
        res.status(200).json(post);
      })
      .catch((e) => {
        res.status(400).send(e.message);
      });
  }
}

module.exports = ResourcePostController;
