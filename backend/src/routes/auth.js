import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { registerSchema, loginSchema } from '../validation.js';
import { validate } from '../middleware/validate.js';
import { createAccessToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', validate(registerSchema), async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ where: { email: req.body.email } });
    if (existingUser) return res.status(409).json({ error: 'Email already exists' });

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      passwordHash,
      role: 'user',
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: 'User registered successfully',
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const passwordMatches = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!passwordMatches) return res.status(401).json({ error: 'Invalid email or password' });

    const token = createAccessToken(user);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
