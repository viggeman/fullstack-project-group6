<template>

  <div class="page">
    <div class="image-container">
    <img src="../pictures/Movie-Genres-Types-of-Movies-List-of-Genres-and-Categories-Featured.jpg" alt="movie">
    </div>
   <div class="container">
    <h1 style="color: whitesmoke">GENRE</h1>
     <div>
      <button @click="fetchGenres">Hämta Genres</button>
      <div v-if="genres.length > 0">
        <h2 style="color: whitesmoke">Lista med Genres:</h2>
        <ul>
          <li v-for="genre in genres" :key="genre.genreId">{{ genre.genreName }} {{ genre.genreId }}</li>
          <input type="text" v-model="deleteOneGenre" @input="validateInput" placeholder="Delete by ID">
          <button @click="deleteGenre" :disabled="!isValidGenreId">Delete</button>

          <p v-if="deleteOneGenre && !isValidGenreId" style="color: red;">Only numbers allowed.</p>
          <p v-if="genreDeleted" style="color: greenyellow;">You deleted a genre.</p>
        </ul>
        <div>
      <input type="text" v-model="newGenreName" placeholder="Add a genre">
      <button @click="addGenre">Add Genre</button>
      <p v-if="addedGenre" style="color: greenyellow">You've added a genre.</p>
     </div>
      </div>
     </div>


     
     <div>
      <p>Lets Change A Genre</p>
      <input type="text" v-model="newGenreId" placeholder="Enter ID">
      <input type="text" v-model="updateAGenre" placeholder="Update a Genre">
      <button @click="updateGenre">Update</button>
      <p v-if="updatedOneGenre" style="color: greenyellow">Updated a genre</p>

    </div>

   </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      genres: [],
      newGenreName: "",
      deleteOneGenre: "",
      isValidGenreId: false,
      newGenreId: "",
      updateAGenre: "",
      genreDeleted: false,
      addedGenre: false,
      updatedOneGenre: false

    };
  },
  methods: {
  async fetchGenres() {
    console.log('Knappen nedtryckt');
    try {
      const response = await fetch('http://localhost:3000/api/genres');
      const jsonData = await response.json();
      jsonData.sort((a, b) => a.genreName.localeCompare(b.genreName));
      this.genres = jsonData;
      
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  },
  validateInput() {
      this.isValidGenreId = /^\d+$/.test(this.deleteOneGenre.trim());
    },
  async addGenre() {
  console.log('Added');
  
  try {
    const response = await fetch('http://localhost:3000/api/genres', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ genreName: this.newGenreName })
    });
    const newGenre = await response.json();
    this.genres.push(newGenre); 
    
    this.addedGenre = true;
    this.newGenreName = ""; // Rensa inputfältet
    console.log('Genre added:', newGenre);

  } catch (error) {
    console.error('Error adding genre:', error);
  }
},

async deleteGenre() {
  const genreId = this.deleteOneGenre.trim();
  console.log('DELETE', genreId);

  if (!genreId) {
    console.log('Genre ID måste vara ifyllt.');
    return;
  }

  try {
    // Kontrollera om genren med angivet ID finns innan borttagning
    //const checkResponse = await fetch(`http://localhost:3000/api/genres/${genreId}`);
    //if (!checkResponse.ok) {
      //console.log(`Genre med ID ${genreId} hittades inte. Borttagning avbruten.`);
      //return;
   // }

    // Om genren finns, fortsätt med att utföra borttagningen
    const deleteResponse = await fetch('http://localhost:3000/api/genres', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ genreId })
    });

    if (deleteResponse.ok) {
      console.log(`Genre med ID ${genreId} har tagits bort.`);
      this.genreDeleted = true;
      this.deleteOneGenre = '';
    } else {
      console.log(`Misslyckades med att ta bort genren med ID ${genreId}.`);
    }
  } catch (error) {
    console.log('Fel vid borttagning av genre:', error);
  }
},

async updateGenre() {
  console.log('Uppdaterar');
  
  try {
    const response = await fetch('http://localhost:3000/api/genres', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        genreId: this.newGenreId,
        genreName: this.updateAGenre
      })
    });

    const data = await response.json();
  
    if (response.ok) {
      console.log(`Genren med ID ${this.newGenreId} har uppdaterats till "${this.updateAGenre}"`);
      this.updatedOneGenre = true;
      this.newGenreId = '';
      this.updateAGenre = '';
    } else {
      console.error(`Misslyckades att uppdatera genren: ${data.error}`);
    }
  } catch (error) {
    console.error('Fel vid uppdatering av genren:', error);
  }
}

}

};
</script>

  <style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  background-color: #574040;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Styling för bild */
.image-container {
  text-align: center;
}
.image-container img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Styling för container */
.container {
  margin-top: 20px;
}

/* Styling för rubriker */
h1, h2, p {
  color: #333;
}

/* Styling för knappar */
button {
  margin: 3px;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Styling för listor */
ul {
  padding-left: 0;
}

/* Styling för input-fält */
input[type="text"] {
  width: calc(100% - 130px);
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 10px;
}
input[type="text"]:focus {
  outline: none;
  border-color: #007bff;
}

/* Styling för felmeddelanden */
p.error-message {
  color: red;
}
  </style>
  