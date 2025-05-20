const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const db = require('./db');
const gbooks_util = require('./googlebooksapi.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', (req, res) => {
    const is_login = req.session.user ? true : false;
    res.render('index', { login: is_login });
});

router.get('/mypage', async (req, res) => {
    const is_login = req.session.user ? true : false;
    if ( !is_login ) {
        return res.redirect('/login');
    }

    const userId = req.session.user.id;

    try {
      [results] = await db.query('SELECT * FROM books WHERE user_id = ?', [userId]);
      res.render('mypage', { 
        login: is_login ,
        books: results
      });
    } catch ( err ) {
      console.error('DataBase Error:', err);
      res.status(500).send('An error has occurred.');
    }
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/search', async (req, res) => {
  const is_login = req.session.user ? true : false;
  const q = req.query.q || '';
  const pages = req.query.pages;
  try {
    const search_results = await gbooks_util.get_books( q, pages );
    const is_next = (search_results && search_results.items) ? search_results.items.length >= 11 : false;
    res.render('search_book', { login: is_login, search_results: search_results, query: q, pages: pages, is_next: is_next });
  } catch ( err ) {
    console.error('', err);
    res.status(500).send('検索中にエラーが発生しました');
  }
});
/*
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    db.query('INSERT INTO user (email, password_hash) VALUES (?, ?)', [email, hashedPassword], (err, results) => {
        if (err) throw err;
        res.redirect('/login');
    });
});
*/
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

router.post('/book_register', async (req, res) => {
  const book_data = req.body;
  try {
    [hits] = await db.query('SELECT * FROM books WHERE user_id = ? and api_link = ?', [req.session.user.id, book_data.selfLink]);
    if ( hits.length == 0 ) {
      [into_result] = await db.query('INSERT INTO books (user_id, title, api_link, publication_Date, series_id, image_link, info_link) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [
          req.session.user.id, 
          book_data.volumeInfo.title, 
          book_data.selfLink, 
          book_data.volumeInfo.publishedDate, 
          book_data.volumeInfo.seriesInfo ? book_data.volumeInfo.seriesInfo.volumeSeries.seriesId : null, 
          (book_data.volumeInfo.imageLinks && book_data.volumeInfo.imageLinks.smallThumbnail) ? book_data.volumeInfo.imageLinks.smallThumbnail : null, 
          book_data.volumeInfo.infoLink
        ]);
      res.json({ message: 'add Bookshelf' });
    }
  } catch ( err ) {
    console.error('Registation: error', err);
  }
}); 

module.exports = router;
