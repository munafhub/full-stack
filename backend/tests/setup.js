import { beforeEach, afterAll } from 'vitest';
import { sequelize } from '../src/models/index.js';

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});
