const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

// Parse JSON bodies
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(express.static('public'));

const testRoutes = require('./routes/testRoutes');
const testMongoRoutes = require('./routes/testMongoRoutes');
const actorsRoutes = require('./routes/actorsRoutes');
// const directorsRoutes = require('./controllers/directorsController');
// const genresRoutes = require('./controllers/genresController');
// const movieActorsRoutes = require('./controllers/movieActorsController');
// const moviesRoutes = require('./controllers/moviesController');
// const writersRoutes = require('./controllers/writersController');

app.use(testRoutes);
app.use(testMongoRoutes);
app.use(actorsRoutes);
// app.use(directorsRoutes);
// app.use(genresRoutes);
// app.use(movieActorsRoutes);
// app.use(moviesRoutes);
// app.use(writersRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
('');
