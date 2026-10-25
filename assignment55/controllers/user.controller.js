const { User } = require('../models');

// 1. Create a new user (using build and save) + email check + validation
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const newUser = User.build({ name, email, password, role });

    // Custom password validation check (> 6 characters)
    if (!newUser.checkPasswordLength()) {
      return res.status(400).json({ message: "Password length must be greater than 6 characters." });
    }

    await newUser.save();
    return res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// 2. Create or update based on PK and skip validation option
exports.upsertUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    await User.upsert(
      { id: Number(id), name, email, role },
      { validate: false } // تخطي التحقق (skip validation option)
    );

    return res.status(200).json({ message: "User created or updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. Find user by email address
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. Retrieve user by PK, excluding "role" field
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['role'] } // استبعاد حقل الـ role
    });

    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};