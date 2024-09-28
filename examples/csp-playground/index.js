import { createServer, startServer } from '#shared';
import helmet from "helmet";

import { db } from './database.js';

const app = createServer({
  log: true,
});

app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    defaultSrc: ["'none'"],
    scriptSrc: ["'none'"],
    styleSrc: ["'self'",'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net',],
    imgSrc: ["'self'", 'https://static.frontendmasters.com', 'https://fav.farm',],
    fontSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com',],
    connectSrc: ["'self'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
    reportTo: 'csp-violation-report',
    /* styleSrc: ["'self'", 'https://cdn.jsdelivr.net'],
    imgSrc: ["'self'", 'https://cdn.jsdelivr.net'],
    connectSrc: ["'self'", 'https://cdn.jsdelivr.net'],
    fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
    objectSrc: ["'self'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'self'"],
    workerSrc: ["'self'"], */

  },
  reportOnly: false,
}));

app.get('/', (req, res) => {
  res.render('index', { title: 'Content Security Policy' });
});

app.get('/data', async (req, res) => {
  const rows = await db.all('SELECT * FROM data');
  res.json(rows);
});

app.post('/data', async (req, res) => {
  const { value } = req.body;

  const result = await db.run('INSERT INTO data (value) VALUES (?)', [value]);
  res.json({ id: result.lastID });
});

app.all('/echo', (req, res) => {
  res.json(req.body);
});

app.post('/report', async (req, res) => {
  console.log(req.body);

  res.json({ message: 'Report received' });
});

startServer(app, { name: 'CSP' });
