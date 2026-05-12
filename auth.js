import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_this';

// Register
router.post('/register', async (req, res) => {
  try {
    const startTime = Date.now();
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const checkTime = Date.now();
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    const checkDuration = Date.now() - checkTime;
    console.log(`[DB Query] User.findOne() - ${checkDuration}ms`);

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'An account already exists with that email.' });
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      savedCars: [],
    });

    const saveTime = Date.now();
    await newUser.save();
    const saveDuration = Date.now() - saveTime;
    console.log(`[DB Query] User.save() - ${saveDuration}ms`);

    const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const totalDuration = Date.now() - startTime;
    console.log(`[Register] Total duration: ${totalDuration}ms`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        savedCars: newUser.savedCars,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const startTime = Date.now();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter both email and password.' });
    }

    const findTime = Date.now();
    const user = await User.findOne({ email: email.toLowerCase() });
    const findDuration = Date.now() - findTime;
    console.log(`[DB Query] User.findOne() - ${findDuration}ms`);

    if (!user) {
      return res.status(400).json({ success: false, message: 'No account found with that email.' });
    }

    const compareTime = Date.now();
    const isPasswordValid = await user.comparePassword(password);
    const compareDuration = Date.now() - compareTime;
    console.log(`[bcrypt] Password comparison - ${compareDuration}ms`);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Wrong password.' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d',
    });

    const totalDuration = Date.now() - startTime;
    console.log(`[Login] Total duration: ${totalDuration}ms`);

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        savedCars: user.savedCars,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Get current user (requires token)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        savedCars: user.savedCars,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
});

// Add car to user's saved cars
router.post('/cars', async (req, res) => {
  try {
    const startTime = Date.now();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const findTime = Date.now();
    const user = await User.findById(decoded.userId);
    const findDuration = Date.now() - findTime;
    console.log(`[DB Query] User.findById() - ${findDuration}ms`);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const car = req.body;
    user.savedCars.push(car);
    
    const saveTime = Date.now();
    await user.save();
    const saveDuration = Date.now() - saveTime;
    console.log(`[DB Query] User.save() with car - ${saveDuration}ms`);

    const totalDuration = Date.now() - startTime;
    console.log(`[Add Car] Total duration: ${totalDuration}ms`);

    res.status(201).json({
      success: true,
      message: 'Car added to saved cars.',
      savedCars: user.savedCars,
    });
  } catch (error) {
    console.error('Add car error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// Delete car from user's saved cars
router.delete('/cars/:carId', async (req, res) => {
  try {
    const startTime = Date.now();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const findTime = Date.now();
    const user = await User.findById(decoded.userId);
    const findDuration = Date.now() - findTime;
    console.log(`[DB Query] User.findById() - ${findDuration}ms`);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.savedCars = user.savedCars.filter((car) => car.id !== req.params.carId);
    
    const saveTime = Date.now();
    await user.save();
    const saveDuration = Date.now() - saveTime;
    console.log(`[DB Query] User.save() after delete - ${saveDuration}ms`);

    const totalDuration = Date.now() - startTime;
    console.log(`[Delete Car] Total duration: ${totalDuration}ms`);

    res.status(200).json({
      success: true,
      message: 'Car deleted from saved cars.',
      savedCars: user.savedCars,
    });
  } catch (error) {
    console.error('Delete car error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

export default router;
