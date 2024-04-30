const express = require('express');
const router = express.Router();
const {
  getWriters,
  getWriter,
  createWriter,
  updateWriter,
  deleteWriter,
} = require('../controllers/writersController');

router.get('/api/writers', getWriters);
router.get('/api/writers/:id', getWriter);
router.post('/api/writers', createWriter);
router.put('/api/writers', updateWriter);
router.delete('/api/writers', deleteWriter);

module.exports = router;
