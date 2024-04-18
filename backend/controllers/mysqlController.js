const connectionMySQL = require('./../connectionMySQL');

exports.getTestMysql = (req, res) => {
  res.send('GET MySQL.');
};

exports.getTestMysqlParam = (req, res) => {
  const { params } = req.params;
  res.send('GET MySQL params: ' + params);
};

exports.postTestMysqlBody = (req, res) => {
  const { body } = req.body;
  res.send('POST MySQL body: ' + JSON.stringify(body));
};

exports.postTestMysql = (req, res) => {
  res.send('POST MySQL.');
};

exports.deleteTestMysql = (req, res) => {
  res.send('DELETE MySQL.');
};

exports.putTestMysql = (req, res) => {
  res.send('PUT MySQL.');
};
