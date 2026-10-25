const { Post, User, Comment } = require('../models');
const sequelize = require('../config/database');

// 1. Create new Post (using new instance and save)
exports.createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    const post = new Post({ title, content, userId });
    await post.save();

    return res.status(201).json({ message: "Post created successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. Delete post by id (Ensure that only the owner can perform this action)
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body; // إرسال الـ userId في الـ body للتحقق من المالك

    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    if (post.userId !== Number(userId)) {
      return res.status(403).json({ message: "You are not authorized to delete this post." });
    }

    await post.destroy(); // Soft delete بسبب paranoid: true
    return res.status(200).json({ message: "Post deleted." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Retrieve all posts, including details of user and comments (specific fields)
exports.getPostsDetails = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: ['id', 'title'],
      include: [
        {
          model: User,
          attributes: ['name']
        },
        {
          model: Comment,
          attributes: ['id', 'content']
        }
      ]
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. Retrieve all posts and count the number of comments associated with each post
exports.getPostsCommentCount = async (req, res) => {
  try {
    const posts = await Post.findAll({
      attributes: [
        'id',
        'title',
        [sequelize.fn('COUNT', sequelize.col('Comments.id')), 'commentCount']
      ],
      include: [{
        model: Comment,
        attributes: []
      }],
      group: ['Post.id']
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};