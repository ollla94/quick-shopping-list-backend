const app = require('./app');
const sequelize = require('./database');

sequelize
  .sync()
  .then(result => {
    app.listen(8080);
  })
  .catch(err => {
    console.log(err);
  });
