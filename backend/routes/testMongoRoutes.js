const express = require('express');
const router = express.Router();
const testMongoController = require('../controllers/mongooseController');

// GET request
router.get('/api/testMongo', testMongoController.getTestMongoose);
router.get(
  '/api/testMongoParam/:params',
  testMongoController.getTestMongooseParam
);
// POST request
router.post('/api/testMongoBody', testMongoController.postTestMongooseBody);
router.post('/api/testMongo', testMongoController.postTestMongoose);
// Delete request
router.delete('/api/testMongo', testMongoController.deleteTestMongoose);
router.delete(
  '/api/testMongoParam/:params',
  testMongoController.deleteTestMongooseParam
);
// PUT request
router.put('/api/testMongo', testMongoController.putTestMongoose);
router.put(
  '/api/testMongoParam/:params',
  testMongoController.putTestMongooseParam
);

module.exports = router;
