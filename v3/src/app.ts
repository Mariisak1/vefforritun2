import dotenv from "dotenv";
import express, {NextFunction, Request, Response} from 'express';
import { catchErrors } from './lib/catch-errors.js';
import { router } from './routes/api.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(router);

const port = 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

app.use((req: Request, res: Response) => {
  res.status(404).json({error: 'path not found'});
});
