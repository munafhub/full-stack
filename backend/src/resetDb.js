import bcrypt from 'bcryptjs';
import { sequelize, User } from './models/index.js';

await sequelize.sync({ force: true });
const passwordHash = await bcrypt.hash('Admin123', 10);
await User.create({
  name: 'Admin User',
  email: 'admin@example.com',
  passwordHash,
  role: 'admin',
});
console.log('Database reset successfully. Admin login: admin@example.com / Admin123');
await sequelize.close();
