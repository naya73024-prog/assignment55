const { Comment, User, Post } = require('../models');
const { Op } = require('sequelize');

// 1. Create a bulk of Comments
exports.createBulkComments = async (req, res) => {
  try {
    const { comments } = req.body;
    await Comment.bulkCreate(comments);
    return res.status(201).json({ message: "comments created." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. Update the content of a specific comment by ID (Ensure owner check)
exports.updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found." });
    }

    if (comment.userId !== Number(userId)) {
      return res.status(403).json({ message: "You are not authorized to update this comment." });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json({ message: "Comment updated." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Find or create a comment
exports.findOrCreateComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content },
      defaults: { postId, userId, content }
    });

    return res.status(200).json({ comment, created });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. Retrieve all comments that contain a specific word and count them
exports.searchComments = async (req, res) => {
  try {
    const { word } = req.query;

    const { count, rows: comments } = await Comment.findAndCountAll({
      where: {
        content: {
          [Op.like]: `%${word}%`
        }
      }
    });

    if (count === 0) {
      return res.status(404).json({ message: "no comments found." });
    }

    return res.status(200).json({ count, comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 5. Retrieve 3 most recent comments for a specific post, ordered by creation date
exports.getNewestComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      order: [['createdAt', 'DESC']],
      limit: 3,
      attributes: ['id', 'content', 'createdAt']
    });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 6. Get Specific Comment By PK with User and Post Information
exports.getCommentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id, {
      attributes: ['id', 'content'],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Post,
          attributes: ['id', 'title', 'content']
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({ message: "no comment found" });
    }

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};