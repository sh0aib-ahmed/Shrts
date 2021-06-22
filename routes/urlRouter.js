const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('../config');
const shortid = require('shortid');
const validUrl = require('valid-url');
const Url = require('../models/url');

const urlRouter = express.Router();

urlRouter.use(bodyParser.json());

urlRouter.post('/', async (req,res,next) => {
    var longUrl = req.body.longUrl.trim();
    var baseUrl = config.baseUrl;
    if(!validUrl.isWebUri(longUrl)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        var data = {
            'success': false,
            'message': 'Long Url not valid'
        }
        res.json(data);
        return;
    }
    if(req.body.shortCode && req.body.shortCode.trim() !== "") {
        var shortCode = req.body.shortCode.trim();
        var regex = /[^A-Za-z0-9-_]+/g;
        if(regex.test(shortCode)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            var data = {
                'success': false,
                'message': 'May Contain (A-Z),(a-z),(1-9),(-),(_)'
            }
            res.json(data);
            return;
        }
        if(shortCode.length < 4 && shortCode.length > 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            var data = {
                'success': false,
                'message': 'Alias must be atleast 4 characters long'
            }
            res.json(data);
            return;
        }
    }
    else {
        var shortCode = shortid.generate();
    }
    await Url.findOne({"shortCode": shortCode})
        .then(async (url) => {
            if(url) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                var data = {
                    'success': false,
                    'message': 'Alias already exists.'
                }
                res.json(data);
                return; 
            }
            
            var url = new Url({
                "longUrl": longUrl,
                "shortCode": shortCode 
            });
            await Url.create(url)
            .then((url) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                var shortUrl = baseUrl + url.shortCode;
                var data = {
                    'success': true,
                    'shortUrl': shortUrl
                }
                res.json(data);
            },(err) => next(err))
            .catch((err) => next(err));
    },(err) => next(err))
    .catch((err) => next(err));
});

module.exports = urlRouter;
