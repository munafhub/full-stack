import bcrypt from 'bcryptjs';
import { app } from './app.js';
import { sequelize, User } from './models/index.js';

const PORT = process.env.PORT || 4000;

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set. Set it in Railway > Variables before going live.');
}

// Optional: create an admin account on startup when ADMIN_EMAIL + ADMIN_PASSWORD are set.
async function ensureAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
  if (existing) return;
  await User.create({
    name: 'Admin User',
    email: ADMIN_EMAIL,
    passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
    role: 'admin',
  });
  console.log(`Admin account created: ${ADMIN_EMAIL}`);
}

try {
  await sequelize.sync();
  await ensureAdmin();
} catch (error) {
  console.error('Database initialisation failed:', error);
  process.exit(1);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Tasks API running on port ${PORT}`);
});
