const express = require('express');
const router = express.Router();
const testMongoController = require('../controllers/mongooseController');

router.get('/api/testMongo', testMongoController.getTestMongoose);
router.get(
  '/api/testMongoParam/:params',
  testMongoController.getTestMongooseParam
);
router.post('/api/testMongoBody', testMongoController.postTestMongooseBody);
router.post('/api/testMongo', testMongoController.postTestMongoose);
router.delete('/api/testMongo', testMongoController.deleteTestMongoose);
router.put('/api/testMongo', testMongoController.putTestMongoose);

module.exports = router;
