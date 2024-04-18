const express = require('express');
const router = express.Router();
const testMysqlController = require('../controllers/mysqlController');

router.get('/api/testMysql', testMysqlController.getTestMysql);

module.exports = router;
