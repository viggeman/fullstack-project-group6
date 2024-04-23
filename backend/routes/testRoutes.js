const express = require('express');
const router = express.Router();
const testMysqlController = require('../controllers/mysqlController');

// GET request
router.get('/api/testMysql', testMysqlController.getTestMysql);
router.get(
  '/api/testMysqlParam/:params',
  testMysqlController.getTestMysqlParam
);
// POST request
router.post('/api/testMysqlBody', testMysqlController.postTestMysqlBody);
router.post('/api/testMysql', testMysqlController.postTestMysql);

// Delete request
router.delete('/api/testMysql', testMysqlController.deleteTestMysql);
router.delete(
  '/api/testMysqlParam/:params',
  testMysqlController.deleteTestMysqlParam
);

// PUT request
router.put('/api/testMysql', testMysqlController.putTestMysql);
router.put(
  '/api/testMysqlParam/:params',
  testMysqlController.putTestMysqlParam
);

module.exports = router;
