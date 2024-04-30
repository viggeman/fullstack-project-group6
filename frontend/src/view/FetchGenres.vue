<template>

  <div class="page">
    <div class="image-container">
    <img src="../pictures/Movie-Genres-Types-of-Movies-List-of-Genres-and-Categories-Featured.jpg" alt="movie">
    </div>
   <div class="container">
    <form @submit.prevent="submitForm" class="form">

      <h2>Genre</h2>
      <div class="input-group">
        <input type="text" v-model="newGenre" placeholder="Genre Namn">
        <p v-if="newGenre.length < 4 && newGenre.length > 0" style="color: red;">Fyll i minst 4 bokstäver</p>
      </div>

      <div class="input-group">
        <button @click="validateAndAddGenre">Lägg till Genre</button>
      </div>
      

      <div class="form-group">
        <button class="fetch-button" @click="fetchGenres">Hämta Genres</button>
        <select class="genre-select" v-if="genres.length > 0" v-model="selectedGenre">
          <option v-for="genre in genres" :key="genre.id" :value="genre">{{ genre.genreName }} (ID: {{ genre.genreId }})</option>
        </select>
      </div>
      <div class="delete">
        <button class="fetch-button" @click="deleteGenre">Ta bort</button>
      </div>

      <div class="put">
        <input type="text" v-model="updatedGenreName" placeholder="Nytt Genre Namn">
        <button class="fetch-button" @click="updateGenre">Ändra</button>
      </div>

    </form>
  </div>
</div>
<div class="container2">
  <div class="paragraphs">
  <h2>Drama</h2>
  <p>
In the hushed stillness of fading light,
Moments linger, charged with emotion bright.
Silent tears, words unspoken,
A heart's journey, raw and unbroken.
Drama unfolds in whispers deep,
Where souls collide and secrets keep.</p>
</div>

<div class="paragraphs">
  <h2>Action</h2>
  <p>
    Thunderous beats of adrenaline's roar,
Heroes rise on an epic score.
Fists of fury, danger's call,
Echoes of battles that shake the walls.
Explosions blaze across the sky,
In the realm where courage does fly.</p>
</div>

<div class="paragraphs">
  <h2>Romance</h2>
  <p>
    Soft whispers beneath a starlit sky,
Two souls meet, hearts soaring high.
A dance of glances, a touch so sweet,
Love's tender embrace, a timeless feat.
In every heartbeat, a tale unfolds,
Of love's enduring, magical holds.</p>
</div>

<div class="paragraphs">
  <h2>Comedy</h2>
  <p>
    Laughter erupts in waves of delight,
Where jokes and mischief take flight.
Quirky characters, antics bold,
A world of humor, a joy to behold.
In the realm of smiles, worries flee,
As laughter reigns, wild and free.</p>
</div>
<div class="paragraphs">
  <h2>Horror</h2>
  <p>
    In shadows' realm where fears take flight,
Ghosts whisper, haunting the night.
Echoes in silence, darkness deep,
Unseen steps on floors that creak.
  </p>
</div>
</div>

</template>

<script>
export default {
  data() {
    return {
      genres: [],
      selectedGenre: null,
      newGenre: "",
      genreID: "",
      buttonClicked: false,
      updatedGenreName: ""
    };
  },
  methods: {
    async fetchGenres() {
      try {
        const response = await fetch('http://localhost:3000/api/genres');
        const jsonData = await response.json();
        this.genres = jsonData.sort((a, b) => a.genreName.localeCompare(b.genreName));
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    },
    validateAndAddGenre() {
      this.buttonClicked = true;
      if (this.newGenre.length >= 4 && this.genreID.trim() !== "") {
        this.addGenre();
      }
    },
    async addGenre() {
      try {
        const genreData = {
          genreName: this.newGenre
          
        };

        const response = await fetch('http://localhost:3000/api/genres', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(genreData)
        });

        if (response.ok) {
          this.newGenre = '';
          
          console.log('Genre added successfully!');
        } else {
          console.error('Failed to add genre:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding genre:', error);
      }
    },
    async deleteGenre() {
      if (this.selectedGenre) {
        const { genreId, genreName } = this.selectedGenre;
        const url = `http://localhost:3000/api/genres/${genreId}`;

        try {
          const response = await fetch(url, {
            method: 'DELETE'
          });

          if (response.ok) {
            console.log(`Genre '${genreName}' (ID: ${genreId}) deleted successfully!`);
            
            this.fetchGenres(); 
           
          } else {
            const errorMessage = await response.text();
            console.error('Failed to delete genre:', errorMessage);
          }
        } catch (error) {
          console.error('Error deleting genre:', error);
        }
      } else {
        console.warn('Vänligen välj en genre att ta bort.');
      }
    },
    async updateGenre() {
      if (this.selectedGenre && this.updatedGenreName) {
        const { genreName } = this.selectedGenre;
        const url = `http://localhost:3000/api/genres/${genreName}`;

        try {
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              genreName: this.updatedGenreName
            })
          });

          if (response.ok) {
            console.log('Genre updated successfully!');
            this.fetchGenres(); 
            this.updatedGenreName = '';
          } else {
            const errorMessage = await response.text();
            console.error('Failed to update genre:', errorMessage);
          }
        } catch (error) {
          console.error('Error updating genre:', error);
        }
      } else {
        console.warn('Vänligen välj en genre och ange det nya genrenamnet.');
      }
    },
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
  