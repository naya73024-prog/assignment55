const User = require('./user.model');
const Post = require('./post.model');
const Comment = require('./comment.model');

// العلاقات بين المستخدم والمنشورات
User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

// العلاقات بين المستخدم والتعليقات
User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

// العلاقات بين المنشور والتعليقات
Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

module.exports = { User, Post, Comment };