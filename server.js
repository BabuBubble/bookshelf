require('dotenv').config();
const express = require('express');
const app = express();
const indexRouter = require('./routes/index');
const session = require('express-session');

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: 'w10HIiLh2skMRTV0mHle1xQhO8gXNyavloWgmAPx04CP1WR',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 60 * 60 * 1000 } // 1時間
}));

app.use('/', indexRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
