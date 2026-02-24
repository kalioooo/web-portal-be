import { Router } from 'express';

export const analyticsRouter = Router();

// Stub: return same shape as frontend dummy data (visitorsData, chatRequestsData)
analyticsRouter.get('/', (req, res) => {
  const visitors = [
    { date: 'Mon', visitors: 1200, users: 800 },
    { date: 'Tue', visitors: 1500, users: 950 },
    { date: 'Wed', visitors: 1800, users: 1100 },
    { date: 'Thu', visitors: 1400, users: 900 },
    { date: 'Fri', visitors: 2200, users: 1400 },
    { date: 'Sat', visitors: 2800, users: 1800 },
    { date: 'Sun', visitors: 2400, users: 1600 },
  ];
  const chatRequests = [
    { date: 'Mon', requests: 450, responses: 420 },
    { date: 'Tue', requests: 520, responses: 490 },
    { date: 'Wed', requests: 680, responses: 640 },
    { date: 'Thu', requests: 560, responses: 520 },
    { date: 'Fri', requests: 850, responses: 800 },
    { date: 'Sat', requests: 920, responses: 880 },
    { date: 'Sun', requests: 780, responses: 740 },
  ];
  res.json({ visitors, chatRequests });
});
