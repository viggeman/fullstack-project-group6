const connectionMySQL = require('../connectionMySQL');

//Hämta alla Genres, GET.

exports.getAllGenres = async (req, res) => {

  let sql = "SELECT * FROM genres";
  try {
    await connectionMySQL.query(sql,(error, results)=>{
        if(error){
            throw error;
        }
        res.json(results)
    })
  }catch(error){
    res.status(500).json({
        error: error.message
    })
  }
};

// Lägg till en Genre, POST
// Ny ändring, Ska bara finnas genreName. Lös detta.

exports.postGenre = async (req, res) => {
    const { genreName } = req.body; 
  
    // Kolla om genreName är tomt eller för kort
    if (!genreName || genreName.length < 4) {
        return res.status(400).json({ error: "Genren måste innehålla minst 4 bokstäver." });
    }
  
    let sql = "INSERT INTO genres (genreName) VALUES (?)";
    let params = [genreName];
    
    try {
        await connectionMySQL.query(sql, params, (error, results) => {
            if (error) {
                throw error;
            }
            return res.status(201).json({
                success: true,
                error: "",
                message: 'Du har lagt till en ny genre.'
            });
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

  // Ta bort en genre, DELETE

  exports.deleteOneGenre = async (req, res) => {
    const { genreId } = req.body;

    if (!genreId) {
      return res.status(400).json({
        success: false,
        error: 'Du måste välja ett ID-nummer för att ta bort en genre.'
      });
    }

    try {
      
      // Radera Genren.
      const deleteGenreQuery = "DELETE FROM genres WHERE genreId = ?";
      await connectionMySQL.query(deleteGenreQuery, [genreId]);

      res.status(200).json({
        success: true,
        message: "En Genre är borttagen!"
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
};

  // Ändra en Genre, PUT

  exports.changeGenre = async (req, res) => {
    const { genreName, genreId } = req.body;
    
    const sql = "UPDATE genres SET genreName = ? WHERE genreId = ?";
    const params = [genreName, genreId];

    try {
        if (!genreName || genreName.trim() === "") {
            return res.status(400).json({
                success: false,
                error: 'Genre måste ha ett namn'
            });
        }

        // Logga värden för genreName och genreId för debuggning.
        console.log('Updating genre with genreId:', genreId);
        console.log('New genreName:', genreName);

        await connectionMySQL.query(sql, params);

        res.status(200).json({
            success: true,
            message: 'Genrenamn har uppdaterats!'
        });
    } catch (error) {
    
        console.error('Error updating genre:', error);
        res.status(500).json({
            success: false,
            error: 'Det uppstod ett fel vid uppdatering av genrenamn'
        });
    }
};