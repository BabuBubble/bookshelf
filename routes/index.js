const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'My Web App' });
});

router.get('/page2', (req, res) => {
    res.render('page2');
});

module.exports = router;
