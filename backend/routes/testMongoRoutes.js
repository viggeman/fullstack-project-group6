const express = require('express');
const router = express.Router();
const testMongoController = require('../controllers/mongooseController');

router.get('/api/testMongo', testMongoController.getTestMongoose);

module.exports = router;
