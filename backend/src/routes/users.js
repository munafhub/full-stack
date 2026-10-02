import { Router } from 'express';
import { User, Task } from '../models/index.js';
import { createUserSchema } from '../validation.js';
import { validate } from '../middleware/validate.js';
import bcrypt from 'bcryptjs';

const router = Router();

router.post('/', validate(createUserSchema), async (req, res, next) => {
  try {
    const passwordHash = await bcrypt.hash('AdminCreated123', 10);
    const user = await User.create({ ...req.body, passwordHash, role: 'user' });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email already exists' });
    }
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      include: { model: Task, as: 'Tasks' },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;
