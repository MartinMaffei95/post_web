const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors');

const authRoutes = require('./routes/auth'); // Connection with Router
const profileRoutes = require('./routes/profiles'); // Connection with Router
const postRoutes = require('./routes/posts'); // Connection with Router

require('./connection'); // Connection with DB
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.set('port', process.env.PORT || 3000);

app.use(express.json());

app.use('/auth', authRoutes); //LOGIN/REGISTER ROUTES
app.use('/profile', profileRoutes); //USER ROUTES
app.use('/post', postRoutes); //POST ROUTES

app.listen(app.get('port'), () => {
  console.log('App running in port ' + app.get('port'));
});
