// commentController.js

const db = require('../db'); // Import your database module for SQL queries

// Get comments by composer ID
exports.getCommentsByComposer = async (req, res) => {
  const { composerId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM comments WHERE composerId = ?', [composerId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Server error');
  }
};

// Add a new comment
exports.addComment = async (req, res) => {
  const { composerId } = req.params;
  const { userName, commentText } = req.body;
  try {
    await db.query('INSERT INTO comments (composerId, userName, commentText) VALUES (?, ?, ?)', [composerId, userName, commentText]);
    res.status(201).send('Comment added');
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).send('Server error');
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { commentText } = req.body;
  try {
    await db.query('UPDATE comments SET commentText = ? WHERE _id = ?', [commentText, commentId]);
    res.send('Comment updated');
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).send('Server error');
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    await db.query('DELETE FROM comments WHERE _id = ?', [commentId]);
    res.send('Comment deleted');
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).send('Server error');
  }
};
