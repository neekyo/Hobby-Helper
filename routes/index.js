const express = require('express');
const { adminAuth } = require('../middleware/admin-routes')
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  console.log(req.user)
  res.render('index');
});

router.get('/secret', adminAuth, (req, res, next) => {
  console.log('adminnn paggeeee')
  res.render('user-views/secret')
})

module.exports = router;
