import express from 'express';
import cors from 'cors';
import { computeTargets, dailyPlan, weeklyPlan, evaluateFood } from './nutrition.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/plan', (req, res) => {
  const targets = computeTargets(req.body);
  res.json({
    daily: dailyPlan(targets),
    weekly: weeklyPlan(targets)
  });
});

app.post('/api/scan', (req, res) => {
  res.json(evaluateFood(req.body));
});

app.listen(3000, () => console.log('Backend on http://localhost:3000'));
