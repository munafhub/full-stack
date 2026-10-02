import { app } from './app.js';
import { sequelize } from './models/index.js';

const PORT = process.env.PORT || 4000;

await sequelize.sync();

app.listen(PORT, () => {
  console.log(`Tasks API running on http://localhost:${PORT}`);
});
