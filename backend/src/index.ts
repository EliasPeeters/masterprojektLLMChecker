import express from 'express';
import evaluationRoutes from './routes/evaluation';
import {EvaluationAnswer} from "./db/models/EvaluationAnswer";
import {EvaluationItem} from "./db/models/EvaluationItems";
import {sequelize} from "./db/db";
import statusRoutes from './routes/statusRoutes';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3300;

app.use(cors());
app.use(express.json());
app.use('/api/evaluation', evaluationRoutes);
app.use('/', statusRoutes);


sequelize.authenticate()
  .then(() => {
    console.log('DB connected');
    app.listen(PORT, () => {
      console.log(`Server läuft auf http://localhost:${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error('DB connection failed:', err);
  });
