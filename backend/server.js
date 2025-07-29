require('dotenv').config();
const app = require('./app');
const setupSwagger = require('./src/utils/swagger');
setupSwagger(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 