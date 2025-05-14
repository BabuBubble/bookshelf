const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', (req, res) => {
    const is_login = req.session.user ? true : false;
    res.render('index', { login: is_login });
});

router.get('/mypage', (req, res) => {
    const is_login = req.session.user ? true : false;
    if ( !is_login ) {
        res.redirect('/login');
    }
    res.render('mypage', { 
        title: req.session.user.email,
        login: is_login ,
    });
    return;

    const userId = req.session.user.id;

    db.query('SELECT * FROM books WHERE user_id = ?', [userId], (err, results) => {
        if (err) throw err;

        res.render('mypage', { 
            title: req.session.user.email,
            login: is_login ,
            books: result
        });
    });
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/test', (req, res) => {
});

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.query('INSERT INTO user (email, password_hash) VALUES (?, ?)', [email, hashedPassword], (err, results) => {
        if (err) throw err;
        res.redirect('/login');
    });
});

router.post('/login', async (req, res) => {
  console.log('login: start');
  const { email, password } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM user WHERE email = ?', [email]);

    if ( results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if ( match ) {
      req.session.user = { id: user.id, email: user.email };
      res.json({ message: 'Logged in' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch ( err ) {
    console.error('login: error', err);
  }
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged Out'});
    });
});

module.exports = router;
