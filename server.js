const express = require('express');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');

app = express();
connectDB();

//Bodyparser Middleware
app.use(express.json({ extendend: false }));

//Rate Limiter
app.set('trust proxy', 1);
const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5,
});
app.use('/api/users/resendverification', apiLimiter);
app.use('/api/users/forgotpassword', apiLimiter);

//Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/reclist', require('./routes/api/reclist'));
app.use('/api/search', require('./routes/api/search'));
app.use('/api/pinnedlist', require('./routes/api/pinnedlist'));

app.get('/', (req, res) => {
  res.send('<h1>Test</h1>');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
