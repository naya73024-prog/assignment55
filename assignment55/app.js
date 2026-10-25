const express = require('express');
const sequelize = require('./config/database');

// استدعاء ملفات الـ Routes
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');

const app = express();
app.use(express.json());

// ربط المسارات بالـ Application
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

// الاتصال بقاعدة البيانات وتشغيل السيرفر
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database connected and synced successfully.');
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => {
    console.error('Unable to connect to database:', err);
  });