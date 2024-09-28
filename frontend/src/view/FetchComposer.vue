<template>
  <div class="composer-list">
    <h1>Composers</h1>
    <!-- List of Composers -->
    <ul>
      <li v-for="composer in composers" :key="composer.composerId">
        <div v-if="composer.isEditing">
          <input v-model="composer.editedName" placeholder="Edit Composer Name" />
          <button @click="updateComposer(composer)">Save</button>
          <button @click="cancelEdit(composer)">Cancel</button>
        </div>
        <div v-else>
          <h2>{{ composer.composerName }}</h2>
          <button @click="enableEdit(composer)">Edit</button>
        </div>
      </li>
    </ul>

    <!-- Global Comments Section -->
    <div class="comments-section">
      <h3>Comments</h3>
      <ul>
        <li v-for="comment in comments" :key="comment._id">
          <div v-if="comment.isEditing">
            <input v-model="comment.editedText" placeholder="Edit Comment" />
            <button @click="updateComment(comment)">Save</button>
            <button @click="cancelCommentEdit(comment)">Cancel</button>
          </div>
          <div v-else>
            <strong>{{ comment.userName }}:</strong> {{ comment.commentText }}
            <button @click="enableCommentEdit(comment)">Edit</button>
            <button @click="deleteComment(comment._id)">Delete</button>
          </div>
        </li>
      </ul>
      <input v-model="newComment" placeholder="Add a comment" />
      <button @click="addComment">Post Comment</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FetchComposers',
  data() {
    return {
      composers: [],
      comments: [],
      newComment: '',
    };
  },
  created() {
    this.fetchComposers();
    this.fetchComments();
  },
  methods: {
    async fetchComposers() {
      try {
        const response = await axios.get('http://localhost:3000/api/composers');
        this.composers = response.data.map(composer => {
          composer.isEditing = false;
          composer.editedName = composer.composerName;
          return composer;
        });
      } catch (error) {
        console.error('Error fetching composers:', error);
      }
    },

    async fetchComments() {
      try {
        const response = await axios.get('http://localhost:3000/api/comments');
        console.log('Fetched comments: ', response.data);
        this.comments = response.data || [];
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },

    async addComment() {
      if (!this.newComment) return alert('Comment cannot be empty');
      try {
        await axios.post('http://localhost:3000/api/comments', {
          userName: 'Anonymous', // Replace with real user info if available
          commentText: this.newComment,
        });
        this.newComment = ''; // Clear the input field
        this.fetchComments(); // Refresh the comments
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    },

    async updateComment(comment) {
      if (!comment.editedText) return alert('Comment cannot be empty');
      try {
        await axios.put(`http://localhost:3000/api/comments/${comment._id}`, {
          commentText: comment.editedText,
        });
        comment.commentText = comment.editedText; // Update the comment text
        comment.isEditing = false; // Exit edit mode
      } catch (error) {
        console.error('Error updating comment:', error);
      }
    },

    async deleteComment(commentId) {
      try {
        await axios.delete(`http://localhost:3000/api/comments/${commentId}`);
        this.fetchComments(); // Refresh the comments
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    },

    enableEdit(composer) {
      composer.isEditing = true;
    },

    cancelEdit(composer) {
      composer.isEditing = false;
      composer.editedName = composer.composerName; // Revert to original name
    },

    enableCommentEdit(comment) {
      comment.isEditing = true;
      comment.editedText = comment.commentText; // Pre-fill with current text
    },

    cancelCommentEdit(comment) {
      comment.isEditing = false;
      comment.editedText = ''; // Clear edit text
    }
  }
};
</script>

<style scoped>
/* Add styles for comments */
.comments-section {
  margin-top: 10px;
}

input {
  margin: 5px;
}

button {
  margin: 5px;
}
</style>
