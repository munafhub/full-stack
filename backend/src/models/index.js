import fs from 'node:fs';
import path from 'node:path';
import { Sequelize, DataTypes } from 'sequelize';

// ---------------------------------------------------------------------------
// Database selection
//  - tests            -> in-memory SQLite
//  - DATABASE_URL set -> PostgreSQL (needs: npm install pg pg-hstore)
//  - otherwise        -> SQLite file. On Railway set SQLITE_PATH=/data/tasks.sqlite
//                        and attach a Volume mounted at /data, otherwise the file
//                        is wiped on every redeploy.
// ---------------------------------------------------------------------------
function createSequelize() {
  if (process.env.NODE_ENV === 'test') {
    return new Sequelize({ dialect: 'sqlite', storage: ':memory:', logging: false });
  }

  if (process.env.DATABASE_URL) {
    const useSsl = process.env.DATABASE_SSL === 'true';
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
    });
  }

  const storage = path.resolve(process.env.SQLITE_PATH || 'data/tasks.sqlite');
  fs.mkdirSync(path.dirname(storage), { recursive: true });
  return new Sequelize({ dialect: 'sqlite', storage, logging: false });
}

export const sequelize = createSequelize();

export const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
});

export const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  completed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
});

User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });
