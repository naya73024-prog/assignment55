const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true // للتاكد من صحة صيغة الإيميل (Built-in validation)
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  }
}, {
  timestamps: true,
  hooks: {
    // Custom validation method في beforeCreate للتأكد أن الاسم أكبر من حرفين
    beforeCreate: (user) => {
      if (user.name && user.name.length <= 2) {
        throw new Error('Name must be greater than 2 characters');
      }
    }
  }
});

// Custom validation method للتأكد أن طول الباسورد أكبر من 6 حروف
User.prototype.checkPasswordLength = function() {
  return this.password && this.password.length > 6;
};

module.exports = User;