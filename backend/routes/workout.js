// /backend/routes/workout.js
import express from 'express';
import Workout from '../models/Workout.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route  GET /api/workouts
// @desc   Get all workouts for current user (paginated)
// @access Private
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit) || 5)); // Cap limit at 100
    const skip = (page - 1) * limit;

    const total = await Workout.countDocuments({ user: req.user._id });
    const workouts = await Workout.find({ user: req.user._id })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      workouts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
});

// @route  GET /api/workouts/stats
// @desc   Get workout stats (total count, total calories)
// @access Private
router.get('/stats', async (req, res) => {
  try {
    const stats = await Workout.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalCalories: { $sum: '$caloriesBurned' },
          totalDuration: { $sum: '$duration' },
        },
      },
    ]);

    const data = stats[0] || { totalWorkouts: 0, totalCalories: 0, totalDuration: 0 };
    res.json({ success: true, stats: data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route  POST /api/workouts
// @desc   Add a workout
// @access Private
router.post('/', async (req, res) => {
  try {
    const { title, type, duration, caloriesBurned, notes, date } = req.body;

    // Validation
    if (!title || !type || duration === undefined || caloriesBurned === undefined) {
      return res.status(400).json({ success: false, message: 'Title, type, duration, and calories are required' });
    }

    // Type validation
    const validTypes = ['cardio', 'strength', 'flexibility', 'hiit', 'yoga', 'sports', 'other'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: `Invalid workout type. Must be one of: ${validTypes.join(', ')}` });
    }

    // Duration validation
    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum < 1) {
      return res.status(400).json({ success: false, message: 'Duration must be a positive number (minutes)' });
    }

    // Calories validation
    const caloriesNum = parseInt(caloriesBurned);
    if (isNaN(caloriesNum) || caloriesNum < 0) {
      return res.status(400).json({ success: false, message: 'Calories burned must be a non-negative number' });
    }

    const workout = await Workout.create({
      user: req.user._id,
      title,
      type,
      duration: durationNum,
      caloriesBurned: caloriesNum,
      notes,
      date: date || Date.now(),
    });

    res.status(201).json({ success: true, workout });
  } catch (error) {
    console.error('Error creating workout:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  PUT /api/workouts/:id
// @desc   Update a workout
// @access Private
router.put('/:id', async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' });

    // Ensure user owns this workout
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route  DELETE /api/workouts/:id
// @desc   Delete a workout
// @access Private
router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ success: false, message: 'Workout not found' });

    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await workout.deleteOne();
    res.json({ success: true, message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
