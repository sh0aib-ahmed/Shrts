var express = require('express');
var router = express.Router();
var app = express();
const Url = require('../models/url');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('pages/home',{title: 'Shrts'});
});

router.get('/:shortCode', async (req, res, next) => {
  var shortCode = req.params.shortCode;
  await Url.findOneAndUpdate({"shortCode": shortCode},{
    $set: {
    "lastAccessed": new Date()
    }
  },{
    new: true
  })
  .then((url) => {
    if(url)
      res.redirect(url.longUrl);
    else {
      res.render('pages/error',{title: 'Shrts | Page Not Found'});
    }
    },(err) => next(err))  
  .catch((err) => next(err));
});

module.exports = router;
