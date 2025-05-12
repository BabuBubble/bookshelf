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

router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], (err, results) => {
        if (err) throw err;
        res.redirect('/login');
    });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if ((email === 'test1@example.com' && password === '1234') || (email === 'test2@example.com' && password === '4321')) {
    req.session.user = { email };
    res.json({ message: 'Logged in' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: 'Logged Out'});
    });
});

module.exports = router;
