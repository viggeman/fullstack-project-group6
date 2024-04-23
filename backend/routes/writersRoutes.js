const express = require('express');
const router = express.Router();
const writersController = require('../controllers/writersController');

router.get('/api/writers', writersController.getWriters);
router.get('/api/writers/:id', writersController.getWriter);
router.post('/api/writers', writersController.createWriter);
router.put('/api/writers', writersController.updateWriter);
router.delete('/api/writers', writersController.deleteWriter);

module.exports = router;
