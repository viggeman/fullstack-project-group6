const connectionMySQL = require('./../connectionMySQL');

exports.getTestMysql = (req, res) => {
  res.send('Här testar vi MySQL.');
};
