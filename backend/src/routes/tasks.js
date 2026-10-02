import { Router } from 'express';
import { Task, User } from '../models/index.js';
import { createTaskSchema, updateTaskSchema, taskIdSchema } from '../validation.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const ownTask = (task, userId) => task && task.userId === Number(userId);

router.post('/', validate(createTaskSchema), async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, userId: req.user.userId });
    const result = await Task.findByPk(task.id, { include: User });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.userId },
      include: User,
      order: [['id', 'ASC']],
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validate(taskIdSchema, 'params'), async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, { include: User });
    if (!ownTask(task, req.user.userId)) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validate(taskIdSchema, 'params'), validate(updateTaskSchema), async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!ownTask(task, req.user.userId)) return res.status(404).json({ error: 'Task not found' });

    await task.update(req.body);
    const result = await Task.findByPk(task.id, { include: User });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', validate(taskIdSchema, 'params'), async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!ownTask(task, req.user.userId)) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
