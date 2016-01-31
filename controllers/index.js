'use strict';

var IndexModel = require('../models/index');


module.exports = function (router) {
    new IndexModel(function(model) {
    	router.get('/', function (req, res) {
        	res.render('index', model);
    	});
    });
};
