const express = require('express');
const connectDB = require('./config/db');

app = express();
connectDB();

//Bodyparser Middleware
app.use(express.json({ extendend: false }));

//Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/reclist', require('./routes/api/reclist'));
app.use('/api/search', require('./routes/api/search'));

app.get('/', (req, res) => {
  res.send('<h1>Test</h1>');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
