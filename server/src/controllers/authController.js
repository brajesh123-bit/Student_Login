import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

export const registerStudent = async (req, res) => {
  try {
    const { name, email, password, course } = req.body;

    if (!name || !email || !password || !course) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingStudent = await Student.findOne({ email: email.toLowerCase() });

    if (existingStudent) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      course,
    });

    return res.status(201).json({
      message: 'Student registered successfully',
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        course: student.course,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while registering student' });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const student = await Student.findOne({ email: email.toLowerCase() });

    if (!student) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, student.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid login credentials' });
    }

    return res.status(200).json({
      message: 'Login successful',
      token: createToken(student._id),
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        course: student.course,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while logging in' });
  }
};

export const getProfile = async (req, res) => {
  return res.status(200).json({ student: req.student });
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    const student = await Student.findById(req.student._id);
    const isOldPasswordValid = await bcrypt.compare(oldPassword, student.password);

    if (!isOldPasswordValid) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    student.password = await bcrypt.hash(newPassword, 10);
    await student.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while updating password' });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { course } = req.body;

    if (!course) {
      return res.status(400).json({ message: 'Course is required' });
    }

    const student = await Student.findByIdAndUpdate(
      req.student._id,
      { course },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      message: 'Course updated successfully',
      student,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error while updating course' });
  }
};
