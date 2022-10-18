const express = require('express');
require('dotenv').config();

const app = express();
const cors = require('cors');
const router = express.Router();
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

// app.use('/', (req, res) => {
//   res.send('FIRST PAGE');
// });
// app.use('/hello', (req, res) => {
//   res.send('Bienvenido. Server On.');
// });

app.set('port', process.env.PORT || 2000);

app.use(express.json());

app.use('/auth', authRoutes); //LOGIN/REGISTER ROUTES
app.use('/profile', profileRoutes); //USER ROUTES
app.use('/post', postRoutes); //POST ROUTES

app.listen(app.get('port'), () => {
  console.log(app.get('port'));
});
