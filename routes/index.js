const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();

router.get('/', (req, res) => {
    const is_login = req.session.user ? true : false;
    res.render('index', { login: is_login });
});

router.get('/mypage', (req, res) => {
    const is_login = req.session.user ? true : false;
    if ( is_login ) {
        res.render('mypage', { 
            title: req.session.user.email,
            login: is_login 
        });
    } else {
        res.redirect('/login');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
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
