<template>

  <div class="page">
    <div class="image-container">
    <img src="../pictures/Movie-Genres-Types-of-Movies-List-of-Genres-and-Categories-Featured.jpg" alt="movie">
    </div>
   <div class="container">
    <h1>GENRE</h1>
     <div>
      <button @click="fetchGenres">Hämta Genres</button>
      <div v-if="genres.length > 0">
        <h2>Lista med Genres:</h2>
        <ul>
          <li v-for="genre in genres" :key="genre.genreId">{{ genre.genreName }} {{ genre.genreId }}</li>
          <input type="text" v-model="deleteOneGenre" @input="validateInput" placeholder="Delete by ID">
          <button @click="deleteGenre" :disabled="!isValidGenreId">Delete</button>

          <p v-if="deleteOneGenre && !isValidGenreId" style="color: red;">Endast siffror tillåtna.</p>
        </ul>
      </div>
     </div>

     <div>
      <input type="text" v-model="newGenreName" placeholder="Add a genre">
      <button @click="addGenre">Add Genre</button>
     </div>
     

     <div>
      <p>Lets Change A Genre</p>
      <input type="text" v-model="newGenreId" placeholder="Enter ID">
      <input type="text" v-model="updateAGenre" placeholder="Update a Genre">
      <button @click="updateGenre">Update</button>
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
      updateAGenre: ""

    };
  },
  methods: {
  async fetchGenres() {
    console.log('Knappen nedtryckt');
    try {
      const response = await fetch('http://localhost:3000/api/genres');
      const jsonData = await response.json();
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
    this.newGenreName = ""; // Rensa inputfältet
    console.log('Genre added:', newGenre);

  } catch (error) {
    console.error('Error adding genre:', error);
  }
},

async deleteGenre(){
  const genreId = this.deleteOneGenre.trim();
  console.log('DELETE', genreId)

  if(!genreId){
    console.log('Genre måste vara ifyllt');
    return
  }

  try{
    const response = await fetch('http://localhost:3000/api/genres',{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ genreId })
    })
    if(response.ok){
      console.log(`Genre with ${genreId} has been removed`)
      this.deleteOneGenre = '';
    }else{
      console.log(`Failed to remove with ID ${genreId}`)
    }
  }catch(error){
    console.log('Error deleting', error)
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
    background-color: #dfb1b1; 
    display: flex;
    flex-direction: column; 
    align-items: flex-start; 
    height: 100vh; 
    box-sizing: border-box; 
  }


.container {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(61, 39, 90, 0.2); 
  padding: 20px;
  border-radius: 5px;
  max-width: 600px;
  top: 35%; 
  left: 35%;  
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container2 {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    
    background-color: #dfb1b1; 
    min-height: 80vh;
  }

  .image-container{
    width: 100%;
    max-height: 250px; 
    overflow: hidden; 
  }
  .paragraphs {
    width: calc(50% - 20px); 
    margin-top: 20px;
    margin-bottom: 20px; 
    padding: 20px; 
    border-radius: 5px; 
    box-sizing: border-box; 
  }

  .paragraphs h2 {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 20px;
    margin-bottom: 10px;
  }

  
  .paragraphs p {
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }

.cover-input-group{
  border: solid white 2px;
  
}
.form-group {
  margin-bottom: 20px;
}

.fetch-button {
  margin: 10px;
  padding: 10px;
  font-size: 16px;
  background-color: #523e52;
  color: #000000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 150px; /* Anpassa bredden efter behov */
}


.genre-select {
  margin: 10px;
  padding: 5px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 5px;
}

.input-group {
  margin: 25px 0; /* Justera övre och nedre marginalen efter behov */
  border: solid black 2 px;
}

.input-group input {
  margin-bottom: 20px; /* Öka avståndet mellan input-fälten */
  padding: 15px; /* Justera kudden för input-fälten efter behov */
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 5px;
}

.input-group button {
  margin-top: 20px; /* Öka avståndet mellan input-fälten och knappen */
  padding: 15px 30px; /* Justera kudden för knappen efter behov */
  font-size: 16px;
  background-color: #28a745;
  color: #000000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.input-group button:hover {
  background-color: #218838;
}

h2{
  font-size: 4rem;
  color: rgb(0, 0, 0);
}

  </style>
  