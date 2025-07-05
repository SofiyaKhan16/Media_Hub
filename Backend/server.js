import express from 'express';
import cors from 'cors';
import { accountRoutes, mediaFileRoutes } from './routes/index.js';
import connectDB from './config/database.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import fs from 'fs';
import errorHandler from './middleware/errorHandler.js';

const swaggerDocument = YAML.load('./config/swagger.yaml');

const app = express();
const PORT = process.env.PORT || 5000;

const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
} else {
  fs.readdirSync(uploadsDir).forEach(file => {
    fs.unlinkSync(`${uploadsDir}/${file}`);
  });
}

app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('API is up and running.');
});

app.use('/api/account', accountRoutes);
app.use('/api/media', mediaFileRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
