import { startServer, createServer } from '#shared';

const app = createServer();

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

app.get('/', (req, res) => {
  res.render('victim');
});

startServer(app, { name: 'Clickbait Victim' });
