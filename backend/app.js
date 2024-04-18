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

app.use(testRoutes);
app.use(testMongoRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
('');
