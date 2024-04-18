const express = require('express');
const router = express.Router();
const testMysqlController = require('../controllers/mysqlController');

router.get('/api/testMysql', testMysqlController.getTestMysql);
router.get(
  '/api/testMysqlParam/:params',
  testMysqlController.getTestMysqlParam
);
router.post('/api/testMysqlBody', testMysqlController.postTestMysqlBody);
router.post('/api/testMysql', testMysqlController.postTestMysql);
router.delete('/api/testMysql', testMysqlController.deleteTestMysql);
router.put('/api/testMysql', testMysqlController.putTestMysql);

module.exports = router;
