module.exports = {
  // mongodb: {
  //   host: 'localhost',
  //   user: 'root',
  //   password: '',
  //   database: 'postWeb',
  //   port: 27017,
  // },
  mongodb: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
  },
};
