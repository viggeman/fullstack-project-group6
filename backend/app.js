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

// Only add routers that works, or else it will throw an error
const testRoutes = require('./routes/testRoutes');
const testMongoRoutes = require('./routes/testMongoRoutes');
const writersRoutes = require('./routes/writersRoutes');
const actorsRoutes = require('./routes/actorsRoutes');
const movieActorsRoutes = require('./routes/movieActorsRoutes');
const genresRoutes = require('./routes/genresRoutes');
const moviesRoutes = require('./routes/moviesRoutes');
const directorsRoutes = require('./routes/directorsRoutes');
const userRoutes = require('./routes/userRoutes');

app.use(testRoutes);
app.use(testMongoRoutes);
app.use(writersRoutes);
app.use(actorsRoutes);
app.use(movieActorsRoutes);
app.use(genresRoutes);
app.use(moviesRoutes);
app.use(directorsRoutes);
app.use(userRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
('');
