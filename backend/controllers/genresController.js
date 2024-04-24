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

exports.postGenre = async (req, res) => {
    const { genreName, genreId } = req.body; 
  
    // Ett vilkor

    if (!genreName || genreName.length < 4) {
        return res.status(400).json({ error: "Genren måste innehålla mer än 4 bokstäver" });
      }
  
    // Skapar SQL Frågan
    let sql = "INSERT INTO genres (genreName, genreId) VALUES (?,?)";
    let params = [genreName, genreId]
    try {
      await connectionMySQL.query(sql, params,(error, results)=>{
        if(error){
            throw error;
        }
        return res.status(201).json({
            success: true,
            error: "",
            message: 'Du har lagt till en ny genre.'
        })
      })
    } catch (error) {
        return res.status(500).json({
            succes: false,
            error: error.message
        })
    }
  };

  // Ta bort en genre, DELETE

  exports.deleteOneGenre = async (req, res) => {
    const { genreId } = req.params;
  
    if (!genreId) {
      return res.status(400).json({
        success: false,
        error: 'Du måste välja ett ID-nummer för att ta bort en genre.'
      });
    }
  
    const sql = "DELETE FROM genres WHERE genreId = ?";
    try {
      await connectionMySQL.query(sql, [genreId]);
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

exports.changeGenre = async (req, res) =>{
    const { genreName, genreId } = req.body;
    const sql = "UPDATE genres SET genreName = ? WHERE genreId = ?"
    const params = [genreName , genreId]

    if(!genreId || !genreName){
        return res.status(400).json({
            success: false,
            error: 'Genren måste ha ett namn och ett ID'
        })
    }
    try{
        await connectionMySQL.query(sql, params);
        res.status(200).json({
            success: true,
            message: 'En genre har uppdaterats!'
        })
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}