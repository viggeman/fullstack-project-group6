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
const moviesRoutes = require('./routes/moviesRoutes');
const movieActorsRoutes = require('./routes/movieActorsRoutes');

app.use(testRoutes);
app.use(testMongoRoutes);
app.use(writersRoutes);
app.use(actorsRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
('');
